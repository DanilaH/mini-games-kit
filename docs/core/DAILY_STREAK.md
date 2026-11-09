# Calendar days and daily streaks

Import from `@danilah/mini-games-kit/core`. No browser, SDK or storage dependency.

`recordDailyStreak(previous, taskDay, today)` computes a new immutable streak for a verified solved task. `getDailyStreak(previous, today)` projects the currently visible count, record, whether today is complete and the prospective next count. `isCalendarDay`, `calendarDayIndex` and `localCalendarDay` supply the shared calendar boundary. State is `DailyStreakState | null`, where null means no recorded live-day completion.

```ts
import { localCalendarDay, recordDailyStreak } from '@danilah/mini-games-kit/core';

const today = localCalendarDay(); // This project explicitly chooses device-local days.
const update = recordDailyStreak(progress.streak, solvedTask.day, today);
if (update.recorded) {
  const bonus = bonusForStreak(update.state!.count); // Project-owned balance.
  // Build ONE next save containing completion identity, update.state and bonus.
  // Commit through the project's existing durable writer before celebrating.
}
```

See the tested [whole-progression example](../../examples/daily-progression.ts) for a pure plan combining unique completion, streak and hint credit. It returns a plan, not a successful save. The consumer must not expose or acknowledge an earned balance until its durable protocol succeeds. An ambiguous write requires authoritative recovery before retry; recomputing from a stale snapshot is insufficient. Use the existing [receipt/snapshot coordination](../platform/DURABLE_RECEIPT_QUEUE.md#combining-with-revision-snapshot-saves) when external rewards share that writer.

## Semantics

- Only `taskDay === today` can advance the series. An archive win may count towards a monthly collection without adding live consecutive days. The caller verifies task availability, solution and unique completion; the primitive does not trust an arbitrary date as proof of play.
- A date equal to or earlier than `lastDay` is idempotently ignored. Replaying, reloading or rolling the device clock backwards cannot add another day to this one saved stream. This is not server time or cross-device anti-cheat.
- Yesterday's count remains visible until today's opportunity passes. After a skipped day the visible count is zero; the best survives, and the next live completion starts at one. Read-only projection never destroys history.
- When today is before the recorded day, the view reports `clockBeforeRecordedDay: true`; do not promise an immediately claimable next-day reward. New recording remains blocked until dates advance beyond the stored day.
- Dates must be canonical Gregorian `YYYY-MM-DD`, years 0001–9999. `isCalendarDay` returns false for invalid input; ordinal/format/streak operations throw `RangeError` on invalid input or malformed state. The consumer codec owns repair. Leap years include the century exceptions. Day adjacency uses ordinals, not elapsed local milliseconds, so DST does not create a missing/extra day.
- No implicit timezone is selected by recording/projection: pass today explicitly. `localCalendarDay(date?)` is an opt-in device-local formatter. The noon-UTC ordinal conversion does not make the game's reset UTC.
- Inputs are not mutated. Persist `lastDay`, `count` and `best` together with the completion and its reward. Counters must be safe integers; overflow throws.

The module owns no reward schedule, notification permission, calendar UI, task generator, analytics, save schema or old-history reconstruction. The source's day-3/weekly hints are an example balance, not kit defaults. See [engagement integration](../android/LOCAL_REMINDERS.md) for delivery and [tier progress](TIER_PROGRESS.md) for monthly milestones.
