# Road Lines → mini-games-kit: аудит повторного использования

Дата: 8 ноября 2026. Это исследование и план извлечения, а не реализация новых API.
Игровой runtime, опубликованные ветки и APK в рамках аудита не менялись.

## Проверенные исходники и метод

- Road Lines: `DanilaH/road-lines@5e05ddc205f113544cf3957032ae119df0d47c93`.
- Kit main: `5450f9db344aacb5acdc103b4199fd8aeb11b10d`.
- Kit Seeds: `origin/extract/seeds-production-practices@d4dee18c9b466e2b4a68d8d481db6dfc50ec9ee5`.
- GitHub PR [#14](https://github.com/DanilaH/mini-games-kit/pull/14) проверен через API: open, merged=false. PR #15 с геометрией/снимками уже в main.
- Просмотрены названия всех 92 коммитов Road Lines, история основных исправлений, проектные инструкции, отчёты и исходники соответствующих подсистем. Текущие API kit сопоставлены с отдельной Seeds-веткой.
- Манифест Road Lines закрепляет именно указанные main/Seeds SHA. Локальная проверка подтвердила их совпадение с текущими remote refs и побайтовое совпадение vendored DurableReceiptQueue с Seeds.
- Дополнительно выполнено статическое сравнение TS/Java аналитических контрактов. Повторный запуск полного набора browser/native-тестов не выполнялся: runtime не изменялся. Результаты прошлых проверок ниже названы историческими, их границы сохранены.

Все ссылки на Road Lines в этом отчёте относятся к указанному SHA. Для изучения истории важны не только первые реализации, но и их последующие исправления.

## История, которая меняет решение об извлечении

| Этап | Что произошло | Урок для kit |
| --- | --- | --- |
| Старт, `847e224` | Игра получила выбранный snapshot kit, включая Seeds receipt queue | Это потребитель существующих API; нельзя объявлять их новыми решениями Road Lines |
| Базовый цикл, `6f41eba`–`7811ef9` | Жесты, solver, победа, темы, staged wheel | Подтверждает полезность durable pending/value transfer, не требует новых одноимённых подсистем |
| UI/UX, `069251b`, `7dc8b8b` | Подсказки/повтор/продолжение, repaint после resize спящей сцены | Сохранять семантику восстановления и финальный paint |
| Производительность, `a1efa07`, `0927d31` | Два текущих RenderTexture, dirty layers, sleep, пулы; no-op save сначала пропускал обязательную миграцию | Нужны отдельные правила кеша, миграции и teardown |
| Надёжность/готовность, `f512ac4`, `03562ee` | Fault injection, renderer crash, готовность после снятия cover и paint | Green unit/build не заменяет сценарии прерывания |
| Физический плейтест, `b1186c5`, `09c465c` | Равномерный пунктир, направление со всего экрана, непрерывный банк, touch-кнопки после capture | Небольшие input/geometry primitives и UX-рецепты |
| Награды, `eb4df92`, `d555df4` | Ротация тем, фиксированная неполученная тема в wheel, подарок из принятого арта | Результат/владение сохраняются до анимации; конкретная экономика остаётся в игре |
| Монетизация, `c333ef6`–`87478e1` | Реальные native мосты и shared fullscreen cadence | Нативный пример дополняет existing specs, не превращает web adapter в Android adapter |
| Ошибки запуска, `5b636c7`, `2d42e6c` | Сначала startup ждал ads; затем recovery запретил Play. Оба дефекта исправлены | Реклама не должна становиться обязательной зависимостью игры |
| Звук, `49acd08`, `c170846` | Pitch-variation оказалась диссонантной; cold UI pop терялся при CPU4× | Ограниченный pitch ещё не гармония; cold activation и modal UI требуют реальных WebAudio проверок |
| Production, `fe0739e` | Подпись, exact payload, live/test separation | Проверять доставляемый APK и identity, не только Gradle success |

## Что уже есть: не извлекать повторно

| Решение | Где уже находится | Что Road Lines действительно добавляет |
| --- | --- | --- |
| Полные revision snapshots | main: RevisionSnapshotQueue | Пример запрета no-op до первой канонической записи/миграции |
| Staged local result и recovery | main: DurablePendingTransactionSession | Wheel с exact themeId, fallback после получения дубликата, отсутствие reroll |
| Внешний earned receipt → commit → exact ack | Seeds PR #14: DurableReceiptQueue | Неблокирующее восстановление, missing/late RPC и актуальный игровой prefix |
| Геометрия native banner | main: resolveNativeBannerPlacement | JS/native поколение, ResizeObserver, SDK reserve/remeasure, короткий экран |
| Общие блокировки | main: GameplayActivityCoordinator | Различные разрешения для gameplay/UI/reward feedback и изменения причин без aggregate edge |
| Пропуск эффектов/сбор монет | main: PresentationSkipController/value-transfer | Дополнительные сценарии gift skip/background без повторной выдачи |
| Startup и DPR | main: startup runtime/render-density | Первая реальная отрисовка до sleep; снятие cover до semantic ready |
| Worker-подсказки, progression, Android QA, captions | Specs Seeds/Sudoku | Конкретные дополнительные failure cases; основа уже описана |

Наличие в PR не означает доступность из main. Новые consumers должны pin точный интегрированный SHA, а не зависеть от движущейся ветки.

## 1. Приоритет P0: необязательные SDK и восстановление в фоне

Источник: [Monetization](https://github.com/DanilaH/road-lines/blob/5e05ddc205f113544cf3957032ae119df0d47c93/src/services/monetization.ts), `tests/monetization-background.test.ts`, `tools/startup-ads-smoke.mjs`, `AD_BACKGROUND_FIX_2026-11-03.md`.

Физические симптомы: «запуск занимает слишком много времени», затем запрет играть из-за проверки рекламной награды. Причина была в зависимости core startup/gameplay от optional ad status/pending/ack.

Дополнить Seeds `docs/android/ADS_AND_LIFECYCLE.md` и receipt usage doc:

- Core lifecycle, первый кадр, Play/Back/Continue не ждут listener/status/pending/ack рекламного SDK.
- Pending/ack error не поднимает глобальную блокировку игры и не отменяет текущий жест/подсказку.
- Ограниченный backoff и одна незавершённая операция каждого вида. Deadline завершает ожидание, но не отменяет native RPC: нельзя начинать новые одинаковые RPC, пока старый ещё существует.
- Ответ после deadline сохраняется и обрабатывается; dispose исключает поздние мутации.
- Valid receipt применяется к последнему authoritative state, effect+ledger фиксируются до exact ack. Failed ack не запрещает тратить уже подтверждённую награду.
- Реальный конфликт/неопределённая запись valuable save сохраняют собственную защиту. Не смешивать storage uncertainty с недоступностью рекламного сервиса.
- Pre-show timeout и реально показанная fullscreen-реклама имеют разные состояния. Не снимать blocker показанного SDK-окна по общему таймеру.

Форма: сначала поправка существующих контрактов и combined tests. При извлечении кода допустим маленький single-flight/deadline/retry helper с явной политикой late result; не переносить весь Monetization и не создавать вторую receipt queue.

Доказательства для переноса: never-resolving status/pending; late pending; failed ack + subsequent purchase + restart; interrupted ordinary save vs grant; dispose во время запроса; один native RPC после нескольких backoff интервалов.

Синхронный no-await commit Road Lines опирается на SyncStorage/localStorage. Его нельзя объявлять универсальной атомарностью для async storage: там нужен уже описанный coordinated writer/quiesce/drain/rebase/epoch protocol из PR #14.

## 2. Приоритет P0: изменение причин блокировки без aggregate edge

В kit onBlockedChange сообщает только переход false↔true. Для самой остановки gameplay это правильно. Но последовательность pause → pause+background не порождает второй callback, хотя banner, UI sound и gift feedback должны изменить своё поведение.

В Road Lines `main.ts::block` ведёт отдельный Set причин и явно обновляет зависимые потребители, даже если aggregate boolean прежний. Это рабочий consumer workaround и свидетельство недостающего наблюдения в общем API.

Предлагаемое расширение существующего GameplayActivityCoordinator: read-only snapshot причин и отдельная reason-change subscription. Названия/подпись — предложение, не существующий API. Старый onBlockedChange и gameplay edges сохраняются.

Потребитель выбирает eligibility отдельных каналов: UI click разрешён в pause/shop, gift feedback — под своим reward modal, background/ad/startup/storage conflict запрещают всё. Не вшивать имена модалок Road Lines в kit.

Тесты: pause → background → background off при сохранённой pause; gift → visibility; banner under pause с фоном; duplicate setBlocked без ложных start/stop; unsubscribe и immutable snapshot.

## 3. Приоритет P1: музыкальная согласованность и плотность feedback

Источник: `src/presentation/sound-sequence.ts`, `feedback.ts`, `tools/render-audio.py`, `tools/audio-smoke.mjs`, `AUDIO_HARMONY_FIX_2026-11-03.md`.

Текущий kit `audio/PITCH.md` предлагает bounded variation и непрерывный accumulation contour. Это полезно для шума/эффектов, но недостаточно для музыкальных сэмплов: разные исходные высоты + случайный detune + несовместимые аккорды дали неприятный результат на плейтесте.

Дополнить pitch doc разделом применимости. Вынести компактный sample-sequence selector: injectable cosmetic RNG, anti-repeat, согласованные root notes, дискретные интервалы/фразы, ограничение соседнего интервала. Не менять старые функции молча и не задавать всем играм C5/до мажор.

Отдельно сохранить bounded cue density: forward/reverse имеют общий audio budget; haptics регулируются независимо; устаревший звук пропускается, а не ставится в очередь; заменяемый хвост коротко затухает. Лимиты65/60мс, число тембров, gain и огибающие — политика Road Lines, не defaults kit.

Проверки: tuning каждого sample, peak/RMS, принадлежность нот выбранной шкале, соседние интервалы, полифония быстрого forward/undo, mute/background без delayed replay, один context и cleanup. Автотесты не доказывают приятность на динамике телефона.

## 4. Приоритет P1: cold UI feedback под модальными окнами

Не заменять PresentationAudioMixer новым монолитным Feedback. Он управляет постоянными слоями, а найденная потребность — короткие one-shot cues.

Извлечь отдельный bounded one-shot player либо небольшой слой над существующими audio primitives:

- accepted action звучит после установления итогового UI state;
- UI eligibility отделена от gameplay; hard blockers подавляют оба канала;
- первый click не зависит от декодирования большого sprite: маленький заранее доступный fallback;
- pending resume/декодирование не накапливают очередь событий; следующая кнопка заменяет старую;
- после UI pop в паузе контекст снова suspended;
- disabled, cancelled и compatibility duplicate не звучат.

Cold fallback, max voices и expiry должны конфигурироваться. Копировать waveform C4 и guard100мс как вечный стандарт не нужно.

Приёмка: реальные WebAudio nodes/context.state, cold click при CPU4×, pending resume, mute/background между action и playback, насыщение voice budget, repeated dispose. Исторический CI обнаружил пропущенный pop; простого «метод play вызван» было недостаточно.

## 5. Приоритет P1: touch-кнопка после captured drag

Источник: `src/services/thumb-controls.ts`, `tools/playtest-smoke.mjs`, `09c465c`.

Вынести opt-in DOM installer без `.play-controls` и game-specific actions. Selector/resolveButton и move threshold передаются потребителем.

Семантика: touch/pen активируется один раз при release внутри исходной кнопки; drag-away/cancel не активирует; последующий compatibility click поглощается; mouse/keyboard/assistive activation сохраняются; dispose снимает слушателей. Pointer capture игрового поля не должен превращать ближайшую кнопку в мёртвую на первый тап.

Обязателен реальный browser test «завершить свайп над dock → сразу reset → ровно одно действие», отдельные mouse/keyboard и двойной реальный tap. Не заменять повсеместно native click обработчиком pointerdown.

## 6. Приоритет P1: idle rendering и детерминированный teardown

Источник: `game/BoardScene.ts`, `presentation/material.ts`, `platform/destroy-renderer.ts`, `PERFORMANCE_OPTIMIZATION_VALIDATION.md`, performance/soak tools.

Новое относительно преимущественно asset/startup-ориентированного PERFORMANCE_PLAYBOOK:

- Разделить статическое поле, изменяемый маршрут и живые эффекты. Запекать только dirty слой; idle кадры прекращать после финального paint.
- Первый postrender должен состояться, даже если затем сцена уснёт. Resize/theme/restore должны будить и завершать новый paint.
- Владеть только текущими текстурами/геометрией; не создавать кеш всех уровней/размеров. Ограничивать offscreen pixel budget.
- CSS эффекты имеют отдельный lifecycle: сон Phaser не останавливает CSS animations скрытого результата.
- game.destroy() может быть отложенным: спящий loop требуется довести до destroy event. Маленький `destroyRenderer` — кандидат в существующий `/phaser`, с тестом на поддерживаемой версии Phaser.
- Пулы частиц/искр сохраняют визуальную плотность, но ограничивают выделения. Числа360/36 принадлежат игре.
- No-op prefix save допустим только после первой канонической записи/миграции. Награды/транзакции не coalesce.

Форма: расширение performance playbook + маленький teardown helper. Универсальный кеш поля/scene scheduler пока не нужен: геометрия и dirty dependencies остаются consumer-owned.

Историческое измерение Road Lines: примерно79% меньше FillPath для конкретного жеста, покой без кадров; RenderTexture увеличил число live texture handles с10 до14. Это обмен CPU/аллокаций на ограниченные GPU ресурсы, не бесплатное ускорение и не измерение FPS Android.

Проверки: idle/no frames, только FX без rebake, active/idle dispose, 30 paused resizes, UI/FX cycles с heap/DOM/listeners/GL counters, первый render при blocker. Leak claim должен быть ограничен условиями soak, а не формулировкой «утечек нет».

## 7. Приоритет P2: геометрия пунктирной линии

Источник: `src/presentation/geometry.ts::routeDots`, `tests/playtest.test.ts`.

Компактный чистый helper для размещения маркеров вдоль polyline с одной arc-length фазой. При запуске паттерна на каждом отрезке точки кучковались на поворотах. Угловое clearance пропускает тесную точку, не сдвигая всю последующую фазу.

Вынести в existing feel/core geometry, без Fill-модели. Добавить zero-length segments, finite inputs, небезопасные spacing, острые углы и очень короткий путь; spacing/clearance/end offsets configurable. Не обещать, что каждое евклидово расстояние одинаково: равномерна дуговая фаза, а при clearance точки намеренно пропускаются.

## 8. Приоритет P2: native haptics как изолированный пример

В main и Seeds нет готового native haptics runtime. Road Lines добавляет Android API24/26/31 ветки, проверку vibrator/amplitude support, stale issuedAt, foreground cancellation, rate/priority guards и отдельные настройки звука/вибрации.

Сохранить recipe/reference adapter с injectable profiles. Позже — небольшой native template, если второй реальный consumer подтвердит потребность. Не тянуть Capacitor в core package.

Не копировать фиксированную мощность/длительность: пользователь отдельно просил усилить вибрацию. Timestamp freshness не равна полной отмене отложенных команд; при превращении в общий bridge проверить cancel/generation ordering. Web fallback не подтверждает native feel.

## 9. Монетизация и косметика: дополнения к существующим specs

AdCadence добавляет персистентное активное время, минимальное число новых прохождений, общий cooldown fullscreen-форматов и защиту результата с подарком/offer. Existing ActionInterstitialGate намеренно считает requests, не impressions, и не является его полной заменой.

Не менять эту семантику существующего API молча. Сначала recipe + tests; отдельная generic cadence policy оправдана только с injectable thresholds/storage/clock/eligible progress. Не копировать `completed<=90`,60/90сек,5/3 победы, protectedLevel ID как общий контракт.

Theme offer: показывать неполученные темы, affordability-first, rotation без соседнего повтора; free preview — session state, покупка — отдельная durable mutation. Preview не должен блокировать Continue или обещать бесплатное владение.

Wheel: фиксировать exact unowned theme до анимации; если позже тема стала owned, применять заранее определённый fallback. Сохранить старые numeric spins при миграции. Existing DurablePendingTransactionSession уже обслуживает этот lifecycle, нового universal wheel не нужно.

Hint UX: кэш уже оплаченной подсказки, FOUND/UNSOLVABLE/UNKNOWN, свободное восстановление из тупика, отмена worker и защита от stale response. Worker recipe уже есть в Seeds; Fill solver и политика цены остаются локальными.

Gift: reward принадлежит игроку до celebration. Skip/Back/reload только завершают показ. Слоистый арт, задние стенки, свет из проёма и bounded confetti — художественный production recipe, не API «универсальный подарок».

## 10. Android release: усилить существующую приёмку

Источник: `tools/android-release.mjs`, `tools/verify-release.py`, `.github/workflows/android-release.yml`, `native/android/release-identity.json`.

Seeds уже описывает signing/R8/artifact identity. Road Lines добавляет пригодный пример автоматического fail-closed candidate pipeline:

- ожидаемый public certificate/package/version вместо произвольного нового signer;
- отдельные playtest и production app IDs/storage;
- live/test/mock separation проверяется по доставляемому payload;
- apksigner, zipalign16KB, manifest/debuggable/orientation, exact embedded web files;
- live SDK config сверяется без печати значений;
- ephemeral keystore0600 и cleanup на ошибке/успехе;
- наличие проверенного APK не подменяет store publish или физическую приёмку.

Форма: обновить ANDROID_RELEASE_ACCEPTANCE и добавить параметризуемый verification tool/example. Не переносить собственный бинарный manifest parser без дополнительного аудита: предпочтителен стандартный Android SDK инструмент и негативные fixtures. Версия SDK36, portrait и сертификат Road Lines не являются общими defaults. R8 acceptance в Road Lines не заявлена, не смешивать её с Seeds evidence.

## 11. Обнаруженный дефект до переноса: TS/Java аналитика расходятся

`src/services/analytics.ts::Events`:24 типа; `RoadAnalyticsPlugin.java::EVENTS`:18 имён. Статическое сравнение обнаружило6 отсутствующих событий:

`ad_event`, `ad_next_level`, `ad_offer`, `ad_reward_granted`, `hint_purchase`, `result_continue`.

Java whitelist параметров также не содержит `placement`, `format`, `phase`, `count`. Bridge отвергает такие вызовы; JS adapter намеренно подавляет ошибки telemetry, поэтому игровой UI продолжает работать, а эти события не доходят через данный transport. Это доказанный schema mismatch, не наблюдение dashboard. Другие события и автоматические SDK события этим выводом не опровергаются.

До извлечения исправить источник: единая декларативная схема/генерация whitelist либо build contract test имён и ключей + проверка каждого payload через реальный native entrypoint. В kit добавить это в Android analytics acceptance, сохранив AnalyticsAdapter как общий seam. Не делать второй SDK analytics runtime и не добавлять outbox, который может блокировать gameplay.

## 12. Исторические документы требуют явного superseded

`STARTUP_ADS_FIX_2026-11-02.md` описывает промежуточную защиту pending, которая могла блокировать valuable actions. Финальное исправление `2d42e6c` и AGENTS от3ноября эту политику заменяют: receipt query/ack не блокируют Play. При переносе сохранять историю как evidence, но пометить устаревший раздел и ссылаться на финальный контракт.

Точно так же старые x5/extra wheel, варианты частоты рекламы, экспериментальный detune и стадия «реклама отложена» не являются текущим продуктовым ТЗ.

## Что оставить в Road Lines

Fill-model/solver,90 конкретных пазлов/3 набора, цена hint60/pack150, theme500, topup150, wheel1/8, fallback300, расписание подарка, C5/C4 samples, точные haptic amplitudes, palette, UI composition и game-specific offer progression.

Screen-wide steering полезен как рецепт: absolute hit input → directional handoff без телепорта, исключение кнопок/модалок/баннера, последовательный undo. До второго grid consumer не выносить весь installRouteInput с Level/BoardLayout в универсальный контроллер.

Скриншоты, factual captions, portrait/landscape compositions и authentic renderer provenance уже описаны в main/Seeds store-media docs. Новые общие карточки/экспортёр сейчас имеют низкий приоритет.

## Порядок реализации

1. Подготовить дополняющий patch к Seeds PR #14 или работать после его интеграции. Не создавать вторую receipt/banners документацию. Обновить источники/superseded и добавить regression matrix optional-ads.
2. Исправить analytics schema mismatch в Road Lines отдельным изменением с contract test. Не смешивать audit с незаметной заменой APK, ожидающего модерацию.
3. Расширить GameplayActivityCoordinator наблюдением причин; backward-compatible tests текущих subscribers и новых каналов.
4. Извлечь touch activation и polyline markers как два маленьких независимых API с focused docs/tests.
5. Вынести sample-sequence/one-shot lifecycle с cold click regression и реальными browser tests; уточнить PITCH applicability. Не переносить Feedback монолитом.
6. Дополнить performance/startup/release playbooks, затем добавить небольшой Phaser teardown helper. Native haptics/cadence/bridge templates — после этого, только при подтверждённой экономии повторной работы.

Готовность каждого API: exact source revision + semantic changes, focused usage doc и docs/API.md, проверка cleanup/failure boundaries, current kit regression/type/build/pack/bootstrap checks и минимум один consumer integration probe. Нативные/live/device claims требуют отдельных результатов.

В рамках этого аудита новые runtime API не реализованы, source defect не исправлен, PR #14 не merged и Android acceptance заново не проводилась.
