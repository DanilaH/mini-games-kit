# Portfolio & Cross-Promotion — только если есть реальная аудитория и дополнительная ценность

**Срез источников:** 12 ноября 2026. **Статус:** независимая методология, не доказанный прирост установок/прибыли. **Область:** малопроизводственный портфель Android/RuStore игр, возможные Google Play/Яндекс Игры; различать отдельные магазины, устройства, аудитории, договоры и правила платформ.

> **Ключевое решение:** не превращать шесть APK в рекламную сеть, пока нет подтверждённой аудитории хотя бы одной исходной игры, доступного опубликованного назначения и конкретного полезного контекста рекомендации. Портфельная ценность = изменение результата всех затронутых игр, а не количество исходящих кликов или красивый экран «Наши игры». **HOLD / NO PROMOTION** может быть правильным результатом.

## 0. Не дублируем завершённые исследования и не строим SDK

Связанные существующие материалы:
- [Organic Discovery & Launch](../store-presence/ORGANIC_DISCOVERY_LAUNCH_2026-11-11.md): поиск/внутренние рекомендации/первичные каналы. Здесь — **только собственная аудитория как возможный источник новой игры**.
- [Game Economics & Revenue](../game-economics/README.md): реальные paid impressions, accrual vs payout, opportunity cost and marginal decision. Здесь — **портфельная инкрементальная ценность**, а не общая рекламная экономика.
- [Audience & Game-Market Fit](../game-market-fit/README.md): ситуация, потребность, реальная причина попробовать/добавить альтернативу; не все любители puzzle одинаковы.
- [FTUE](../puzzle-design/FTUE_DIAGNOSTIC_PROTOCOL_2026-11-12.md): первая сессия самостоятельная, без лишнего отвлечения.
- [Hidden Friction & Monetization](../puzzle-design/research/hidden-friction-monetization-psychology-puzzle-games-2026-11-11.md): interruptions, respectful ads and recovery.
- [Independent Audit](INDEPENDENT_AUDIT_2026-11-12.md), [Cross-Promo Decision Brief](CROSS_PROMO_DECISION_BRIEF_TEMPLATE.md): научные ограничения, конкретный consumer-кейс.

**Non-goals:** общий CrossPromoSDK, exchange tracking identifiers, remote catalog, shared account, общая игровая валюта/прогресс, ad waterfall, push-промо, auto-open другого приложения, referral rewards, массовая интеграция во все игры и старт платных рекламных кампаний.

## 1. Научное основание и его реальные границы

| Первичный источник | Что известно | Чего нельзя выводить |
| --- | --- | --- |
| [Débordès, Caporossi & Larocque, Journal of Marketing Analytics 2021](https://ideas.repec.org/a/pal/jmarka/v9y2021i3d10.1057_s41270-021-00122-x.html) | Более 50 млн ads в 8 играх Gameloft, более 139 тыс. показов сопровождались install другой игры того же издателя. После propensity-score matching среди перешедших ожидаемая IAP-выручка **исходной** игры на 20.66% ниже. | Это **наблюдательная** корректировка, не RCT; речь об IAP и исходной игре, не causal портфельный profit impact для наших ad-funded пазлов. Нельзя использовать 20.66% как модельную константу |
| [Haenlein, Libai & Muller, International Journal of Research in Marketing 2023](https://www.sciencedirect.com/science/article/pii/S0167811622000829) | Экономическая модель cross-promo при насыщении интереса; авторы также приводят эмпирическую иллюстрацию девяти последовательных игр одного крупного издателя. Cross-promotion выступает фильтром предпочтений и возможным новым источником вовлечения. | Модельные оптимумы и мотивирующий кейс не подтверждают универсальный «момент ухода», доход наших игр или обязательную пользу internal links |
| [Abbaraju, Kettinger & Li, SAIS 2026](https://aisel.aisnet.org/sais2026/19/) | На longitudinal data top iOS game apps эффективность cross-promo связана с performance приложения-источника и overlap аудиторий; наблюдаемая связь отличается для растущих и снижающихся приложений. | Нельзя автоматически причинно заключить, что «слабая игра — лучшее место рекламы», либо переносить iOS top-game результаты на RuStore и наш малый N |
| [Ju, Zhao & Aral, MIT Sloan SSRN 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5226311) | Большой **paid advertising shutoff** experiment одного US publisher показал положительное spillover paid display на organic installs. | Это не house/cross-promotion experiment; обнаруженный spillover и +7.5% нельзя использовать как эффект наших бесплатных внутренних ссылок |
| [Egliston, Hardwick & Carter, 2026](https://journals.sagepub.com/doi/10.1177/29768624261449889) | Анализ 100 playable ads описывает attention tactics, часто спорные этически | Это критический qualitative обзор, а не uplift conversion; поддерживает отказ от deceptive mini-games и pressure/prompt interruptions |

**Консервативный вывод:** cross-promo существует как работающий канал у больших издателей и способен создавать установки, но может снижать доход исходной игры и вовсе не иметь положительного **портфельного** инкрементального эффекта. Без своих наблюдений не объявлять канал эффективным.

## 2. Четыре разных механизма, которые часто называют одним cross-promo

1. **Developer/store page discovery:** издатель поддерживает заполненную и честную developer page; пользователь сам её находит. Не требует изменения UI игры, не гарантирует приток новых пользователей.
2. **Voluntary in-game recommendation:** после завершённого эпизода или в не мешающем месте меню один ясный переход к *публично доступной* другой игре по релевантной причине. Это cross-promo в узком смысле, требует контент-политики и QA возврата.
3. **Paid/mediated house ads:** собственная игра как рекламируемый товар через сеть или ad mediation; слот может замещать оплачиваемый inventory и иметь opportunity cost. Требует отдельного договора/аналитики, не автоматическая бесплатная конверсия.
4. **Platform-native recommendation:** поиск/похожие игры/полки самого магазина/Яндекс Игр, которые мы прямо не контролируем; не присваивать их установки собственным in-game рекомендациям.

**По умолчанию:** сначала путь 1, при подтвержденном полезном контексте и трафике попробовать путь 2, пути 3/4 не считать собственной платформой рекламной сети. Никакой ссылки в игре, если destination ещё debug/не опубликован, не доступен аудитории или ведет в другой непригодный магазин.

## 3. Разные платформы — разные разрешённые переходы

| Surface | Подтвержденный текущий метод | Ограничения и запреты |
| --- | --- | --- |
| **Yandex Games web** | [SDK GamesAPI.getAllGames() / getGameByID()](https://yandex.ru/dev/games/doc/ru/sdk/sdk-other-games) возвращает доступные на текущем домене/устройстве ваши игры, адреса и картинки. [Rule 8.4.1](https://yandex.ru/dev/games/doc/ru/requirements/8/4/1): интегрировать через SDK, только в меню/между уровнями, сохранить текущую вкладку, ясная навигация. Debug Panel имеет Game links mock для QA. | [Requirements](https://yandex.ru/dev/games/doc/ru/concepts/requirements): внешние магазины, web и переходы к сторонним играм запрещены; на TV специально **запрещены ссылки на другие игры самого разработчика**. Не применять одну ссылку к mobile/web/TV без platform gating |
| **RuStore Android** | [RuStore official deeplinks](https://www.rustore.ru/help/en/sdk/rustore-deeplinks): карточка приложения через официальный HTTPS или deeplink по packageName; есть developer screen начиная с RuStore 1.36, с собственным developer ID. HTTPS карточки имеет web fallback. [RuStore Console statistics](https://www.rustore.ru/developer/blog/statistika-v-konsoli-rustore-kak-analizirovat-prosmotry-ustanovki-i-istochniki-trafika) поддерживает размеченные UTM внешние источники. | [App requirements](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/requirement-apps): реклама отделена от интерфейса, нет недекларированных SDK; метаданные не должны рекламировать внешние store links. **Не обобщать ограничение метаданных как запрет любой in-app ссылки**. Формат собственного promo/разметку проверять при конкретной публикации |
| **Google Play Android** | [Official listing/developer page links](https://developer.android.com/distribute/marketing-tools/linking-to-google-play); [Install Referrer API](https://developer.android.com/google/play/installreferrer) работает с Google Play Store, отдельно от RuStore; [Play Console UTM reporting](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en) имеет source/campaign. | [Play App Promotion](https://support.google.com/googleplay/android-developer/answer/9899004?hl=en) запрещает deceptive/forced redirects, unsolicited installs and disguised promotions. Kids/unknown-age apps должны соблюдать [Families Ads policy](https://support.google.com/googleplay/android-developer/answer/18265346?hl=en) в том числе для cross-promo. В July 2026 Store Listing Performance считает unique **click intent**, не успешные acquisitions |
| **App Store/iOS** | Допустимая developer page / app links/offer по правилам iOS и App Store; **только при реальной iOS-цели** | Не тратить Android-first время на iOS creatives, deep links и аналитические integration без намерения публиковать там игру |

**Правила условий преобладают над красивым UX:** не подставлять сырые внешние URL в Яндекс Игры вместо SDK; не открывать Android store page в Yandex Games; не использовать RuStore deeplink на устройстве без возможного fallback; не добавлять авто-открытие при запуске/победе и не рисовать fake store UI.

## 4. Portfolio audience fit — проверяем пару origin → destination, а не один общий список

Для каждого направления рекомендаций отдельно записать:
- **Origin:** действительно опубликованная игра с наблюдаемой живой аудиторией, источник/устройство/география и preferred gameplay episode.
- **Destination:** реально опубликованная, совместимая по платформе/языку/возрасту/устройству, честно представленная игра.
- **Occasion/job:** что человек только что сделал и в каком настроении возможно захочет другой тип игры. Не знать эмоцию по времени/score.
- **Reason to add or switch:** не обязательно бросить текущую игру; можно добавить игру для другой ситуации, другой формы напряжения или коллекции. Но **нужна** настоящая различимая ценность.
- **Consent and continuation:** рекомендации видимы, но не мешают следовать текущей игре, сохраняться/отказываться/переходить. Отказ не штрафуется, повторный навязчивый показ не допускается.
- **Evidence:** минимум человеческая/реальная аудитория, не вымышленная 45-летняя persona и не бот-партии.

**Кандидатные, НЕ подтвержденные пользовательскими исследованиями пары:**
- Arrows → Road Lines: пространственная причинность, но может отличаться эстетическое ожидание и степень абстракции;
- Seeds Bits → Water Sort: спокойное расчистить/упорядочить, но Number Match не равно жидкостной сортировке и длинная партия не равна короткому уровню;
- Block Puzzle → Arrows: удовольствие от тактильного поля и постепенного освобождения, но игры сильно отличаются core control;
- Association Solitaire → Seeds Bits: короткая когнитивная задача, но семантика vs цифры может означать совершенно другую аудиторию.

Пары не должны автоматически становиться рекламными показами. Все шесть игр пока не имеют подтвержденных в этой работе live audience/source + target attribution + monetary uplift. Выбирать пару только после проверки status/geo/human preference.

## 5. Placement gate: в каком месте допустима рекомендация

**Лучший первый кандидат для проверки:** отдельная спокойная рекомендация в главном меню или на экране **уже сохранённого** результата, без принудительного modal и без замены Next/Continue. Для long endless classic — только после сознательного выхода/окончания партии, а не во время drag, решения и накопления приёма.

**Категорически не начинать с:**
- первого запуска, onboarding и первого самостоятельного успеха (пока не подтверждено, что не вредно);
- активного puzzle, точки принятия решения, рекламной загрузки/возврата, состояния с pending save/reward;
- overlay, перекрывающего Next, Hint/Undo, Restart или системную Back;
- повторного «попробуй нашу игру», если пользователь уже отказался или продолжает текущую;
- авто-открытия или обманного изображения чужого app-UI;
- обязательного просмотра ради награды, нереальных бонусов между играми, fake scarcity и таймеров.

**Opportunity cost:** если recommendation занимает рекламное место, которое могло принести оплату, учитывать упущенный publisher revenue; если занимает полезное место интерфейса, учитывать прерванное действие и возможное ухудшение source retention. Даже бесплатная карточка стоит места/времени и QA.

## 6. Измерение: правильные уровни доказательств

Одна цепочка, **разные знаменатели**:

| Этап | Пример фактического события | Что доказывает и что НЕ доказывает |
| --- | --- | --- |
| Eligible user/session | В source возникла заранее определенная безопасная граница | Сколько людей могли увидеть рекомендацию; не показывает impression |
| Offer actually visible | Один видимый карточный offer; не скрытый DOM | Exposure в нашей игре; не store visit |
| User explicit tap | Игрок коснулся конкретной карточки | Intent перейти; не успешное открытие магазина |
| OS/store navigation accepted | Вызван и принят соответствующий переход без ошибки | Handoff; не факт посещения страницы и не установка |
| Store listing visit / install click | Отчёт RuStore/Google Play с UTM при доступности | Отношение к настоящему store contact/click intent; не completed acquisition |
| Completed acquisition / new install | Отдельная store statistic, когда доступна | Установка; не фактическое игровое действие |
| First meaningful action in destination | Принятое реальное действие по SDK/gameplay, только consentful source attribution | Начало ценностного эпизода; не D1/D7 |
| Return / earned portfolio contribution | Зрелые когорты, network publisher revenue and actual financial/maintenance | Можно оценивать постфактум; attribution не равно causality |

**Системная ловушка Google Play 2026:** [Store Listing Performance](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en) после July 2026 считает уникальные клики Install/Open/Pre-register, не реальный install. У RuStore UTM показывает traffic channel для ссылки, но её числовой исход также нужно сверять с фактическими установками. Яндекс Игры SDK game links даёт корректный выход, не автоматическую установку другой игры.

**Словарь privacy:** не собирать список установленных приложений, рекламный идентификатор, device fingerprint, IP/геолокацию, user ID из других игр или сетевые cross-app identity graph только ради promo. Там, где конкретный store attribution честно не даёт связи одного source player с одним destination player, писать **UNKNOWN**, а не пытаться догадаться по совпадению времени. Агрегатные source campaign URL + обычные SDK dashboards часто достаточны для пилота. Встроенный Google Install Referrer — **Play-only**, не универсальный API для RuStore.

## 7. Правильная целевая функция — весь портфель

**Ошибочный KPI:** много кликов из игры A в игру B.
**Другой ошибочный KPI:** все внешне атрибутированные установки B считать инкрементальными.

**Вопрос:** что изменилось бы, если бы таким же игрокам A не показали рекомендацию?

При достаточно большом трафике и правильном эксперименте:
- ΔA = изменение дохода/активных дней/удовольствия у игроков origin A;
- ΔB = инкрементальные качественные действия/выручка destination B, не все «последние клики»;
- Δother = влияние на остальные игры, если измеримо (в большинстве малых случаев UNKNOWN);
- OpportunityCost = вытесненные реальные платные impressions, часы production/QA, maintenance и пользовательское трение.

**PortfolioNetIncrement_T = Δ(A contribution_T + B contribution_T + other known contribution_T) − incremental cash/time cost_T**, на одном горизонте, валюте и сопоставимой population. Не суммировать LTV и месячную выручку с разными denominators. Варианты RCT с перекрёстным измерением пользователей требуют privacy/compliance проверки; при невозможности измерить ΔB полностью не выдавать частичный uplift за доказанный net profit.

**Интерпретация:** снижение source game IAP, найденное в Gameloft-study, ещё не показывает уменьшение **портфельного** дохода: destination game может компенсировать. Но и новая установка не показывает, что это случилось.

## 8. Самый дешёвый эксперимент — не сразу RCT

### Phase 0. Stop gate

Нет исходной аудитории или destination не опубликован → HOLD. Нет разумного контекста и допустимого перехода → REJECT. Нет real target ownership/page/SDK status → не готово.

### Phase 1. No-code / почти безрисковая готовность

Проверить оформленную **developer page** в RuStore/Play/Yandex Games, актуальные store страницы, package/ID, доступность на телефоне. Никаких изменений игровых экранов. Если у разработчика нет как минимум двух публичных игр в одной экосистеме, пилот in-game promo не имеет предмета.

### Phase 2. Условный минимальный UI-тест

Только если один origin действительно имеет живую аудиторию и есть совместимый destination: одна unobtrusive карточка в меню или после завершенного эпизода, краткая правда о другой игре, явный optional action. В source без выделенного promo placement не вытеснять Next/Continue. Небольшой human playtest может выявить обман ожиданий/нечитаемость/раздражение, но **не доказывает эффективность канала**.

### Phase 3. Прозрачная идентификация контактов

По возможности UTM-marked store URL / platform-owned game links. Короткий event словарь eligible, offer_visible, explicit_tap, navigation_error, source_return; в destination только реальные first meaningful actions по разрешенным analytics controls. Не создавать новый shared SDK для одной пары игр.

### Phase 4. RCT только при достаточном N

- Единица рандомизации — независимый eligible origin player / device в пределах публичной законной политики privacy, assignment стабильный на время выбранного горизонта; не рандомизировать каждую карточку в одной сессии как независимый N.
- Контроль: обычный контент без рекомендации. Treatment: идентичная игра и только одно добровольное предложение. Не менять одновременно gameplay, ads, rewards, store listing или offer timing.
- Основной outcome заранее: incremental qualified destination first plays per eligible source player (если надежно измеримы). **Guardrails:** source next action, active time/retention, paid ad opportunities/revenue, complaints, crash, save/lifecycle, target onboarding.
- Анализ по назначению (intention-to-treat), а не только по кликнувшим; low-volume groups/seed/campaign/source transparency.
- Портфельная экономическая интерпретация — отдельный этап при доступе к обоим финансовым stream. Если linked destination attribution нет, первичный outcome должен быть скромнее (click / store contact) и net impact **не доказан**.

Плейтест «3–5 человек на исправление UX» и рандомизированное измерение conversion uplift — разные методы. Никаких выдуманных обязательных 500/1000 DAU: feasibility зависит от исходного rate, MDE и горизонта. Малая выборка → честный HOLD, не p-hacking.

## 9. Runtime architecture: если когда-нибудь действительно понадобилось

**Первый уровень:** одна статическая проверенная ссылка/кнопка в конкретной игре, platform-compatible fallback; feature off by default в сборках без поддержанного destination.

**Яндекс web:** SDK GamesAPI + isAvailable, links only on allowed platform, no TV. Не копировать raw external URL или Android package. Использовать SDK mock в debug для QA.

**Android/RuStore:** официальный HTTPS URL магазина или developer page; OS standard explicit intent, handle no-store/browser fallback, no autoinstall. Проверить на реальном телефоне не только Chrome, но и системное Back/resume/сетевой отказ.

**Google Play:** официальный Play listing/developer URL, optional UTM when appropriate, official Play Install Referrer only if needed on **Play-distributed** destination and privacy accepted. Не гарантировать installation attribution from outgoing tap.

**Never by default:** сервер рекомендаций, user profile transfer, cross-game entitlement, shared DB/session, external notifications/marketing consent, multiple SDKs/mediation, per-user psychological segmentation.

**Integration test:** target not installed/installed, wrong country, offline, no store, cancelled intent, rotation, app background/process-kill, ad in progress, pending save, resumed game state intact. Если cost/complexity exceeds one useful pilot — HOLD.

## 10. Наши шесть игр — факты и ограниченные гипотезы

| Игра | Текущее документированное состояние и граница | Что можно исследовать, НЕ внедрять автоматически |
| --- | --- | --- |
| Seeds Bits | Исходный README/STATUS содержал ложное «опубликовано»; владелец 11.11.2026 подтвердил, что даже не отправлено в RuStore; опубликованные store URL/реальные активные пользователи в данном исследовании не подтверждены | Если публична, позднее посмотреть спокойную Number Match → Water Sort, но не прерывать Classic |
| Arrows | По [handoff](https://github.com/DanilaH/arrows/blob/main/docs/HANDOFF.md) 0.17.x test APK, RuStore/live acceptance ещё открыты | Возможно пространственные Arrows → Road Lines; user intent не подтверждён |
| Road Lines | Production release candidate проверялся технически; submission/status пользователя и публичное доступное приложение требуют отдельного подтверждения | Может быть origin или destination, когда подтверждены store URL и DAU |
| Water Sort | В README 0.53 debug с demo ads и pending release | Локальное предпочтение спокойного упорядочивания/другой puzzle, после уровня |
| Association Solitaire | 0.9.x Android/test; нет подтвержденной публичной audience в docs | Не выводить что любители word cards хотят number match |
| Block Puzzle | main старее рабочей feature branch; preview0.63/director-v2, D74–D77 не приняты | Не смешивать пересмотр core mechanics с маркетинговой вставкой или увеличением рекламных показов |

**План портфеля:** сначала одно подтвержденное публичное приложение, затем второе в том же магазине/на том же устройстве, затем одну добровольную ограниченную пару. Нет доказанного incremental effect → не копировать по всем шести.

## 11. Подробный checklist принятия решения

1. Source release, destination release и платёжная/географическая eligibility независимы и доказаны актуальными store pages.
2. Нам известен **реальный** источник аудитории A и есть повод предполагать fit B; не цитировать другие игры как подтверждение.
3. На целевом host разрешены in-game links. Yandex Games только через SDK и не TV; Android ссылки соответствуют требованиям конкретного стора.
4. UX безопасен: разрешённая точка, no auto redirect, no current-level interruption, user can dismiss or decline, save first.
5. Сформирован минимальный source→destination tracking contract без незаконного/лишнего cross-app профилирования.
6. Вариант «никакой промо» сравнивается с альтернативами, включая developer page and no-code listing work.
7. Приняты contribution + retention guardrails для **origin** и **destination** на едином горизонте, без двойного счёта installs/earnings.
8. Оценены production + QA + updates + duplicate geo/store configs. Счётчик кода и число приложений — не benefit.
9. Результат: PROVE PUBLIC STATUS / PROVE LIVE AUDIENCE / PILOT SINGLE PAIR / RUN ELIGIBLE TEST / HOLD / REJECT / NO CHANGE.
10. В следующем проходе пересмотреть текущую редакцию policy/SDK и реальные приложения. Нет доказанных игроков → **не внедрять**.

**Условие завершения этой методологии:** агент сможет на основании фактов отказаться от ненужного promo SDK, назвать конкретную совместимую пару и событие, где она действительно может быть полезна, либо корректно провести небольшой source-level test, который не выдаёт клики за инкрементальный доход. Не количество карточек «Другие игры» и не автоматический рост DAU.
