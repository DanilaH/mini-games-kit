# Store Listing Decision Record — шаблон для consumer game repo

Копировать в `docs/store/STORE_BRIEF.md` своего игрового репозитория. **Никаких указаний «опубликовать» этот шаблон сам не даёт.**

## 0. Product provenance

- Игра / репозиторий / commit SHA:
- App version / build / content version:
- **Статус** со слов владельца: NOT SUBMITTED / IN MODERATION / PUBLISHED / UNKNOWN:
- Целевые магазины **согласованы**: RuStore / Google Play / App Store / Яндекс Игры:
- Какие магазины **не** целевые (ничего не производим):
- Ссылка на Visual Direction / Art Bible:
- Поддерживаемые устройства / ориентации / locales:
- У кого есть права публикации:
- Общий производственный бюджет / deadline / scope:
- Account/regional distribution blockers:

## 1. Positioning

- Один честный игровой promise:
- Основной игрок делает (глагол + объект):
- Основное удовольствие (относится ли к наблюдаемому gameplay?):
- Главный момент для скриншота:
- Наиболее близкие поисковые запросы:
- 3–6 прямых конкурентов по жанру (ссылка + store + дата):
- В чём конкретно отличается наша игра (если пока ничем — указать):
- Что **нельзя** обещать: другие жанры, ненастоящая функция, лживое число задач, no-ads/paid claims:
- Маскот: NONE / APPROVED / ONLY IN PROMO — зачем:

## 2. Creative concepts and approval

| Кандидат | Главная иконка | Первый кадр | Какое обещание | Cost | Risk | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| A — gameplay-first | | | | | | |
| B — alternative | | | | | | |

- Скриншотная последовательность (№ → сцена → что реально доказывает → локализованная подпись):
- Нужен ли видеоролик? Если да, **почему**:
- Источники всех исходных изображений / лицензии / approved mascot:
- Владелец утвердил вариант/направление: дата + ссылка:
- Остались ли продуктовые изменения, требующие нового арта?:

## 3. Surface matrix

| Store + page type + platform | Language | Icon | Cover/feature | Screenshot set | Video | Text file | Ready |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RuStore MAIN / phone | ru | | n/a | | optional | | |
| Google Play MAIN / phone | | | 1024×500 | | optional | | |
| App Store MAIN / iPhone required size | | app icon | n/a | | optional | | |
| Yandex Games DRAFT / selected mobile or desktop | | 512×512 | 800×470 | | per form | | |

УДАЛИТЬ строки для непланируемых площадок. Отдельно записать планшеты/TV/iPad и custom pages **только если это реально target**.

## 4. Technical and truth verification

- Current official docs URLs and verified-at:
- Known conflicts (например RuStore portrait cropping, 30/50 title):
- Raw gameplay capture manifest + SHA256:
- Screenshot and cover artwork provenance:
- Asset size/dimensions/color/alpha/bytes check:
- Text length and forbidden claim check:
- Thumbnails and cropped-surface previews:
- Android/app icon match when required:
- Localization proofread:
- Same product version actually supports all advertised features:
- Store Console preview inspected by human/agent:
- Any BLOCKED/UNKNOWN conditions:
- Physical device QA and live SDK acceptance are separate:

## 5. Quality and experiment plan

- Baseline/current listing (if published):
- Primary conversion hypothesis:
- Pre-launch comprehension check:
- After-launch test availability:
- Primary metric / expected sample limitations:
- Post-install quality guardrails:
- Rollback or revert policy:
- Screens/video of real gameplay used as documentation:
- Owner sign-off: draft / final / upload / submit / publish (separate decisions):

## 6. Handoff

- Where are the final files (not just screenshots in chat):
- How to reproduce exports:
- Who checks live console rule changes:
- What is still missing (BLOCKED):
- What is deliberately deferred (HOLD):
- What should next agent not redo:
