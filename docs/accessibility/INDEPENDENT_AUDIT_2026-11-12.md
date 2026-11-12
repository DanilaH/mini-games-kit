# Independent Evidence Audit — Accessibility & Inclusive Puzzle UX

**Дата:** 12 ноября 2026. **Предмет:** [Accessibility & Inclusive Puzzle UX](README.md) и активная кодовая база нескольких consumer-игр. **Метод:** второй проход по официальным W3C/Android/Xbox документам, 2026 систематическим обзорам и текущим GitHub-файлам, включая поиск контрпримеров прежним опасным обобщениям. **НЕ выполнено:** реальный TalkBack/Switch Access/Voice Access на физическом Android, профессиональная оценка полного WCAG conformance, исследование с игроками с инвалидностью, статистически достоверный эффект на retention.

## 1. Что в популярных рекомендациях неверно или неполно

| Утверждение | Источник / проверка | Вердикт |
| --- | --- | --- |
| «Раз WCAG говорит 24 px, кнопки Android можно делать 24 dp» | [WCAG 2.5.8 AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [Android touch target](https://support.google.com/accessibility/android/answer/7101858) | **REJECT:** 24 CSS px — web AA с исключениями; Android 48 dp — рекомендация для интерактивных элементов. Разные единицы, области применения и статусы |
| «48 dp обязательно для каждой отдельной клетки пазла 8×8 и любого пикселя пути» | Android touch recommendations, W3C 2D layouts | **REJECT universal:** на маленьком экране это может быть невозможно без порчи пространственной механики; нужна оценка масштабирования, зоны и способа ввода |
| «Иконка 20 px означает touch target 20 px» | Android guidance: hit area может быть больше пиксельных bounds иконки | **REJECT:** мерить реально обработанную область и соседнее перекрытие, не только bitmap |
| «Для drag достаточно реализовать клавиши со стрелками» | [WCAG Dragging Movements 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) | **REJECT as automatic:** альтернативный keyboard input не является single-pointer альтернативой сам по себе |
| «Drag — ядро игры, поэтому любой drag автоматически essential и исключен» | Same WCAG criterion, case-specific essential exception | **REJECT blanket exception:** само действие пространственного размещения часто возможно через select→tap; каждую функцию проверять отдельно |
| «Сделаем tap→tap и автоматически решим доступность» | [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/ensure-that-multiple-simultaneous-actions-eg-click-drag-or-swipe-are-not-required-and-included-only-as-a-supplementary-alternative-input-method/) | **REJECT universal:** альтернативное управление может быть неполным/с нежелательными коммитами; сохранить все законные решения и скорость, проверить жесты и понимание выбора |
| «Любую головоломку обязаны адаптировать в обычный список HTML-кнопок» | [WCAG reflow 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow), [WCAG2ICT](https://www.w3.org/TR/wcag2ict/) | **REJECT:** двумерные игры имеют ограниченное исключение для reflow 2D, меню/диалоги его не наследуют. Полная TalkBack gameplay adaptation требует separate feasibility/user evidence |
| «Меню доступно с TalkBack — значит вся игра доступна» | [Android accessibility testing](https://developer.android.com/guide/topics/ui/accessibility/testing), actual Phaser Canvas/DOM separation | **REJECT:** нарисованные фигуры и карточки не становятся DOM accessibility nodes от наличия label на canvas |
| «Accessibility Scanner — сертификат полной доступности» | Android docs recommend manual TalkBack, Switch Access, Voice Access, analysis, automation, user testing | **REJECT:** scanner полезен для части UI, не интерпретирует смысл реального решения пазла |
| «ARIA-label на числе всегда гарантирует доступность длинной Number Match» | [Seeds board-view.ts](https://github.com/DanilaH/seeds-bits/blob/main/src/board-view.ts) имеет button + aria-label/roving tabindex | **PARTIAL:** хорошая реализация структуры, но фокус после collapse, TalkBack traversal и доступность огромной доски на телефоне должны быть проверены |
| «У Arrows управление только сложным drag» | [Arrows gestures](https://github.com/DanilaH/arrows/blob/main/src/input/gestures.ts) | **FALSE:** tap activates arrow, pan/pinch отдельно; настоящие проблемы скорее в точности dense hit/альтернативе zoom без pinch |
| «Road Lines не поддерживает ни одного альтернативного маршрута» | [Road Lines input](https://github.com/DanilaH/road-lines/blob/main/src/services/input.ts) | **FALSE:** arrow keys уже двигают маршрут, pointer can steer from outside figure. Но touchscreen single-pointer без drag отдельно не доказан |
| «Солитёр ассоциаций поддерживает только удерживание карты» | [Association BoardScene](https://github.com/DanilaH/asoc-solitair/blob/main/src/game/BoardScene.ts) | **FALSE:** tap-select и tap-target уже предусмотрены, кроме drag. TalkBack/card semantic representation может оставаться unknown |
| «Water Sort обрабатывает короткий tap как drag» | [Touch 0.50](https://github.com/DanilaH/watery-water-sort/blob/main/docs/TOUCH_50.md), [WaterScene](https://github.com/DanilaH/watery-water-sort/blob/main/src/game/WaterScene.ts) | **FALSE:** tap based, защищено от touch+synthetic mouse duplicate. Цветовые различия и screen reader всё равно требуют проверки |
| «Яркие красивые цветные фигуры гарантированно доступны» | [WCAG color 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color), [XAG 103](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103) | **REJECT:** палитра/градиент могут различаться для автора и быть недоступными при color vision deficiencies; нужен другой канал информации и human test |
| «Контраст 3:1 достаточен для всех текстов» | [WCAG 1.4.3/1.4.11](https://www.w3.org/TR/WCAG22/) | **REJECT:** обычный текст WCAG AA 4.5:1, large 3:1, существенный не-текстовый UI 3:1 при нормированных условиях. Не переобобщать на decorative graphics |
| «Android font size автоматически одинаково увеличит наш Phaser и CSS WebView» | [Android 14 non-linear scaling](https://android-developers.googleblog.com/2023/02/first-developer-preview-android14.html) | **NOT VERIFIED:** конкретное поведение HTML, Phaser, WebView/OS/font units надо измерить на signed/test APK |
| «Browser 125% font snapshot подтверждает телефон при 200%» | Android 14 maximum 200%, screen display size | **REJECT:** разные OS/WebView metrics и safe areas, keyboard/ad views; нужна physical/native проверка |
| «У WCAG нет исключения для двумерных игр» | [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow) | **FALSE:** 2D exception есть, но только для самой нуждающейся в 2D части |
| «Reduced motion = удалить подтверждение победы/реакции полностью» | [WCAG 2.3.3 AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions), [XAG 117](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117) | **REJECT:** отключать ненужное движение и сохранять понятный static/low-motion outcome; state commit не должен ждать tween |
| «Только media query отключает все Phaser/JS/native анимации» | W3C C39 CSS technique, distinct JS/Phaser/render pipeline | **REJECT:** явно проверить game setting/engine paths, браузерные значения не автоматически гасят JS tweens |
| «Если есть reduced motion настройка, яркие вспышки безопасны» | [WCAG 2.3.1 Level A](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold) | **REJECT:** flash safety требуется до возможности открыть настройки; три вспышки не простая норма для любых интенсивностей/площадей |
| «Сильная вибрация обязательна для хорошего game feel» | [XAG 103 haptic](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/103), device hardware variance | **REJECT:** haptic optional, не единственный носитель смысла, выключенный haptic не нарушает gameplay |
| «Доступность доказывает retention lift» | [2026 61-study review](https://doi.org/10.1080/10447318.2026.2651346), [162-study mapping](https://journals.sagepub.com/doi/full/10.1177/14614448231204020) | **NOT PROVEN:** в источниках мало прямых эмпирических оценок удовольствия и эффектов на рынок наших пазлов |
| «Один accessibility mode нужен каждому из шести проектов» | Разные input/model/UI architectures, existing implementations | **REJECT:** user-value first, minimal game-specific fixes, share recipe only after two genuine consumers |
| «Тест без моторных/зрительных ограничений измеряет опыт целевой аудитории» | Android manual a11y testing guidance; reviews on multi-impairment | **REJECT:** симуляция/emulation полезна для первых дефектов, требует участников с опытом использования assistive tech для claims of their playability |

## 2. Реально неудобная оговорка: доступность UI ≠ доступность самой головоломки

### Сценарий A: клавиатура и DOM хорошие, но поле чисто графическое

У Seeds button semantics действительно существуют. У Road Lines есть arrow-key route. У Solitaire tap→tap присутствует. Это сильное опровержение гипотезы «раз игра на Phaser, всё недоступно». **Однако** говорить «доступна целиком для TalkBack» нельзя, пока тот же пользователь не может получить состояние самой игровой доски и самостоятельно сделать ход.

### Сценарий B: можно нажать кнопку, но это неверный выбор

Если hitboxes настолько велики, что перекрывают друг друга, увеличение размеров ради галочки создает ложное действие. Это особенно критично для dense Arrows, Number Match и card stacks. Нужен реальный pointer hit-map, adjacent neighbors, drawing scaling и modal blockers.

### Сценарий C: два тапa предусмотрены, но не сохраняют паритет drag

Если Solitaire tap-select→target меняет юридические способы постановки карточек или не позволяет отмену, это не эквивалентный ввод. Нужны реальные replay одной и той же последовательности с обоими способами, одинаковые score, credits, meaningful result.

### Сценарий D: доступная альтернатива меняет сложность самой задачи

Если alternate route mode для Roads автоматически выбирает корректное направление/подсвечивает решение, тестирование измеряет помощь, не только устранение моторного барьера. Нужно разделить **input parity** и **solver hint**.

### Сценарий E: однотонные жидкость и текст становятся слишком шумными

Простые наклейки на все сосуды могут ухудшить красоту и различимость композиции. Проверить сначала контраст/оттенки/силуэты, затем ограниченный optional label/pattern вариант, без полной замены материалной эстетики. И наоборот, красивый градиент не заменяет смысловую кодировку.

### Сценарий F: телефон с большим шрифтом рушит touch controls

Browser 320×568 на 125% не гарантирует Android 200% non-linear + display size + banner + system nav. Сохранять скролл, размер настоящих кнопок, содержимое и фокус при экранных границах.

### Сценарий G: reduced motion ускоряет продолжение, но меняет начисления

Если игра начисляет награду по callback анимации, подавление tween потеряет coins/hints или двойной grant при возврате. Требуется сравнение полного state hash/reward ledger при normal vs reduced/background/cancel. На больших праздниках это особенно важно.

### Сценарий H: после rewarded/ad dismiss экран выглядит доступным, но input потерян

Состояние Native WebView, audio focus, keyboard, pointer capture, modal stack и screen reader focus могут не восстановиться. Игровой цикл должен быть полноценным **без сети**, без haptic и после возвращения из стороннего fullscreen.

### Сценарий I: «идеальная» версия от тестового агента хуже реальному игроку

Тест с выключенным цветом или одной рукой — useful exploration, **не** эквивалент участия игрока с конкретным impairment и не доказательство субъективного комфорта. Нужен ограниченный реальный human pilot перед уверенными заявлениями.

## 3. Проверка нормативного языка

- **WCAG 2.2**: A/AA/AAA criteria для веб-контента. Применение к native программам имеет отдельный W3C WCAG2ICT guidance; не утверждать автоматически государственную/контрактную обязательность для всех Android-игр.
- **Android 48×48 dp**: формулировка Google «consider», guideline/рекомендация. В W3C 2.5.8 — 24 CSS px с несколькими исключениями, и это не 48dp.
- **WCAG motion 2.3.3**: AAA, не AA. **Flashes 2.3.1**: A; нельзя считать любой >3 ярких фрейма гарантированно нарушение без определения пары переходов, площади и интенсивности — но быструю агрессивную мигающую сцену разумно избегать.
- **XAG**: лучшие практики, не compliance/legal checklist. Не заявлять, что Xbox-специфичные console величины обязательны для Android-головоломки.
- **Android 14 non-linear 200% font**: реален для Android platform, но WebView CSS и Phaser coordinate systems должны проверяться по факту.
- **WCAG 1.4.10**: двумерная game-grid имеет исключение, однако каждый supporting text/dialog не наследует его.

## 4. Самые перспективные узкие проверки по текущим репозиториям

| Consumer | Что реально обнаружено | Следующий безопасный эксперимент, не команда на редизайн |
| --- | --- | --- |
| Seeds Bits | DOM board cells with aria-label and roving tabindex; current QA includes enlarged text | Physical TalkBack on a very long board, focus after row removal; native 200% font / display zoom |
| Arrows | One tap activates, multi-pointer pinch for zoom, 0.17.1 improved density/type | Test dense targets and an alternative zoom action when pinch cannot be performed, not a rewrite of game navigation |
| Road Lines | Keyboard arrow path, whole surface relative steering, pointer capture | One-device pointer-free route and no-drag possibility with exact game-rule parity, measure input errors |
| Water Sort | Tap selection, scroll-field and touch mouse suppression; themes have selected state | Distinguish liquid color and status without color-only, haptic/audio off, screenreader reachability of source/target tubes |
| Association Solitaire | Tap-selected transfers already work, reader, reduced motion | Real small-viewport card caption/readability and TalkBack semantic reach; gesture alternative not invented anew |
| Block Puzzle | Actual gameplay only in feature branches; 0.63 preview is reference | Compare same board/tray actions with tap-to-place vs drag, preserving score/rules, physical thumb error rate |

## 5. Источники, которые не подтверждают обещание удержания

[Abdoulqadir/Loizides 2026 systematic review](https://doi.org/10.1080/10447318.2026.2651346): **61** papers, overlap disability combinations, limited direct empirical validation; need not pretend fully universal a11y.

[Accessibility of games mapping, 162 studies](https://journals.sagepub.com/doi/full/10.1177/14614448231204020): knowledge gaps in player **fun** and auditory/motor categories, utility-centric literature. Correct conclusion is design/test with actual players, not «accessibility improves D7 by X%».

[Di Leo/Tarantino 2026](https://dl.digra.org/index.php/dl/article/view/2833): reviews and mapped GAG, heuristic case study, not representative mobile player acquisition. Reviews reveal important barriers, do not estimate proportions.

## 6. Решение аудитора и ограничения

**ADOPT как методику:** семь contract layers и независимые statuses, test environments, triage root cause, game-specific minimal fixes, limit automation claims, hardware/assistive test.

**Не ADOPT автоматически:** universal accessibility mode/framework, DOM-overlay onto every Phaser cell, forced font choice, redesign art themes, persistent overlay captions, extra reward/time controls, new save schema and generic SDK exports.

**Чего не знаем:** реальный проход TalkBack, Switch, Voice Access и крупного Android font на шести текущих APK; фактические ограничения моторики/цветового зрения аудитории; воспроизводимую нехватку CTA size; доказанный вред/пользу какой-либо новой настройки; юридический WCAG статус каждого канала/магазина; экономию human QA времени. Не скрывать UNKNOWN за «все browser tests зеленые».

**Итог:** исследование подтверждает дешёвые первичные методы обнаружения неудобных барьеров и их устранения в существующем дизайне. В отличие от новой механики/меты, локальный P0 жеста или фокуса может быть оправдан сразу; крупные адаптации и маркетинговые claims — только с настоящими тестами.
