# Accessibility & Inclusive Puzzle UX — практический протокол для маленьких игр

**Срез первичных рекомендаций и исследований:** 12 ноября 2026. **Статус:** независимая методология, не юридический сертификат WCAG, не подтверждённый аудит всех экранов шести приложений и не доказанный прирост retention. **Фокус:** Android/RuStore и WebView/Phaser/HTML, при реальной веб-цели отдельно Yandex Games. **Ограничение:** качество игры, её характер и низкий production burden необходимо сохранять.

> Главная мысль: доступность — не добавление «специального режима», а проверка, способен ли человек **увидеть нужную информацию → выполнить намеренное действие → понять последствие → исправить ошибку и продолжить** без ненужного моторного, зрительного, сенсорного или когнитивного барьера. Меню, игровая доска и переход после рекламы — разные области проверки.

## 0. Что уже есть и почему эта ветка отдельная

- [Puzzle Production](../PUZZLE_PRODUCTION.md) — UI-композиция, длинные поля, Undo/progress, reduced motion и сохранение. Не заменять готовые рецепты.
- [Puzzle Design Operating Playbook](../puzzle-design/PUZZLE_DESIGN_OPERATING_PLAYBOOK_2026-11-11.md) — Gates 1/2/4/8, input causality, feedback и player control. Здесь конкретизируем **инклюзивность ввода и восприятия**.
- [FTUE Diagnostic](../puzzle-design/FTUE_DIAGNOSTIC_PROTOCOL_2026-11-12.md) — first-action/learning diagnosis. Не требовать туториал там, где недостаточен контраст или hit area.
- [Visual Preproduction](../visual-preproduction/README.md) — утверждённое визуальное направление и экранный срез. Доказанные accessibility дефекты исправляются **без полного редизайна**.
- [Android Ads & Lifecycle](../android/ADS_AND_LIFECYCLE.md) — native/WebView/fullscreen ad возвращение, ошибки и стабильная геометрия.
- [Independent Accessibility Audit](INDEPENDENT_AUDIT_2026-11-12.md), [Consumer QA Record](ACCESSIBILITY_QA_RECORD_TEMPLATE.md) — пределы доказательств и короткий применимый отчёт.

**Не создавать:** общий accessibility engine, второй UI framework, большой набор универсальных настроек, автоматическую ARIA-прокладку на десятки тысяч ячеек, фальшивую поддержку TalkBack, встроенное распознавание инвалидности, пользовательские профили диагнозов. Исследования не разрешают трогать published content IDs, экономику, рекламу и чужие APK.

## 1. Первичные ориентиры: требования, рекомендации и пределы переноса

| Источник / критерий | Точный смысл | Как использовать для нашей игры |
| --- | --- | --- |
| [Android: touch target](https://support.google.com/accessibility/android/answer/7101858) | **Рекомендация** для интерактивных элементов: зона касания **не менее 48×48 dp**, примерно 9 мм; при плотных соседях ориентир ≥8 dp spacing. Визуальная иконка может быть меньше реального hitbox | Проверять меню, Hint/Undo/Next/Back, модальные диалоги, close/rewarded choices; не навязывать 48 dp **каждой клетке** плотного пространственного пазла без проверки самой механики |
| [WCAG 2.2 SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | Веб **AA**: 24×24 **CSS px** либо исключения spacing, equivalent, inline, UA control, essential | Не путать с Android 48 dp. Наличие WCAG исключения не означает, что маленькую кнопку удобно нажимать |
| [WCAG 2.2 SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) | Веб **AA**: предоставить single-pointer альтернативу drag, если drag не essential; клавиатура сама по себе не заменяет **pointer** alternative | Уместны select-source → tap-target для карточек/фигур или route step controls. Точное равенство результата проверять, не ломать gameplay ради формальной галочки |
| [WCAG SC 1.4.3 and 1.4.11](https://www.w3.org/TR/WCAG22/) | Веб AA: обычный текст ≥**4.5:1**, большой текст ≥**3:1**, жизненно важные не-текстовые UI-индикаторы и графические части ≥**3:1** против соседних цветов, с оговорёнными исключениями | Мерить реальные foreground/background на экране, включая состояния selected/disabled/pressed. Не считать anti-alias/градиенты по одному CSS-токену |
| [WCAG SC 1.4.1 use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) | Цвет не единственный визуальный способ сообщать информацию и состояние | Цвет жидкости/пазла дополнить различимыми символами/рисунками/расположением, если иначе ошибка неотличима; делать optional labels/patterns там, где они не разрушают игру |
| [WCAG SC 1.4.10 reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow) | Веб AA: обычный текстовый UI должен reflow при узком эквиваленте 320 CSS px; **двумерные игровые поля имеют узкое исключение**, но оно не распространяется автоматически на меню/подписи | Игра может иметь zoom/pan для поля, но settings/Help/results/ads dialogs должны оставаться читаемыми |
| [Android 14 font scaling](https://android-developers.googleblog.com/2023/02/first-developer-preview-android14.html) | Возможна non-linear font scale до **200%**; Android призывает тестировать максимальный размер | В WebView фиксированный CSS и Phaser text могут реагировать **иначе**, поэтому измерять на настоящем APK/OS; web screenshot при 125% не доказательство 200% на телефоне |
| [WCAG SC 2.3.3 motion](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions) | Веб **AAA**: необязательная motion animation по действию может быть выключена | При reduced motion не скрывать победу/награду, просто сокращать перемещения, тряску, автопрокрутку, parallax; не требовать AAA-юридической маркировки игры |
| [WCAG SC 2.3.1 flashes](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold) | Веб **A**: более трёх вспышек в секунду запрещены, если не выполняется строго определённый порог для flash area/intensity | Проверять яркие выигрышные эффекты/мигание/повторяющиеся анимации отдельно от reduced motion; переключатель не компенсирует опасную вспышку до доступа к настройке |
| [Xbox Accessibility Guidelines v3.2+](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines) | **Best practices**, не игровой закон или WCAG-conformance. Различают input, object clarity, text, screen narration, haptics, visual distraction, cognitive navigation | Подсказки для дизайна, а не автоматически необходимые настройки в каждой двухминутной Android-игре |
| [Android Accessibility Testing](https://developer.android.com/guide/topics/ui/accessibility/testing) | TalkBack, Switch Access, Voice Access, Accessibility Scanner + автоматические проверки + тесты настоящих пользователей | Должны охватывать **реальные игровые сценарии**, не только домашнее меню |

**Граница правового вывода:** WCAG 2.2 — нормативный веб-стандарт с уровнями A/AA/AAA; Xbox — рекомендации; Android 48 dp — рекомендуемая зона нажатия. Применимость стандартов к конкретной коммерческой нативной игре зависит от законодательства и договора — **не объявлять автоматический legal obligation**, не утверждать full WCAG AA по одному тесту.

## 2. Что знает исследовательская литература, а чего пока не знает

- [Abdoulqadir & Loizides 2026](https://doi.org/10.1080/10447318.2026.2651346): systematic review **61 studies** по мобильным играм для сочетанных нарушений зрения/моторики/речи/слуха, PRISMA; сильный перекос исследований к зрительным ограничениям, мало данных о субъективном удовольствии и ограничена эмпирическая валидация. **Один accessibility toggle не гарантирует доступность человеку с сочетанными особенностями**.
- [Anderson 2023/24, game accessibility mapping](https://journals.sagepub.com/doi/full/10.1177/14614448231204020): обзор **162 manuscripts** 2016–2020, перекос в utility/education/health и недостаток research о pleasure и моторных/слуховых ограничениях. **Compliance ≠ доказанный enjoyment/retention uplift**.
- [Di Leo & Tarantino 2026](https://dl.digra.org/index.php/dl/article/view/2833): mapping player accessibility reviews к GAG и случай Minecraft Education; игроки часто говорят о базовых hearing/motor/visual барьерах даже если formal frameworks описывают больше. Это не репрезентативная выборка покупателей RuStore.
- [Game Accessibility Guidelines: simultaneous actions](https://gameaccessibilityguidelines.com/ensure-that-multiple-simultaneous-actions-eg-click-drag-or-swipe-are-not-required-and-included-only-as-a-supplementary-alternative-input-method/): моторные требования комбинированного hold+move выше, чем одного tap. Отдельно отмечают, что некоторые игроки любят drag/swipe: **оставлять привычный способ, добавляя альтернативу**, если она не меняет требуемое игровое решение.

**Итог:** не обещать увеличение DAU/ретеншена или обязательную AAA-полноту из W3C/тестового корпуса. Цель — конкретные устранённые барьеры и работающая самостоятельная игра.

## 3. Семь независимых contract layers

1. **Perception:** нужный объект и его состояние различимы без одного ненадёжного канала (тонкого цвета, мелкого шрифта, только звука/вибрации). Контраст/масштаб/символы/фокус.
2. **Intentional input:** видимая кнопка и реальная hit area совпадают по смыслу; тап, drag, swipe, hold и pointercancel не приводят к случайному другому действию. Альтернативы там, где моторная сложность не является ядром.
3. **Spatial control:** полноразмерное поле видимо или доступно через предсказуемый zoom/scroll/pan; камера и pointer не отрезаются невидимыми границами; масштаб не ломает координаты.
4. **Comprehension:** текущая цель, выбранный объект, разрешённость действия, причина отказа, стоимость помощи и достижение понятны без длинных сервисных абзацев или принудительного обучения.
5. **Feedback channels:** события с последствиями доступны по меньшей мере двумя разумными способами, например видимый persistent result + optional sound/haptic. Haptic/score-float не единственный канал подтверждения.
6. **Recovery/time:** Undo/Cancel/Restart/Back, no-fill/ad close, app pause, focus restore, optional slower tempo, no forced time windows для задач с паузами; state commits independent from VFX.
7. **Assistive compatibility:** DOM accessibility tree для кнопок/списков/диалогов; TalkBack/Switch Access/Voice Access реально проверены; Phaser/Canvas pixel object **не становится автоматически** отдельным accessibility node. Заявление о доступности **core gameplay** требует самостоятельного evidence.

**Не считать все семь обязательными к новой реализации.** Сначала case-by-case audit и один реальный барьер. Сильная зрелищная подача, художественный стиль и тактильность могут сохраняться — если критический смысл не живет только в одном непригодном канале.

## 4. Input-first: для пользователя задача не должна состоять в борьбе с жестом

### A. Все основные способы размещения / перемещения

**Block Puzzle/Association Solitaire (drag):**
- Предпочтительная дополнительная гипотеза: tap-select source → tap a legal target; после первого tap явное выделение, допустимые цели различимы, второй tap коммитит **только проверенный легальный ход**, отмена доступна. При невозможности сохранить точность/размещение — не добавлять сломанный режим, а сперва доказать альтернативу.
- Drag продолжает поддерживать pointer capture, movement within entire screen, edge auto/pan only where appropriate, release/cancel, background/resize, touch→synthetic mouse duplicate suppression. Карта не должна исчезать за тайным hit region.
- Сравнить число ошибочных жестов/отмен, а не только завершённые уровни. Touch alternative не должен давать дополнительную помощь solver или менять score.

**Road Lines (route drawing):**
- Текущий source уже содержит arrow-key directional movement и touch relative steering outside figure. Сначала проверять реальную возможность запуска с клавиатуры/экранным альтернативным шагом и понять причину неудачи, а не ещё раз писать gesture engine.
- Если явно нужна single-pointer без continuous drag — вариант tap one orthogonal neighbor / 4 small step controls только после сравнения UX на малом экране и game fairness.
- Невидимые границы и reset при потере pointer capture — критическая проверка.

**Water Sort (tap source→tap destination):**
- Двухтаповый принцип есть. Проверять не только цвет, но и смысл меток жидкости, выделение откуда/куда, состояние запечатанной/замороженной/мини-колбы.
- Touch/mouse duplicate must not deselect; поддерживать scroll-field, no hitbox overlap и real target scaling.

**Arrows (tap to free, pan/pinch):**
- Основное действие одиночным tap уже есть. Вопрос — может ли человек заметить конкретную голову стрелки и нажать её на плотном поле; спасают ли zoom и accessible button control.
- Pinch не должен быть единственной дорогой к нужному увеличению там, где альтернативный zoom control возможен без новой игры. Проверить реальный pinch/tap conflict с длинным press preview.

**Seeds Bits (DOM number cells):**
- Реальные button cell имеют aria label с числом/строкой/столбцом; это не доказательство доступного прохождения всей головоломки TalkBack. Фокус после удаления строк, scroll anchor, tab stop, связность выделенной пары и safe focus after transition требуют ручного теста.
- Очень длинные поля могут физически не позволять 48 dp каждому числу одновременно; масштаб/прокрутка/активное окно и точность пальца важнее бессмысленного запрета на длинную сетку.

### B. Глобальные правила

- Поддерживать touch, mouse, доступный keyboard operation и настоящие Android assistive services **по необходимости**. Keyboard-only доступность не автоматически доказывает pointer without drag.
- Не делать удержание, сложный свайп и вторую руку обязательными без ядрового игрового смысла.
- Заблокированный/нелегальный ход должен быть чётко отличимым; no-op не имитирует успешную постановку. При случайной отмене не тратить Hint/валюту/ход.
- Ошибка ввода и ошибка логического решения — разные причины. Нельзя занижать сложность уровня из-за недоступной кнопки.

## 5. Text and color: полноценная информация без увеличения UI-шума

**Текст:** проверить реальные RU и EN, длинные даты, «Подсказки закончились», reward amounts, ошибки SDK, settings, Hint/Undo/Ad buttons; перенос строк, отсутствие обрезания, верную очередь фокуса, доступность после смены ориентации. В Android 14+ включить font scale 200%, а также Display Size; browser viewport 320×568/568×320 с подменой CSS zoom — не окончательная physical acceptance.

**Цвет:** color-only state — высокий риск для Water Sort и систем цветов/статуса. Проверить различимость в симуляции deuteranopia/protanopia/tritanopia **как вспомогательном тесте**, затем на нормальном/тёмном/ярком экране. Альтернативы: текстовая метка, pattern, distinct shape mark или contour, но не обязательно наклеивать буквы на каждую маленькую каплю. Симулятор цвета не заменяет реальную аудиторию.

**Контраст:** проверять нужные фигуры/головки/пустые клетки, текст/disabled/focus и баннерную область как *соседние цвета финального кадра*, а не только primary/secondary CSS variables. Не делать все клетки одинаково яркими: иерархия может быть сохранена при достаточной читаемости. Измерение на screenshot — QA, не доказательство истинного visual comfort.

**Масштабирование:** game board может иметь 2D spatial exception и собственную камеру; **но** меню, справка, диалоги, настройки, платежная/рекламная модалка должны reflow. В очень коротком landscape продумать прокрутку вместо уменьшения всех кнопок/шрифта.

## 6. Motion, audio, haptics: сохранять feel, не теряя смысл

- **Reduced motion:** не только CSS media query; проверить конфигурацию движка Phaser, Android WebView, JS tweens, FX, confetti, screen shake, flight of rewards, pointer drag preview и user setting. Когда движение выключено, **очки, награда, переход и доступность next action остаются теми же**.
- **Flash safety:** отдельно проверять яркие повторные победные bursts и фоновые пульсации на быстром рендере, особенно при цикле уровней. Reduced motion setting не заменяет контроль опасной вспышки до открытия настроек.
- **Sound/haptic:** значимое решение и ошибка не должны быть доступны **только** через звук, сильную вибрацию или цветную вспышку. Если haptic off/no actuator/audio muted, игрок всё равно видит причинное подтверждение действия. Audio settings и Android DND не должны ломать state transitions.
- **No accidental time gating:** анимация не должна быть условием начисления награды, подтверждения победы и сохранения. Быстрый Next, Back, pause, orientation, process death должны replay корректно. Не требовать постоянной зрительной концентрации во время долгого праздника.

## 7. TalkBack, Switch Access, Voice Access и реальное ограничение Canvas

**DOM/HTML controls:** native button semantics, labelled dialogs, aria-pressed only for real selectable state, aria-live only for кратких актуальных событий, logical focus order, accessible Back, focus restore after modal. Decorative graphics aria-hidden to avoid noise. Не использовать aria-label как замену видимого доступного текста.

**Phaser/Canvas board:** нарисованные стрелки/жидкости/карты не являются автоматически отдельными DOM-узлами, даже если canvas подписан общим label. Можно создать **ограниченную доступную семантическую оболочку для ключевых действий**, только после проверки одного реального пользовательского сценария и достижения parity. Нельзя утверждать «TalkBack поддерживается» на основании факта, что читается кнопка «Настройки». Полная screen-reader механика большой пространственной головоломки — отдельный возможный проект с высокой стоимостью и неизвестным human payoff; не внедрять универсальный grid UI без прототипа.

**Проверка:**
1. TalkBack: прочитать текущее меню, выбрать режим, дойти до игры, услышать осмысленную цель/состояние, выбрать возможное действие либо честно зафиксировать unsupported core, выйти/возобновить.
2. Switch Access: пройти focus scanning, modal, gameplay alternative where exists, не попадать в бесконечную череду фоновых элементов.
3. Voice Access/keyboard: проверить, можно ли выполнить главные кнопки и доступное действие без precision drag; не объявлять speech-only core universal.
4. Accessibility Scanner: полезен для DOM/native контролов, но **не подтверждает** семантику Canvas и game feel.
5. Physical device + actual disabled participants: самостоятельная наблюдаемая задача без наведения/подсказки дизайнера, с согласием и без сбора диагнозов в телеметрию.

**Отдельные статусы:** MENU_ACCESSIBLE / CORE_ACCESSIBLE / PARTIAL_WITH_DOCUMENTED_LIMIT / UNKNOWN / FAIL. Один PASS по меню не распространяется на всю игру.

## 8. Минимальный путь проверки: high-risk-first, не тотальный переезд

### Stage 0 — снимок и уже принятые решения
Repository/HEAD, OS/WebView/Android SDK, game version, device/orientation, user settings и текущий baseline. Найти уже реализованные gesture alternatives, zoom, saved reducedMotion и aria-label. Не переписывать решения, которые работают.

### Stage 1 — блокирующие P0
Недоступно основное действие в поддерживаемом устройстве/режиме; loss of progress при pointercancel/Back; риск небезопасной flashing анимации; ложная покупка/рекламное согласие из-за маленькой/перекрытой зоны; безвозвратная ситуация после модалки. Fix независимо от теоретической оценки «аудитории».

### Stage 2 — самый дешёвый P1
Кнопки/таргеты, контраст, reflow UI, видимый выбор, альтернативный tap, отказ от тряски, объяснение ошибки, порядок фокуса. Исправлять отдельный конкретный компонент, не заменять стиль и типографику массово.

### Stage 3 — спорные адаптации
Увеличение плотного поля, labels/patterns, новый touch mode, доступное representation Canvas, отдельная опция скорости — только по evidence и проверке core/gamefeel при неизменных правилах.

### Stage 4 — acceptance
Автоматически: collision/viewport/contrast properties для DOM, deterministic replay, same rewards with reducedMotion, pointer gesture lifecycle. На реальном телефоне: TalkBack/Switch/large font/Display size/color correction/mute/no haptic/no internet/ad return; краткий human comparison при спорном изменении. Настоящий app/phone screen, не только browser inspector.

**Сохранять UX характер:** новые опции и альтернативные действия не должны превращать яркую casual игру в служебную панель с десятками текстовых плашек. Настройка может быть компактной/контекстной, а общий стиль — прежним. Исправить доступность не значит уничтожить художественную идентичность.

## 9. Consumer-specific карта: гипотезы для проверки, НЕ подтверждённые дефекты

| Игра | Уже подтвержденные элементы кода/документов | Высокая ценность следующей узкой проверки |
| --- | --- | --- |
| **Seeds Bits** | HTML button cells, roving focus, aria-label с координатами; 150% text/portrait-landscape matrix; большая рабочая область | Реальный TalkBack на длинном поле и после collapse; 200% Android font + scroll/focus preservation; не создавать 1800 accessibility controls вне viewport без нужды |
| **Arrows** | Tap-to-remove, pan/pinch/hold preview; 0.17.1 утолщена геометрия и шрифт; 125% UI test | Мелкие головы на плотном поле при максимальном масштабе/без pinch, разница между select и pan, альтернативный zoom control, реальный телефон с enlarged font |
| **Road Lines** | Pointer capture/full-screen relative steering; arrow-key route input; реальный phone playtest исправлял touch/back/навигацию | Single-pointer route alternative без continuous drag, реально читаемый feedback illegal turn, keyboard focus Android/Canvas и small landscape с баннером |
| **Water Sort** | Tap-source/tap-destination; duplicate touch/mouse suppression; scroll-field; button states 48px in старой теме | Color identification без исключительно цвета, freeze/mini/hidden layer state, TalkBack semantics для колб, large-screen/disabling animation |
| **Association Solitaire** | Drag + click-select target, card reader; frozen semantic levels; reducedMotion state; phone/short layout checks | Перекрытые подписи/доступ к полной категории, перемещение через tap при большой карте, reader focus, Voice/Switch/TalkBack, экраны с настоящим banner slot |
| **Block Puzzle** | Игровой code пока на feature branch, не устаревшем main; технические playtest на gestures и поле, рабочий preview0.63 | Drag without precision hold, enlarged tray/board, сохранение координат и clear feedback при reducedMotion; не менять генератор по причине input barrier |

Не запускать всем шести ещё один общий accessibility mode. После QA **не менять правила пазлов и награды** без обнаруженного дефекта. Для Block Puzzle отдельно отстаивать границу «директор партии vs precision control».

## 10. Minimum report contract

Агент завершает проверку конкретного consumer с:
- статусом каждого из семи contracts: PASS / FAIL / UNKNOWN / NOT APPLICABLE с конкретным evidence (не галочка по умолчанию);
- top one/two воспроизводимых барьера, real screen/device/settings, размер **действительного** hitbox, причиной;
- минимальной альтернативой и доказательством сохранения core rules/score/save;
- отдельной записью keyboard/TalkBack/Switch/Voice Access/large-font/reduced-motion, отмечая реально запущенные и не запущенные;
- human limitation, если речь о субъективной комфортности;
- решением FIX / TRY SMALL ACCESS MODE / HOLD / NO CHANGE и критерием остановки.

**Success metric:** игрок способен выполнить тот же осмысленный ход с меньшими ненужными ограничениями, а обновление не ломает core, performance, сохранение, рекламу и характер игры. Число тестов, 200% font scale и «прошёл scanner» сами по себе не доказывают доступность/удовольствие/retention.
