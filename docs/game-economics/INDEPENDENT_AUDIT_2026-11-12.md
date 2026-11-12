# Independent Second-Pass Audit — Game Economics & Revenue Modeling

**Дата:** 12 ноября 2026. **Проверяемый документ:** [Game Economics](README.md). **Тип:** повторная независимая проверка официальных условий, определений метрик, арифметики и инвестиционных выводов. **НЕ:** аудит конкретного банка/подключённого аккаунта, прогноз реальных показов, договорная или налоговая консультация.

## 1. Основной опровергаемый тезис

**«Маленькая Android-игра стоит дёшево, значит может почти пассивно приносить деньги, если добавить Yandex Mobile Ads».**

**Вердикт: НЕ ДОКАЗАНО.** Технически готовый APK, публичная публикация, разрешённая монетизация, реальные оплачиваемые показы, начисленный доход, доступная банковская выплата и прибыль — разные условия. Можно иметь хорошие цифры по игровому времени при отсутствии рекламного договора, платного fill, органического трафика или положительной экономической маржи. Это не запрет производить маленькие игры, а запрет объявлять гипотетическую выручку доказанной.

## 2. Таблица независимых опровержений

| Утверждение | Источник | Вердикт / точная граница |
| --- | --- | --- |
| «RuStore debug с работающей рекламой = оплачиваемая монетизация» | [YAN app addition](https://ads.yandex.com/helpcenter/ru/monetization/app/add) | **REJECT:** неопубликованное приложение получает test mode, его показы не оплачиваются; после публикации нужны verification и Active |
| «YAN работает с RuStore» | [YAN app addition](https://ads.yandex.com/helpcenter/ru/monetization/app/add), [quick-start](https://ads.yandex.com/helpcenter/ru/quick-start) | **VERIFIED for supported distribution**, но не для неопубликованной APK |
| «Рекламные блоки всегда платят при успешном SDK show» | [YAN moderation](https://ads.yandex.com/helpcenter/en/payments/app-moderation) | **REJECT:** app must be Active; ad impressions при pending/testing не оплачиваются |
| «Российский AdMob publisher может получить AdMob доход» | [AdMob 2024 deactivation](https://support.google.com/admob/answer/15277574?hl=en) | **REJECT:** российские AdMob publisher accounts деактивированы |
| «Январь 2025 полностью вернул AdMob» | [Google regional pause](https://support.google.com/publisherpolicies/answer/15766875?hl=en) | **REJECT:** ограниченная опция third-party waterfall не означает восстановления российских publisher accounts |
| «Бесплатные игры в Google Play ⇒ работает Play Billing России» | [Play payments Russia](https://support.google.com/googleplay/android-developer/answer/11950272?hl=ru) | **REJECT:** бесплатный download отдельно, Billing платных/IAP приостановлен |
| «RuStore Pay SDK и YAN — одна схема» | [RuStore developer](https://www.rustore.ru/developer), [YAN](https://ads.yandex.com/helpcenter/ru/monetization/app/add) | **REJECT:** разные платёжные/рекламные продукты и договоры |
| «Любой физлицо RuStore может активировать встроенные покупки» | [RU developer page](https://www.rustore.ru/developer) vs ранее конфликтующие EN материалы | **UNRESOLVED until Console/contract**; RU говорит об ИП/юрлицах, бесплатная публикация доступна физлицам |
| «Яндекс Игры и YAN Android имеют один общий выплатной баланс» | [Games licensing](https://yandex.com/dev/games/doc/en/payments), [YAN payouts](https://ads.yandex.com/helpcenter/en/payments/payments) | **UNPROVEN:** не суммировать отдельные договоры автоматически |
| «Яндекс Игры объединяют заработок всех игр внутри своей схемы» | [Games self-employed](https://yandex.ru/dev/games/doc/ru/payments/self-employed) | **VERIFIED for eligible signed agreement**, все игры и рекламные/IAP доходы в своей программе |
| «Российский самозанятый может легально получать YAN выплаты на свой банк/СБП» | [YAN self-employed](https://ads.yandex.com/helpcenter/en/payments/with-individuals) | **VERIFIED conditionally**: российское резидентство, НПД, документы, договор и bank acceptance для конкретного издателя |
| «3 000 ₽ порог = 3 000 ₽ прибыль» | [YAN payout table](https://ads.yandex.com/helpcenter/en/payments/payments) | **REJECT:** порог перечисления ≠ net profit ≠ payback капитала |
| «Налог для любого нашего издателя 6%» | [Games NPD](https://yandex.ru/dev/games/doc/ru/payments/self-employed) | **REJECT universal**: только при фактически применимом российском НПД и договоре |
| «Срок уплаты НПД однозначен в разных справках Яндекса» | [Games](https://yandex.ru/dev/games/doc/ru/payments/self-employed) указывает 25-е, [YAN](https://ads.yandex.com/helpcenter/en/payments/self-employed) указывает 28-е | **DOC CONFLICT:** не брать налоговый срок из kit; проверить действующую ФНС и собственный статус |
| «Ad request = показ = деньги» | [YAN metric dictionary](https://ads.yandex.com/helpcenter/en/monetization/statistics/metrics) | **REJECT:** requests/served/countable impressions/revenue — отдельные этапы |
| «После подсчета impressions ещё надо умножить на fill и show» | YAN metrics | **REJECT DOUBLE COUNT:** fill/show нужны только для вывода показов из запросов |
| «RPM и eCPM имеют одинаковый знаменатель» | YAN metrics | **REJECT:** RPM на тысячу requests, eCPM на тысячу impressions |
| «AppMetrica Ad Revenue + YAN Revenue = общая выручка» | [AppMetrica report](https://appmetrica.yandex.com/docs/ru/mobile-reports/revenue-report), [settings](https://appmetrica.yandex.com/docs/en/settings/revenue) | **REJECT unless proven different income streams:** вероятно дублируют один inventory; auto/manual settings могут менять отчёт |
| «Reward earned = publisher paid impression» | YAN metric dictionary, [Android SDK contract](../android/ADS_AND_LIFECYCLE.md) | **REJECT:** игровой грант и подтвержденный рекламный показ различны |
| «Yandex Games Revenue уже после налогов» | [Games metrics](https://yandex.com/dev/games/doc/en/concepts/metric) | **REJECT:** метрики не включают применимые налоги |
| «DAU за месяц — одна install cohort» | [AdMob LTV definition](https://support.google.com/admob/answer/9736630) | **REJECT:** DAU смешивает несколько install cohorts; LTV — доход на начального пользователя когорты |
| «Retention каждого дня должна строго уменьшаться» | Definition of daily cohort active rate | **REJECT:** игроки могут пропускать дни и возвращаться |
| «У трехдневной когорты D7=0» | Cohort maturity | **REJECT:** нет полного окна, статус UNKNOWN |
| «Реклама всегда ухудшает retention» | [Burns et al., AIIDE 2016](https://ojs.aaai.org/index.php/AIIDE/article/view/12906) | **НЕ ДОКАЗАНО как универсальное правило:** наблюдательная модель 21 игры, слабая общая связь, сильные различия между играми; не causal |
| «Рост показов/DAU гарантирует рост LTV» | Cohort formula and synthetic counterexample | **REJECT:** больше за день может означать меньше будущих активных дней |
| «Preprint +19.23% rewarded применим к любому puzzle» | [Chang et al. SSRN 2026](https://ssrn.com/abstract=6137709) | **REJECT TRANSFER:** другие игры/модель/цель, не оправдание искусственного препятствия или forced rewarded |
| «Шесть игр означают шесть независимых доходных источников» | Разные договоры и аудитории, один ad demand и SDK risk | **UNPROVEN:** общие сбои и аудитория могут коррелировать |
| «Работа агента бесплатна, а хостинга нет» | Owner effort ledger + cloud/API/QA costs | **REJECT:** стоимость контроля и обслуживания не равна нулю |
| «Вложили время в директора => надо заканчивать» | Marginal vs sunk-cost arithmetic | **REJECT:** решение об очередной работе зависит от будущих затрат/выгоды, не прошлых часов |
| «Отсутствие eCPM в кабинете значит точно 0 ₽ по рынку» | Missing data vs disabled payout distinction | **REJECT:** UNKNOWN и BLOCKED различны |
| «Нет выплат за месяц — доход сгорает» | [YAN payout rule](https://ads.yandex.com/helpcenter/en/payments/with-individuals) | **REJECT conditionally:** accrued below threshold переносится по соответствующему договору |
| «Платформенные данные доступности Яндекс Игр за прошлый год применимы сейчас» | [Current recovery notice](https://t.me/s/yangamesdevnews/540) | **BLOCKED as of latest confirmed status:** новые игры/ЕЛС временно приостановлены, проверять снова перед планом |
| «Прибыльный месячный revenue показывает выполнимый банковский payout» | Settlement documents and account status | **REJECT:** invalid traffic adjustments, thresholds, payout delay, KYC/bank restrictions могут изменить cash |
| «Высокая игра/сессия = больше денег» | Ads counted impressions definition | **REJECT:** время не монетизируется автоматически |

## 3. Рекурсивные отрицательные кейсы

### R1 — пользователи отсутствуют

Высокие бот-результаты и качественная APK не генерируют install cohorts. Экономику не считать из фантазии; первый действительный bottleneck — acquisition. Перейти к Organic Discovery.

### R2 — показы тестовые

В YAN pre-release app может выдать тестовую рекламу, которая не оплачивается. Увеличение frequency и content не изменит факт отсутствия Active. Проверить публикацию/договор/модерацию.

### R3 — единицы измерения перепутаны

Рекламные запросы×eCPM вместо impressions×eCPM завышают доход при неполном fill; при уже подсчитанных impressions дополнительное fill/show занижает. Если eCPM рекламодателя до platform share, а не publisher eCPM, расчет также неверен. Сначала metric dictionary.

### R4 — длинная партия вместо полезного дохода

Block Puzzle D74–D77 может дольше сохранять партию, но по ботам не подтверждено ни человеческое удовольствие, ни доход. Повышение длительности партии не является монетизационным KPI и не разрешает манипулировать выдачей ради рекламы.

### R5 — ARPDAU выше, LTV ниже

Условный сценарий A: 0.020 денежной единицы за активный день × 5 активных дней = 0.10 LTV. B: 0.028 × 3 = 0.084. +40% daily, −16% per original player. Это демонстрация возможности, а не причинный результат вмешательства. Нужен достаточный эксперимент.

### R6 — начисления есть, на счету нет

Порог, корректировки, банковский канал, договор и налоги имеют временной и юридический риск. Для принятия cash решения вести отдельно estimated, confirmed, payable, sent, received.

### R7 — портфель выглядит разнообразным, но риски общие

Один рекламный SDK, platform outage, targetSdk update, юридические изменения и support создают затраты/потери сразу для нескольких игр. Не объявлять диверсификацией простое количество APK.

### R8 — ещё один магазин кажется бесплатным

Нужны адаптированные метаданные, QA, SDK/политика, analytics, APK, модерация и поддержка. Новые impressions необязательны. Сначала marginal expected benefit vs actual future hours.

## 4. Арифметика иллюстративной таблицы

При 30 днях, среднем DAU=100, 1.5 counted impressions/DAU-day и publisher eCPM=100 ₽: 100 × 1.5 × 30 = 4500 impressions → 450 ₽. Аналогично DAU 1000 → 4500 ₽, 10000 → 45000 ₽. Арифметика верна, но все параметры **условные**, без модели acquisition/retention, налогов, договора, валюты, сезонности и будущей поддержки.

Порог 3000 ₽ не означает, что условные 4500 ₽ превратятся в 4500 ₽ чистой прибыли. При 100 DAU и постоянных условиях 450 ₽/месяц ≈ семь месяцев до порога, но реальные доходы, коррекции и правила могут изменяться. Этот пример не является оценкой RuStore eCPM или действительного срока первой выплаты.

**Осторожность:** не присваивать вероятности optimistic/base/pessimistic без эмпирики; не называть выбранный median сценарий ожидаемым доходом. Дополнительные стресс-сценарии: traffic zero, unpaid test mode, loss of ad eligibility, lower fill, lower eCPM, retention down, high maintenance, tax/bank restrictions.

## 5. Раздельные уровни финансового свидетельства

1. Официальная публичная справка объясняет возможность и определение, но не подтверждает статус владельца.
2. Консоль/договор подтверждает account, network Active, geo, currency, store и payout, но не гарантирует человеческий retention.
3. Network statistics подтверждает estimated/countable impressions и provisional income, но может корректироваться.
4. AppMetrica/game analytics отражает engagement/оценочную revenue, но её нельзя складывать с данными рекламной сети.
5. Подтверждённые financial statements дают earned/eligible balance, но могут не быть банковским платежом.
6. Bank receipt подтверждает деньги, не причинное влияние игровой правки.
7. Полевая causal проверка может оценить прирост выбранной метрики при сохранённом health/UX; она не переносится автоматически на другие продукты.

## 6. Audit будущих и исторических затрат

- Для решения «продолжать?» учитывать прежде всего **future marginal cost and gain**. Sunk hours не оправдывают продолжение.
- Для ретроспективной полной окупаемости первоначальные затраты учитывать отдельно.
- В денежной модели допускается 0 бесплатного хостинга, но в экономической — реальные часы человека, QA, review, документы и cloud/API.
- Не переводить число GitHub commits в стоимость часа. Отсутствие измерения = UNKNOWN.
- Shared kit work отражать в portolio overhead, не приписывать случайную денежную долю каждому приложению ради удобного ROI.

## 7. Независимый вердикт и остаточные неизвестные

**Подтверждено:** ключевые ограничения YAN, RuStore, AdMob и Play Billing; разные denominators, 3000 ₽ порог при применимых договорах, отличие estimated от bank payouts, невозможность выводить LTV из MAU/DAU, наблюдательные ограничения ad studies.

**Не подтверждено:** реальные доходы, эквивалентный eCPM, ARPDAU, DAU, D1/D7/D30, сезонность, конверсия органики, прибыль и нужный объём ручной поддержки любой из шести игр. Нет авторизованных network/finance exports для настоящего monetization audit.

**Решение:** методологию применять как **eligibility → proof of real paid inventory → reconciled contribution → marginal investment choice**, а не как таблицу красивых гипотетических доходов. Никакого нового SDK, внезапного добавления рекламы или автоматической публикации.
