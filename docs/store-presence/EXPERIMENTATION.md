# Store-page experiments for a small studio

**Статус:** план проверки, не утверждение, что наши игры имеют достаточный traffic, и не инструкция менять production без одобрения владельца.

## 1. Различать четыре вопроса

1. **Is it understandable?** Понимает ли потенциальный игрок жанр/ключевое действие, увидев icon и первые кадры?
2. **Is it acceptable?** Пройдёт ли материал текущие требования магазина и правда ли изображает игру?
3. **Does it convert?** Повышает ли вариант store-defined install/open/start conversion для случайно распределённой релевантной аудитории?
4. **Does it attract the right players?** Есть ли качественные первые сессии и возвраты, а не только выросший CTR?

Для 1–2 подходят небольшие qualitative сравнения, для 3–4 нужна статистика реальной аудитории. Этим ответам соответствуют **разные доказательства**, нельзя подменять одно другим.

## 2. Pre-launch: лаборатория понимания (без претензии на uplift)

- Участнику не показывать название игры заранее, если цель — first-glance понимание.
- Показывать icon среди 6–10 сравнимых релевантных игр в реальном мини-размере. Спросить «какую игру ты ожидаешь», «что, по-твоему, будешь делать?».
- Показывать первый кадр 5–10 секунд, затем попросить назвать основной жест, выигрыш и настроение. Это рабочий UX-протокол, **не научный порог**.
- Проверить comprehension отдельно от preference: «какая красивее» и «какой жанр ожидаешь» не одно и то же.
- Если сравниваются два набора, рандомизировать порядок, держать *один и тот же gameplay*, не менять одновременно название, иконку и механику.
- Отмечать конкретные ошибки: «думал, что это match-3», «ожидал сюжет», «не увидел, что поле интерактивно».
- Исправлять отчётливые misconceptions, не делать вывод, что 5 участников дают conversion rate.
- Не проводить 30 дорогих фокус-групп для простой игры без подтверждённого production ROI.

**Суть:** такие проверки позволяют улучшить ясность и честность, но не доказать рост store CVR или D7.

## 3. Post-launch: инструмент конкретного магазина

| Магазин | Что реально тестируется | Что учитывать |
| --- | --- | --- |
| **RuStore** | A/B из двух карточек: short/full descriptions, screenshots, video URL | Не обещать изменение иконки в данном типе A/B; release должен пройти модерацию; события могут дозаписываться ещё сутки |
| **Google Play** | Store listing experiments: графика/тексты в main/custom при поддержке поля | Возможен MDE/confidence; источники установки, 1-day retention, device/locale; эксперимент не пересмешивать с релизом |
| **Apple App Store** | Product Page Optimization: default icon/screenshots/previews, до трёх treatment | Приложение опубликовано (Ready for Distribution); CPP отдельно, PPO на CPP не проводится |
| **Яндекс Игры** | Иконка + cover для опубликованной игры, A/B контроль/эксперимент | Split 50/50, рекомендуется ≥7 дней, максимум 14, смотреть downstream game metrics, не менять билд в процессе |

См. официальные документы: [RuStore](https://www.rustore.ru/help/developers/advertising-and-promotion/a-b-experiments), [Google](https://support.google.com/googleplay/android-developer/answer/12053285?hl=en), [Apple](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/overview-of-product-page-optimization/), [Yandex](https://yandex.com/dev/games/doc/en/concepts/ab-test).

**Не переносить правила одного магазина на другой:** например, Яндекс split иконка+обложка не доказывает, какая часть пакета повысила результат. Если платформа позволяет — менять один компонент, а остальные держать одинаковыми.

## 4. План эксперимента перед запуском

```text
Experiment ID:
Game / version / store / locale / device / release status:
Primary hypothesis: "first screenshot X better communicates core loop than Y"
Control asset SHA and source build:
Treatment asset SHA and source build:
Randomization / platform allocation mechanism:
Primary metric (exact platform denominator):
Guardrails: post-install first-action, crash, D1 if attributed, complaints:
Traffic and MDE planning:
Duration / minimum observation / seasonality:
No concurrent change list:
Decision criteria: adopt / keep original / inconclusive:
Owner approval and rollback option:
```

**При отсутствии силы эксперимента:** не превращать его в A/B ради галочки. Если один вариант очевидно нарушает правила или плохо описывает механику, исправить его без статистики. Если обе альтернативы правдивы и трафик очень мал, выбрать дешевле/яснее и пометить результат PROVISIONAL.

## 5. Конверсия — определение строго площадки

Разные поверхности используют разные знаменатели:
- RuStore: показы/просмотры и установки из консоли, определения платформы. Клики рекламных объявлений — отдельная воронка.
- Play: unique user install clicks/open clicks и store listing conversion согласно Play Console.
- App Store: impressions, product page views, first-time downloads, product page conversion по App Analytics; нельзя подставлять Play формулу без изменений.
- Yandex Games: catalog click/CTR/real starts, новые игроки и game metrics; это web launch, не установка APK.

**Кликов может стать больше, но не ценности:** иконка с картами для шахмат повысила бы любопытство аудитории пасьянса, но неверно сформировала ожидание. Этот пример сама документация [Yandex A/B](https://yandex.com/dev/games/doc/en/concepts/ab-test) использует как предупреждение. По возможности смотреть post-click first actions, gameplay completion и mature D1/D7 cohort.

## 6. Ошибки и корректировки

- **Concurrent release confounding:** вместе с новой иконкой выпустили новую экономику и onboarding, затем приписали D1 рекламе.
- **Multiple comparisons:** протестировали 8 вариантов/локалей и выбрали случайный всплеск без корректировки.
- **P-hacking / peeking:** остановили тест после первого зелёного дня, игнорируя официальное окно.
- **Wrong sample unit:** несколько посещений страницы одним пользователем посчитали независимыми.
- **Survivorship:** изучали только успешные карточки конкурентов, не видели неуспешные с той же стилистикой.
- **Audience mismatch:** изменился источник рекламного трафика, а не привлекательность креатива.
- **Premature launch:** выдали ASO audit как подтверждённую конверсию до первой публикации.
- **Localization leakage:** перенос результатов RU пользователям EN, другой порядок слов и другой состав search terms.
- **Post hoc KPI:** сначала измеряли CTR, а после результата объявили D7 целью.

Рекомендация: заранее зафиксировать *primary outcome* и явные guardrails, не утверждать causal effect без рандомизации либо надёжного сравнения.

## 7. Решение для низкого трафика

1. Сначала **compliance/true gameplay**, исправить грубые ошибки читаемости.
2. Затем использовать сравнительные **qualitative tests**, если визуальные гипотезы различаются.
3. На реальных опубликованных магазинах задействовать собственные эксперименты при достаточных объёмах.
4. Если мощности нет — **HOLD** с зафиксированной гипотезой; не тратить недели на десятки вариантов.
5. После роста аудитории приоритетно протестировать *icon/first screenshot*, если на этой поверхности они действительно отображаются и инструмент разрешает менять их.
6. Результаты должны входить в следующий store-brief iteration, не переписывать автоматически visual identity игры.

## 8. Коммерческие компромиссы

Для рекламной игры **install CVR** не равен **долгосрочной выручке**. Разумная цель — появление **подходящих** игроков, а не кликбейт. Но без репрезентативного post-install учета нельзя уверенно говорить о revenue-per-impression новой иконки. ROI расчёты удерживать в пределах реальных данных, не приписывать магазине плавающий рекламный eCPM.

**Вывод:** тестируйте реальную гипотезу в реальном магазине, только когда изменение допустимо правилами и статистически осмысленно. До этого приоритет — честная и узнаваемая карточка.
