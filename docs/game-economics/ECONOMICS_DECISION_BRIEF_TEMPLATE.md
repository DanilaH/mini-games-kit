# Economics Decision Brief — одна игра, один платёжный путь, одно следующее решение

**Назначение:** копировать в consumer repo или в конкретный портфельный decision log, когда есть практический вопрос об окупаемости/релизе/новой доработке. [Game Economics Guide](README.md) и [Independent Audit](INDEPENDENT_AUDIT_2026-11-12.md). Отсутствие подтвержденного дохода — UNKNOWN/PENDING, не фантазийная оценка прибыли.

## 0. Точное исходное состояние

| Факт | Данные + ссылка/дата |
| --- | --- |
| Название, repo, настоящий HEAD, build и content/policy version | |
| Магазин, география, платформа и текущая public release state | |
| Канал: YAN Android / Yandex Games web / Play Billing / RuStore IAP / другой | |
| Какая юрисдикция, тип издателя и договор на самом деле применимы | |
| App monetization status: test/pending/active/rejected | |
| Подтверждение владения, store link, app-ads.txt/email, moderation | |
| Договорная валюта, payout method и payout threshold | |
| Доступность выплат на собственный банк/СБП | |
| Источник первичной статистики и дата, исключены ли тестовые пользователи | |
| Уже закрытые release QA и открытые P0 | |
| Решение владельца об эксперименте или store submission, если нужно | |

**Критический коммерческий gate:** VERIFY / PENDING / UNKNOWN / BLOCKED. Реальный paid inventory есть? Если нет — сначала исправить допустимость и measurement, а не рассчитывать ожидаемый доход.

## 1. Словарь фактических событий (подставлять exact Console definitions)

| Stage | Наблюдение, период/страна/store | Exact numerator / denominator | Source / confidence |
| --- | --- | --- | --- |
| New installs / real first opens | | | |
| DAU, MAU, active game hours | | | |
| D1, D7, D30, original cohort size and maturity | | | |
| Ad opportunities / player intent | | | |
| Valid ad requests | | | |
| Served / matched ads | | | |
| Counted impressions: banner | | | |
| Counted impressions: interstitial | | | |
| Counted impressions: rewarded | | | |
| Fill and show rate (separate) | | | |
| Publisher eCPM for each real format | | | |
| Finalized advertiser/network adjustments | | | |
| Confirmed publisher revenue | | | |
| Game IAP gross / refunds / net (only if live and legal) | | | |
| Estimated AppMetrica Ad Revenue (reference, NOT added) | | | |
| Estimated vs confirmed payout balance | | | |

**Do not double-count:** AppMetrica + YAN reports; actual impressions × fill; publisher net eCPM × platform deduction again; one install event as unique DAU/MAU.

## 2. Cash ledger and payout reconciliation

| Period | Real network settled publisher earnings | Adjustments | Carried balance | Threshold met? | Payout sent | Bank received | Tax status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | | |

**Порог и валюта по договору:** …
**Статус НПД/ИП/юридического лица (не предполагать):** …
**Несколько игр одного договора суммируются?** VERIFIED / UNKNOWN + подтверждение
**Яндекс Игры + YAN Android:** не объединять автоматом.
**Отдельно estimated, accrued, payable, received:** …

## 3. Future cost ledger (денежная и экономическая модель)

| Следующая реальная работа | Owner/team/agent hours | Cloud/API/QA/прочие реальные деньги | Повторится каждый месяц? | Source |
| --- | ---: | ---: | --- | --- |
| Багфиксы/SDK/update target | | | | |
| Store package/moderation/listing | | | | |
| Native/emulator/real-phone QA | | | | |
| Content generation and independent human review | | | | |
| Source/organic discovery and outreach | | | | |
| Analytics/revenue reconciliation/legal docs | | | | |
| Shared kit infrastructure (portfolio, not blind per-game split) | | | | |

**Выбранная собственником альтернативная стоимость часа:** … либо UNKNOWN. Эта ставка не должна притворяться рыночной зарплатой.

**Cash operating contribution:** settled/received after applicable taxes minus real cash expenses.
**Economic operating contribution:** cash contribution minus documented future hours × chosen hour value.
**Full retrospective payback:** только отдельная сумма накопленного net contribution минус исторические build costs.
**Marginal next-work decision:** игнорировать необратимые sunk hours, считать только будущие затраты и проверяемый будущий эффект.

## 4. Scenario model — все параметры гипотезы явно подписаны

**Условие:** финансовый канал legally VERIFIED; если BLOCKED, расчёт дохода только counterfactual и не основание для разработки.

| Параметр | Stress downside | Neutral scenario | Upside scenario | Источник факта/статус предположения |
| --- | ---: | ---: | ---: | --- |
| Real active DAU average | | | | |
| Counted banner impressions / DAU | | | | |
| Counted interstitial / DAU | | | | |
| Counted rewarded / DAU | | | | |
| Publisher eCPM banner / currency | | | | |
| Publisher eCPM interstitial / currency | | | | |
| Publisher eCPM rewarded / currency | | | | |
| Horizon in days / seasonality | | | | |
| Payout/invalid traffic adjustment | | | | |
| Actual cash maintenance per month | | | | |
| Hours per month to maintain | | | | |
| Tax scheme / contract payout delay | | | | |

**Формула:** monthly ads = sum across formats/days (counted impressions × corresponding publisher eCPM / 1000). Если использовать opportunities вместо actual impressions, явно учитывать request/fill/show по их знаменателям, **не** повторять множители.

**Вывод без подмены вероятностей:** диапазон cash contribution, диапазон economic contribution, worst stress after publication, времени до payout и «что надо доказать, чтобы верить каждому параметру». Не выдавать neutral scenario за expected value без исторической выборки.

### Cohort LTV (только зрелые данные)

| Install cohort / country/source | N0 | D0 active/revenue | D1 actual | D7 actual if mature | D30 if mature | Revenue D0..T | LTV T = revenue/N0 | Exclusions |
| --- | ---: | --- | --- | --- | --- | ---: | ---: | --- |
| | | | | | | | | |

**Не сравнивать** календарный DAU всех когорт с LTV одной когорты. Если D7 незрелый — UNKNOWN, не 0. Ручной суммарный income report без разбивки по cohort **не** позволяет вычислить истинный install cohort LTV.

## 5. First-broken-stage recursive diagnostic

| Gate | PASS / UNKNOWN / BLOCKED | Cheapest next check | STOP rule |
| --- | --- | --- | --- |
| Реальная store публикация и география | | | |
| Договор и bank payout / compliance | | | |
| Ad unit ACTIVE и оплачиваемые показы | | | |
| Network counted impressions vs request/no-fill | | | |
| Реальные acquisitions/source/DAU | | | |
| Mature cohorts and healthy first experience | | | |
| Confirmed publisher earnings and payout | | | |
| Future cost/maintenance | | | |

**Первый не подтверждённый этап:** …
**Какая новая информация изменит решение:** …
**Какие риски не исправляются игровыми фичами:** …

## 6. Принудительное независимое опровержение

Опишите **три самые сильные причины**, почему оптимистичный сценарий неверен:

1. …
2. …
3. …

Обязательно проверить: нет доступной рекламной сети; audience/revenue unverified; объявление не показывается/не оплачивается; ad eCPM снижен; retention портится из-за увеличения рекламы; payout threshold/contract; расходы на SDK/platform updates и QA; значение метрики ошибочно; revenue дважды учтён; большая партия или review не доказывают DAU.

**Counterfactual:** что будет, если мы НЕ будем делать следующую работу в течение следующего периода? Сколько future cost saved и какая наблюдаемая цена решения?

## 7. Один из трёх вариантов следующей работы

| Вариант | One-off + future hours/cost | Потенциальный measurable gain | Риск и earliest evidence |
| --- | --- | --- | --- |
| A: исправить один bottleneck существующей игры | | | |
| B: довести готовый релиз до настоящего рынка | | | |
| C: начать одну новую малопроизводственную игру | | | |

**Почему выбранный вариант лучше двух остальных по реальным свидетельствам:** …
**Цена неопределённости:** …
**Чего не надо делать (директоры/мета/дорогой арт без причины):** …

## 8. Итог

**Вердикт:** VERIFY ACCOUNT / VERIFY LIVE ADS / RELEASE LEARNING / FIX ONE BOTTLENECK / CONTINUE LIMITED / HOLD / STOP CHANNEL / NO CHANGE

**Подтверждено публичными источниками:** …
**Подтверждено своим Console/банком:** …
**Только сценарии:** …
**UNKNOWN/blocked:** …
**Следующий один проверяемый шаг и effort cap:** …
**Stop/rollback если:** …
**Следующая дата актуализации условий договора/данных:** …

**Нет разрешения** на публикацию, платежи, изменения рекламы, массовый outreach, создание новых SDK/директоров или обход KYC. Утверждение владельца отдельно.
