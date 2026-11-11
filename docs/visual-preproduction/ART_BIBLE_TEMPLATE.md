# Art Direction Bible v1 — шаблон утверждённой концепции

**Заполнить только ПОСЛЕ просмотра и выбора визуальных вариантов владельцем.** Для новых игр документ — источник истины для всех последующих ассетов. Статус DRAFT сам по себе не означает approval.

## Паспорт

- Игра / режим / платформы:
- Основная механика и visual promise:
- Концепция, из которой произошёл выбор:
- Статус: DRAFT / OWNER APPROVED:
- Owner approval evidence:
- Дата и версия visual bible:
- Commit / ссылка на исходный concept pitch:
- Ответственный за изменения:

## Visual pillars — 3–5 проверяемых правил

1. Pillar:
   - Как это должно выглядеть на экране:
   - Как определить нарушение:
2. Pillar:
   - Вид:
   - Нарушение:
3. Pillar:
   - Вид:
   - Нарушение:

## Мир и роль игрока

- Setting depth S0–S4; короткое описание мира:
- Что игрок реально делает в этом мире:
- Какие декорации допустимы и что не должно появляться:
- Ограничения на историю и прогрессию:
- Список non-goals:

## Mascot / character bible

- Режим: NONE / BRAND / HELPER / CELEBRATION / PROGRESSION / HERO:
- Job statement; где появляется и где не появляется:
- Если NONE — прямой запрет на самовольное добавление персонажей:
- Имя, архетип, характер без стереотипов:
- Ключевая форма, силуэт, отличительный признак:
- Размер в игре и иконке:
- Базовый вид, лицевая анатомия, пропорции:
- Палитра/материал/положение камеры:
- Разрешённые позы, выражения, реакции и triggering events:
- Запрещённые эмоции/лица на игровых предметах:
- Эталонные изображения, master assets и хеши:
- Как сверять новые варианты с character master:

## UI/UX layout

- Screen inventory и wireframes для compact portrait и остальных поддерживаемых:
- Положение основного board / HUD / primary action / secondary actions / баннера:
- Нормы hit targets, safe-area, большие шрифты:
- Крайние состояния и fallback:
- Навигация/Back/scroll/restore:
- Где использовать контекстную подсказку, не накладывая её на поле:

## Визуальные токены

| Назначение | Цвет / токен | Контраст / доступность | Правило |
| --- | --- | --- | --- |
| Background | | | |
| Board | | | |
| Text primary/secondary | | | |
| CTA | | | |
| Selection | | | |
| Success / reward | | | |
| Error / caution | | | |
| Disabled | | | |

- Фон, материалы, свет, тени, радиусы, границы, отступы:
- Шрифты, веса, числовые начертания, кириллица/латиница:
- Иконки (характер, strokes, perspective):
- Примеры разрешённых и запрещённых asset-решений:

## Feel grammar

| Событие | Анимация / звук / haptic | Длительность / отмена / reduced motion |
| --- | --- | --- |
| Input / selection | | |
| Correct step | | |
| Invalid | | |
| Milestone | | |
| Win | | |
| Return from ad/background | | |

Анимация **никогда** не определяет durable state.

## Asset production contract

- Список v1 по категориям и ожидаемое количество:
- Master files и export profiles (size, alpha, padding, naming, version):
- Default on-screen size и проверки миниатюр:
- Процедурно создаваемые / AI-generated / ручные объекты:
- Воспроизводимые prompts / license / provenance:
- Asset size/runtime memory cap, критерий декодирования:
- Art QA: 3–5 образцов → вся серия, contact sheet, edge cases:
- Кто имеет право менять style envelope:

## Store identity

- Иконка (главный объект, отступы, узнаваемость в миниатюре):
- Название, локализованное игровое обещание:
- Главный магазинный скриншот из authentic gameplay:
- Что изображать в промо запрещено:

## Acceptance и change control

- Approved mockups / actual gameplay captures:
- Проверки compact/landscape/tablet, RU/EN, 150% system font, баннер:
- Проверки реального input, animation, device FPS/size:
- Known compromises and open gates:
- Условия пересмотра сеттинга/маскота/палитры:
- Каждый следующий PR сохраняет эти правила либо оформляет отдельный визуальный change request с причинами и новой проверкой.

**Контроль:** может ли незнакомый новый агент создать 20-й предмет или новый экран, не изобретая заново типографику, перспективу, материалы и роль персонажа? Если нет — документ не завершён.
