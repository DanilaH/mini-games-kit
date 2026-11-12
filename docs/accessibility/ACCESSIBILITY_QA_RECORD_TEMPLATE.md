# Accessibility QA Record — короткий consumer-проход без обязательного редизайна

**Копировать в consumer repo, только если аудит выявил проблему доступа, жестов или восприятия.** [Methodology](README.md) · [Independent Evidence Audit](INDEPENDENT_AUDIT_2026-11-12.md). Не превращать каждый багфикс в обязательные 40 страниц; при P0 можно сразу устранить воспроизводимый сбой и записать evidence.

## 0. Точное состояние, без исторического угадывания

| Основание | Заполнить конкретно |
| --- | --- |
| Game repo, exact HEAD, APK/web build SHA и package | |
| Runtime: HTML/DOM, Phaser/Canvas, Android native/WebView | |
| ОС, device, WebView version и display density | |
| Portrait/landscape, viewport, insets и реальная реклама/mock | |
| Settings: theme, locale, haptics, audio, reduced motion | |
| Large font/display size and assistive technologies actually enabled | |
| Status of tested game/menu/tutorial/pause/result and restore states | |
| Source complaint/user video/QA case, not imagined user percentage | |
| Последние внедрённые альтернативы ввода и test coverage | |
| Priority and affected primary gameplay objective | |

## 1. Пять вопросов до любых изменений

1. **Что пользователь намеревался сделать?** Указать источник/цель/момент, не «нажать что-нибудь».
2. **Что реально получилось?** Скрин/короткий replay, action event и actual game state.
3. **Где барьер?** Perception / target hit / input motor / scene boundaries / feedback / focus / orientation / platform lifecycle.
4. **В чем более дешёвая альтернатива?** CSS / hitbox / transparent focus / existing zoom/selection / one extra input path, а не новая система.
5. **Что может испортиться?** Баланс, score, saved progress, ощущение физического действия, визуальный стиль, перформанс, ad lifecycle.

## 2. Семь contract layers — PASS/FAIL/UNKNOWN отдельно

| Contract | Один конкретный воспроизводимый сценарий | PASS / FAIL / UNKNOWN / N/A | Evidence и короткая причина |
| --- | --- | --- | --- |
| Perception (текст, графика, состояния, цвет) | | | |
| Intentional input (hit area, gestures, cancel, alternatives) | | | |
| Spatial control (zoom/pan/drag outside field) | | | |
| Comprehension (цель, запрет, подсказка, выигрыш) | | | |
| Feedback channels (silent/off haptic/reduced motion) | | | |
| Recovery/time (Undo/Back, pause, no-fill, restore) | | | |
| Assistive compatibility (TalkBack, Switch, Voice Access) | | | |

**Не превращать:** PASS menu в PASS core gameplay, PASS 320px browser в PASS Android 200% font, PASS 48px icon в PASS 48dp target, PASS WebGL paint в PASS TalkBack.

## 3. Маленькая, но полезная матрица UI и размеров

| Surface × condition | Тест и конкретное действие | Observed / evidence | Verdict |
| --- | --- | --- | --- |
| 320×568 portrait, RU text/regular | First play, Help, Undo, Next, restart, long word/date | | |
| 390×844 portrait, opposite theme | Actual gameplay, hint, result, card/category details | | |
| 568×320 short landscape + reserved ad area | buttons, scroll and safe-area, modal close, return from ad | | |
| 640×360 landscape | theme, full game board, controls, Back | | |
| Real Android, font scale high then 200% if available | Read settings/error/achievement without clipped controls | | |
| Real Android, Display Size enlarged | Hitbox/zoom, screen composition, scroll, overlays | | |
| Touch: short tap vs long hold, drag/pan, pointercancel | start, move, outside board, release/cancel and resume | | |
| Mouse after touch / stylus if applicable | No phantom duplicate action | | |
| System reduced-motion + game reduced-motion | Same accepted move, score, reward/save and next action | | |
| Sound muted, haptic disabled or unavailable | Meaningful legal move/rejection/result visually identifiable | | |
| Color-distortion simulation / real display | Differentiate essential colors/states; note emulator limits | | |
| Screen reader TalkBack on real APK | Home → game → meaningful action **if supported** → result/Back | | |
| Switch Access / Voice Access or external keyboard | Focus/menu, core alternate path, return, no dead controls | | |
| Background/process death and rewarded/no-fill return | No lost selection/state/earned reward, focus restored | | |

**Записывать точный device/build.** Не объявлять непроведённый physical run зелёным. Accessibility Scanner и browser DOM analyzers дают часть данных, но не проверяют смысл нарисованного Phaser board.

## 4. Альтернативное управление — parity test

**Game action:** …
**Original input:** …
**Alternative hypothesis:** …
**Visible selected source and legal target:** …
**Cancel/no-op semantics:** …
**Does the same legal action produce identical game-state and reward?** …
**Does alternative accidentally reveal solution / add hint / reduce difficulty?** …
**Do neighboring hit targets overlap/steal click?** …
**Are gesture pointer captures released on pause, resize, Android Back?** …
**If not feasible, record accessibility limitation clearly:** …

Ключевое — снять реальный input-barrier, **не** выдавать читерский ход или менять игровые правила. Если действие невозможно сделать equivalently without drag, это сложный отдельный дизайн-вопрос, а не произвольный статус «исключение».

## 5. Фокус, семантика, Canvas

| Части приложения | Реально читается в TalkBack? | Можно активировать? | Не теряется фокус? |
| --- | --- | --- | --- |
| Home / level selection | | | |
| Settings / theme / sound/haptic | | | |
| Tutorial instructions and actual input | | | |
| Main board meaningful content | | | |
| Help / Undo / failure feedback | | | |
| Rewards / dialogs / ad dismissal | | | |
| Pause / resume / Back | | | |

**Если Phaser/Canvas game state отсутствует в accessibility tree:** не ложно утверждать screenreader support. Идея семантического интерфейса — отдельный эксперимент с реальным gameplay parity; сначала доказать ценность и цену, а не добавлять 1000 скрытых DOM controls.

## 6. Журнал исправления с обратным эффектом

| Priority | Exact repro / seed / screen | Tiny fix proposal | Risk to game feel / progression | Tests | Outcome |
| --- | --- | --- | --- | --- | --- |
| P0 / P1 / P2 | | | | | |

P0: невозможно совершить базовое действие/получить подтверждённую награду или есть опасное мигание; ложные финансовые согласия/уход из игры; nonrecoverable state after input.
P1: трудно попасть, не читается важный текст, color-only состояние, неудобное управление без доступной альтернативы, разный результат из-за reduced motion.
P2: вторичная читаемость/косметика, если основной путь доступен; не обязательно новый setting.

Если состав исправлений нужен только для QA — **HOLD/NO CHANGE** после проверки. Не делать mass theme redesign.

## 7. Human validation — отдельно от формальной приёмки

**Какая нужная аудитория/пользовательский контекст действительно приглашены:** …
**Видели ли мы фактическое самостоятельное действие, а не только слова «удобно»:** …
**Что человек попытался нажать и почему:** …
**Что удалось после minimal fix:** …
**Отличалось ли удовольствие/ощущение от старого управления:** …
**Где осталось ограничение:** …
**Consent/privacy — не сохранять диагнозы или персональные идентификаторы без необходимости:** …

Маленькая выборка помогает обнаружить конкретный barrier. Она не определяет долю игроков с нарушением и не доказательство D1/D7.

## 8. Решение

**Verdict:** FIX P0 / FIX ONE P1 / SMALL ALTERNATIVE TEST / HOLD / NO CHANGE / REJECT
**Independent reproduction:** …
**Preserved game rules/save/reward/ad behavior:** …
**What is physically verified vs browser-only:** …
**What remains UNKNOWN:** …
**No new mechanics, meta, global A11Y framework, heavy Phaser overlay, blanket style redesign unless separately justified:** …
