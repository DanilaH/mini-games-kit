# Independent Evidence Audit — Portfolio & Cross-Promotion

**Срез:** 12.11.2026. **Предмет:** [Portfolio & Cross-Promotion](README.md). **Второй проход:** отдельно попытаться опровергнуть пользу cross-promo, сопоставить источники противоречивых выводов, проверить фактические платформенные ограничения и честность измерений. Нет авторизованных publisher dashboards, реальных когорт или результатов controlled теста наших игр.

## 1. Действительно неудобные результаты первичной литературы

| Claim | Primary evidence | Correct verdict |
| --- | --- | --- |
| «Свои игры продвигаются друг через друга бесплатно и без ущерба» | [Débordès et al. 2021](https://ideas.repec.org/a/pal/jmarka/v9y2021i3d10.1057_s41270-021-00122-x.html): 50M+ ads в 8 Gameloft games, 139k+ correlated new installations, 20.66% **снижение expected origin IAP revenue** among matched users who installed other Gameloft game | **REJECT.** Observational + matching не randomized; нет прямого net portfolio payoff; ad-funded small puzzle ≠ IAP-heavy Gameloft |
| «Любой переход B означает потерю A» | Тот же Gameloft result + [Haenlein et al. 2023](https://www.sciencedirect.com/science/article/pii/S0167811622000829) | **REJECT**; игры могут дополнять или заменять друг друга; человеческая игра/причина зависит от контекста. Важно измерять origin и destination отдельно |
| «Есть оптимальная точка усталости, когда всегда надо показывать новую игру» | Haenlein/Libai/Muller 2023: economic cross-promotion/satiation model, эмпирический мотивирующий кейс 9 игр, не тест нашего UI | **REJECT universal timer.** Модельный optimum не измеряет скуку конкретного человека. Никакого hidden boredom detector |
| «Cross-promo работает одинаково в любых играх» | [Abbaraju/Kettinger/Li SAIS 2026](https://aisel.aisnet.org/sais2026/19/): longitudinal top iOS games, performance × user overlap | **REJECT.** Изменения эффективности связаны с контекстом аудитории, но не causal prescription для конкретной пары |
| «Если продвигаем из растущей игры, это всегда лучше» | SAIS 2026 нашёл **контрзависимость**: размещения в растущих source apps оказались менее эффективными, чем в снижающихся, conditional on overlap | **REJECT.** Корреляция не даёт право ожидать тот же результат у нас; не навязывать замену игрокам |
| «Платные ads дали дополнительный organic spillover, значит house links дадут +7.5%» | [Ju/Zhao/Aral SSRN 2025](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5226311): масштабный paid-display spending shutoff case с US mobile publisher, organic spillover | **REJECT TRANSFER**. Другая intervention, канал и финансирование; число не применять |
| «Чем интерактивнее/навязчивее playable реклама, тем полезнее игроку» | [Egliston et al. 2026](https://journals.sagepub.com/doi/10.1177/29768624261449889): qualitative 100 playable ads, обсуждение affective manipulation | **REJECT.** Работа критическая, не оптимизационная; не создавать fake playable или другую игру внутри текущей |

## 2. Важнейший платформенный результат: ссылки неодинаковы

| Система | Проверенный пункт | Нельзя |
| --- | --- | --- |
| **Яндекс Игры web** | [SDK GamesAPI](https://yandex.ru/dev/games/doc/ru/sdk/sdk-other-games) выдает доступные свои игры. [8.4.1](https://yandex.ru/dev/games/doc/ru/requirements/8/4/1): SDK links, только вне активного gameplay, текущая вкладка не закрывается, понятное назначение | Raw external/store URLs, переходы к сторонним ресурсам, auto redirect, подмена SDK собственным каталогом href |
| **Яндекс Игры TV** | [Current game requirements 1.6.3.5](https://yandex.ru/dev/games/doc/ru/concepts/requirements): **нет ссылок даже на свои другие игры** | Не выводить Game Links UI на TV, даже если SDK даёт какие-то данные |
| **RuStore** | [Official deeplinks](https://www.rustore.ru/help/en/sdk/rustore-deeplinks) — app card, developer page, HTTPS fallback, developer deeplink from version 1.36. [Official stats](https://www.rustore.ru/developer/blog/statistika-v-konsoli-rustore-kak-analizirovat-prosmotry-ustanovki-i-istochniki-trafika) — UTM внешние площадки | Не выдумывать rustore:// URL. Store page metadata restrictions **не** равны однозначному blanket-ban на in-game own promos; конкретный UI должен удовлетворять рекламе/модерации |
| **Google Play** | [Linking to Play](https://developer.android.com/distribute/marketing-tools/linking-to-google-play) documented listing/developer page; [App Promotion policy](https://support.google.com/googleplay/android-developer/answer/9899004?hl=en) запрещает misleading redirect; [Families](https://support.google.com/googleplay/android-developer/answer/18265346?hl=en) распространяет ad requirements на cross-promo | Auto install, fake dismiss, deceptive badge, exploitative reward, children-targeting without compliance |
| **Google Play attribution** | [Play Install Referrer](https://developer.android.com/google/play/installreferrer) доступен только через Google Play Store app; [Play Store Listing Performance July 2026](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en): user intent clicks вместо acquisitions | Приписывать RuStore установку Play-only referrer API, считать Play Install Click completed install |
| **Разные источники** | Android WebView, RuStore, Google Play, Yandex Games SDK have separate host semantics | Общий сырой URL и единый адаптер без проверенного platform policy/compatibility |

## 3. Девять причин, почему красивый результат окажется ложным

1. **No real origin traffic.** Баннер размещён, но живых пользователей нет. Это не эксперимент, а добавленное UI-трение.
2. **Destination not public.** Игра B в debug, private testing или недоступна в стране A; переход не создаёт install. Маленький N не решает юридический/технический запрет.
3. **Wrong audience.** У игроков A и B лишь общая метка «пазл»; желаемые переживания и устройства различаются. Причина выбрать B не подтверждена.
4. **Disguised promotion.** «Награда», «Ещё уровень» или системное уведомление на деле открывают магазин; нарушает доверие и правила.
5. **Attribution false positives.** Тап → не означает store visit; UTM install/click → не обязательно новый пользователь; referral attribution → не причинная добавочная установка. Пользователь мог установить B и без предложения.
6. **Source cannibalization.** Игрок B активируется, но source A теряет игровые дни, earned IAP/ad revenue или довольное завершение. Одни destination показатели скрывают потерю.
7. **Inventory opportunity cost.** House card размещена на месте реального платного ad, либо вытесняет кнопку продолжения. «Реклама своих игр бесплатная» — ложное описание стоимости.
8. **Source selection/survivorship bias.** «Показали после 50 уровня», сравнили с новичками без карточки: группа показов уже пережила другой retention. Нужен eligible control и фиксированный horizon.
9. **Cross-app identity/SDK burden.** Добавляют device fingerprint или общий ID ради связывания source→target, получают privacy risk, новые consent/SDK/QA обязательства без доказанного uplift.

## 4. Второе независимое опровержение: transfer ≠ total creation

Даже если переход A→B подтверждён, это не доказательство **дополнительного пользователя для портфеля**:
- **Substitution:** пользователь тратит те же минуты на B вместо A.
- **Complementarity:** B добавляется к A в другие дни/настроения, общее число активных дней может вырасти.
- **Natural discovery:** игрок планировал установить B без A, recommendation только получил last click.
- **Market reach:** пользователь раньше не слышал о B и действительно получил новый полезный вариант.
- **Reward/pressured traffic:** установка под вознаграждение не означает даже добровольное начало игры.

Каждый случай совместим с одинаковым «ссылка → установка». Нужно учитывать обе игры, желание продолжать, доход/трудозатраты и отдельные causality claims. Если невозможно верифицировать инкрементальность — заключение ограничить «store traffic observed, net gain UNKNOWN».

## 5. Сильная причина НЕ начинать сразу с UI

Официальные RuStore и Play поддерживают **страницу разработчика** с каталогом игр, а Яндекс SDK возвращает корректную developerURL. Для этого во многих случаях не нужно изменять интерфейс игры.

Если нет публичной аудитории, нет второй релизной игры или destination не совместим — убедительный результат аудита «ничего не внедрять». Следующий лучший ход может быть реальный релиз/analytics одного приложения, а не third-party feature. Если публичная аудитория позже появится, сначала проверить собственные store pages и лишь затем выбирать одну unobtrusive карточку.

**Противоположный контрпример:** без явного in-game рекомендации developer page сама по себе может быть мало заметной. Этот путь не гарантирует трафика. Это просто дешёвый возможный baseline без ущерба gameplay.

## 6. Экспериментальный стандарт, если достигнуты gates

### Не A/B «кликнувшие против некликнувших»

Кликнувшие уже отличаются по интересу/усталости. Рандомизация на стабильном уровне eligible origin player/device (по privacy policy), контроль без предложения, treatment с одним добровольным предложением. Анализ **intention-to-treat**, единица наблюдения — человек/устройство, не каждая рекламная карточка. По возможности pre-register one primary metric and guardrails, N/power, success/stop.

### Две независимые части

- **Source-level randomized test:** нужен ли offer как продуктовый элемент? outcome: осознанные клики/возврат к игре/неизменность доверия и настоящих ad opportunities.
- **Target and portfolio measurement:** качественные новые игровые акты в destination, истинная атрибуция по store/network когда доступна, зрелая когорта, источники денег, future cost. Нужны сопоставимые/aggregate credible estimates, а не обязательно совместный cross-app ID. Когда нет достаточной связи, **нет** честного вывода total portfolio causal ROI.

### Какие выводы разрешены по evidence ladder

| Evidence | Допустимый результат | Не допустимый |
| --- | --- | --- |
| APK/browser QA | Переход работает, source save preserved, UI readable | «Растут установки/ретеншен» |
| 3–5 human playtest | На конкретных устройствах люди понимают, куда ведёт кнопка и не раздражаются | Общая доля переходов и статистически значимый прирост |
| Source dashboard | Количество visible/tapped/intent в определенном eligible окне | Completed destination installs |
| Store UTM data | Сопоставимый store visits/install intent/иногда acquisitions | Causal incremental installs и выручка |
| Target gameplay telemetry | Реальные first meaningful actions в destination при корректной consent/attribution | Приписывать любому действию происхождение из A |
| Randomized eligible control with adequate N | При выполнении требований causal эффект по заранее измеримому source outcome | Автоматическая причинность по всем другим store/network данным |
| Financial ledger across games | Совокупный учтенный доход по фактическим выпискам | Контрфактическая выгода без control/valid causal modeling |

## 7. Переоценка технологического решения

**Простая ссылка vs новый kit component:** на старте однозначно favor простой, разрешённый и проверяемый host-specific link. Если действительно два или более **реальных** consumer повторяют одну конкретную ошибкоустойчивую реализацию, можно выделить наименьший общий механизм. Не generalize разные Yandex SDK/GamesAPI и RuStore HTTPS into same raw navigation primitive без host gating.

**Не вводить shared identity:** никогда не пересылать пользовательские gameId/save/advertising ID из игры A в B без отдельного легального обоснования, явного смысла для пользователя и privacy review.

**Не превращать кросс-промо в скрытый rewarded placement:** не заменять коммерчески доказанную рекламу имитацией награды, не платить внутриигровыми монетами за чужую установку, не показывать overlay на каждом уровне.

**Не переносить обязательность:** если вообще нет двух опубликованных совместимых игр в одной экосистеме, заполнять шаблон необязательно. Исследование закрывается HOLD.

## 8. Актуальные неизвестные

- Реальные публичные store URLs наших шести игр; README и handoffs могут отставать. У Seeds прошлый статус в источниках противоречив, фактический публичный RuStore проверять в магазине и аккаунте.
- DAU/MAU по source app и географии, откуда пришли реальные пользователи.
- Audience overlap, настроение, реальный reason-to-add и предпочтение между парой игр.
- Истинное количество target first plays, retention, ad revenue и возможное снижение source engagement после promo.
- Достаточность sample для RCT, стоимость инфраструктуры и QA.
- Применимые детали рекламного декларирования/маркировки in-app house ad в конкретной российской юрисдикции; уточнять перед реализацией.
- Фактический статус новых публикаций в Яндекс Играх, и на каких устройствах работает выбранная игра.
- Юридическая и техническая доступность намеренного кросс-платформенного перехода; Yandex Games outbound запрещены, другие платформы проверять отдельно.

**Итог:** источник-ориентированный анализ показал и возможную полезность cross-promotion, и реальный риск cannibalization. В нашем портфеле сегодня самый сильный рациональный результат — **не добавлять интеграцию без подтверждённых игроков и двух совместимых опубликованных продуктов**, оставив независимую методологию, на которую сможет опереться следующий агент, когда данные появятся.
