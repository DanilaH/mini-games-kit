# Local daily reminders: Android integration recipe

This is a production recipe, not an exported scheduler, Android bootstrap or SDK dependency. Import the portable day/streak model from `@danilah/mini-games-kit/core`; implement native scheduling in the consumer. Source: `SeedsDailyReminder.java`, `SeedsEngagementPlugin.java` and the engagement flows in `main.ts` at [Seeds 1.1](../extraction/SEEDS_110.md).

## Bridge and durable boundaries

The source bridge exposes notification capability/permission status, a permission request, opening Android notification settings and a daily-entry event. The native receiver owns scheduling/delivery outside the JS process. Give a new game's equivalent operations explicit unavailable/denied/ready outcomes; absence of the bridge must not block gameplay or saving.

Save reminder preference and local `HH:mm` separately from the OS grant. An enabled preference is not permission and not proof of scheduled delivery. The initial preference, time and prompt moment are product policy. Seeds requests permission after a saved current-day win or a settings action, records the automatic prompt once and respects explicit refusal/disable. Do not accidentally change another game's existing preference during migration.

Reconcile the schedule after durable progress/settings changes, native resume, boot/package replacement and clock/timezone changes. Read the committed state rather than an optimistic JS snapshot. Failed notification work must not make an otherwise successful game save fail. Treat temporarily unreadable/corrupt/future state conservatively: skip state-specific promises until it can be read, rather than infer a fresh player.

## Scheduling and delivery

- Choose inexact local-time delivery for a casual daily reminder. The source uses `AlarmManager.setAndAllowWhileIdle` and no exact-alarm permission. Reschedule the next local day from calendar components, not a permanent 24-hour millisecond interval. OS/battery restrictions can delay delivery; UI should say approximately the selected time.
- Declare/request `POST_NOTIFICATIONS` where required; check both application/channel availability. For boot restoration declare the required receiver/permission in the final merged manifest. Use immutable `PendingIntent`s and a dedicated notification channel. This recipe does not introduce server push tokens or a background polling service.
- Schedule one next occurrence. Disabling or denying notifications cancels both pending reminder and stale visible notification. Completing today's task clears today's notification and prevents a later receiver from announcing it as incomplete.
- At delivery recheck permission, preference, local day/time, already-completed task, last delivered day, foreground state and external/fullscreen windows. Drop messages outside a configured useful lateness window instead of dumping yesterday's reminder on launch. Seeds uses a finite window and at most one message per day; values are not kit defaults.
- Persist the per-day delivery claim before `notify`. This favors avoiding duplicate messages over retrying after a crash between claim and display; document that tradeoff. It is not transactional exactly-once OS delivery. A backwards clock does not permit duplicate delivery within that saved stream.
- Tap opens today's task, with cold-start and warm-intent handling, rather than a stale date in the text. Consume the entry once. Pending unsaved work or an existing recovery barrier still needs the consumer's navigation protection.

## Varied, truthful text

Build eligible message candidates from committed state: task started, current live streak, next configured reward, time of day. Exclude statements which no longer hold. Keep recent template IDs and prefer a different eligible template; store stable IDs rather than relying on random text equality. Plain fallback must work without personalized state.

For example, a message about the seventh consecutive task is eligible only when today's uncompleted task really advances a six-day live streak. An archive win or stale cached count is insufficient. Text, tone, reward amounts and notification icon stay in the consumer. Do not copy Seeds keys/package names, 12:30 preference or its particular streak schedule as framework defaults.

## Acceptance

Test new install/upgrade; allow/refuse/swipe permission; channel/app disabling and settings return; time edits in 12/24-hour locales and enlarged fonts; boot and package replacement; midnight, month/year/leap transitions, DST, timezone and clock rollback; task completed after scheduling; foreground/ad/review windows; stale/delayed alarm; cold/warm tap; missing native bridge; corrupt/unavailable save. Native harness success does not prove delivery on an OEM phone with its battery policy. Verify actual grant, scheduled/delivered/cleared notification and tap destination on a device.

Official references checked 2026-11-10: [notification permission](https://developer.android.com/develop/ui/compose/notifications/notification-permission), [inexact alarms and restrictions](https://developer.android.com/develop/background-work/services/alarms). Recheck target/SDK requirements when implementing a new consumer.
