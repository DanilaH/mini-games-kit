# Independent Second-Pass Audit — Store Presence Research v1

**Дата:** 11 ноября 2026. **Предмет:** точность платформенных ограничений, научной интерпретации, продукционной методологии и границ применения. Это вторая проверка открытых источников и подготовленных документов, **не независимый эксперимент с пользователями, не проверка аккаунтов разработчика и не реальная модерация**.

## 1. Обязательные технические утверждения — источник и статус

| Заявление | Основание | Аудит |
| --- | --- | --- |
| RuStore имя до 30 | [Как опубликовать](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/app-publication) | **VERIFIED, CONFLICT**: другая [ASO-страница](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/aso-recommendations) говорит 50; консервативно 30 до осмотра консоли |
| RuStore short80, full4000, tags≤5 | Публикационный маршрут | **VERIFIED** для основной формы |
| RuStore icon 512×512 PNG/JPG ≤3MB non-transparent edges | Публикационный маршрут | **VERIFIED** |
| RuStore min3 screenshots per selected device | Публикационный маршрут: предупреждение после выбора типов устройств | **VERIFIED**; «1–10 при добавлении» — upload batch, не доказательство допустимости одного кадра |
| RuStore phone ≤3MB, tablet ≤5MB, 2160×3840 max | Публикационный маршрут | **VERIFIED** |
| RuStore рекомендует 16:9, при portrait можно выбрать ориентацию | Публикационный маршрут | **CONFLICT/CROP RISK**: рекомендация 16:9 и выбор вертикальности требуют console preview; не запрещать портрет |
| RuStore custom 35 pages; portrait 9:16 recommended | [Custom pages](https://www.rustore.ru/help/developers/advertising-and-promotion/custom-pages) | **VERIFIED, SCOPE-LIMITED**: не переносить на main |
| RuStore A/B changes screenshots/video/text but icon not listed | [A/B experiments](https://www.rustore.ru/help/developers/advertising-and-promotion/a-b-experiments) | **VERIFIED LIST**: отсутствие иконки в текущих полях, не утверждать навечно |
| Google Play name30, short80, full4000 | [Play app setup](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en) | **VERIFIED** |
| Google Play icon 512PNG32 ≤1024KB | [Preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en-en) | **VERIFIED** |
| Google Play feature1024×500 no alpha; mandatory | Preview assets | **VERIFIED** |
| Google Play screenshots ≥2, 320–3840 px and 2:1 max dimension ratio | Preview assets | **VERIFIED REQUIRED** |
| Google Play ≥3 landscape/portrait screenshots for specific recommendations | Preview assets | **VERIFIED CONDITIONAL PROMOTION**, не смешивать с минимумом публикации |
| Apple name30, subtitle30, keyword100 bytes, description4000, promo170 | [App info](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information), [version metadata](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information) | **VERIFIED**; bytes ≠ characters |
| Apple 1–10 screenshots; exact device sizes; no alpha | [Screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications) | **VERIFIED, DEVICE-DEPENDENT**; не универсальный 1080×1920 |
| Apple >half screenshots real in-app use | [2.3.3](https://developer.apple.com/help/app-review/guideline-reference/2-3-3-screenshots) | **VERIFIED**; overlays разрешены, маркетинговые artwork только в меньшинстве |
| Apple CPP≤70, PPO≤3 alternatives, PPO not CPP | [CPP](https://developer.apple.com/app-store/custom-product-pages/), [PPO](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/overview-of-product-page-optimization/) | **VERIFIED, CHANNEL DIFFERENCE** |
| Yandex icon512PNG, cover800×470PNG, mobile 9:16, desktop 16:9 | [Draft](https://yandex.com/dev/games/doc/en/console/add-new-game/draft) | **VERIFIED** |
| Yandex 2 screenshots per selected mobile/desktop, long side1280–2560 | Draft | **VERIFIED** |
| Yandex ≥70% actual gameplay screenshot | [Requirements](https://yandex.com/dev/games/doc/en/requirements/5/1/1/2) | **VERIFIED WITH EXCEPTION** for materials effectively demonstrating mechanics; apply conservatively |
| Yandex title50, desc100–1000, how-to-play100–1000, short70, SEO50–160 | Draft | **VERIFIED**; некоторые fields optional, exact draft form rules win |
| Yandex icons/cover A/B 50/50, published only, ≥7 days recommended, max14 | [Icon A/B](https://yandex.com/dev/games/doc/en/concepts/ab-test) | **VERIFIED** |

## 2. Независимая проверка эмпирических утверждений

- Иконки и эстетика *могут* влиять на восприятие/поведение: поля наблюдательных данных и лабораторные оценки. **Не доказано**, что «красный увеличивает CTR», «маскот повышает D7», «меньше текста всегда лучше» или «видео всем нужно». [Icon appearance](https://research.polyu.edu.hk/en/publications/effects-of-the-aesthetic-design-of-icons-on-app-downloads-evidenc/) · [Visual metaphor](https://doi.org/10.1177/2050157916639348) · [Jylhä/Hamari](https://www.sciencedirect.com/science/article/pii/S1071581918301794).
- В исследованиях других ниш (transportation apps, educational apps, smartphone home-screen icon search) есть проблемы **external validity** для наших небольших головоломок; в тексте они названы как источники гипотез, не нормативы.
- [Apple PPO cases](https://developer.apple.com/app-store/product-page-optimization/) подтверждают существование как положительных, так и отрицательных результатов отдельных креативов; выборка кейсов **селективная и коммерческая**, нельзя считать её распределением эффектов.
- Мы **не проверяли** реальные A/B outcomes или product-page metrics своих приложений в этом ходе, и не имеем доказательства прироста conversion, installs, retention или revenue от предложенных композиций.

## 3. Найденные противоречия и исправления

**A. RuStore 30 / 50 символов.** До проверки UI консоли использовать 30 из публикационного маршрута. Нельзя уверенно говорить «название может быть до 50» всем агентам.

**B. RuStore 1–10 vs минимум 3 скриншота.** Пользователь может добавлять до 10 файлов за раз, но документация содержит предупреждение о минимуме 3 на тип. Отчёт не должен утверждать, что для публикации достаточно одного.

**C. RuStore 16:9 vs portrait custom 9:16.** Разные маршруты + внутреннее напряжение общей инструкции. Решение не в запрете portrait, а в preview/crop validation и surface-aware export.

**D. Google min2 vs promo eligibility min3.** Технический минимум публикации ≠ рекомендационная пригодность. Нельзя заявлять, что менее трёх скриншотов не допустят игру вообще.

**E. Apple PPO vs custom product pages.** CPP имеют URL/keywords и целевой traffic, PPO — controlled default-page test. Нельзя обещать A/B эксперименты внутри CPP.

**F. RuStore A/B vs иконка.** Current A/B fields — тексты, кадры, видео. Кастомная страница допускает icon, но это другой инструмент; тест icon через RuStore A/B **не подтверждён**.

**G. Yandex70% не абсолютный запрет на overlays.** Есть официальное исключение; оптимальный безопасный baseline — явно ≥70% реального gameplay, без фиктивных декораций вместо механики.

**H. Store icon ≠ Android launcher icon.** Похожий символ в обеих местах не освобождает от технических требований alpha/background и проверок соответствия.

**I. Разные conversion denominators.** Магазины называют события по-разному. Сводный процент «общее CVR по всем сторам» без согласованной модели misleading.

**J. Малый трафик не оправдывает фальшивую статистику.** Qualitative tests могут выявить непонятную иконку, но не подтверждают 10% uplift; без данных — HOLD.

## 4. Полнота и границы предложенной процедуры

**Покрыто:** позиционирование, поисковые поля, поисковая/рекомендательная витрина, icon/feature/cover, storyboard, screenshot authenticity, device/locale variants, video choices, master-asset pipeline, owner gates, A/B/hypothesis, низкий production burden и handoff.

**Не покрыто как подтверждённый факт:** реальная видимость у пользователя в конкретной стране/аккаунте, актуальная проверка поля RuStore при загрузке, источник трафика конкретной игры, Play/Apple account eligibility, правила TV/Watch/XR/новых Apple devices за пределами типичных мобильных сценариев, стоимость рекламного трафика, страница конкретного издателя, конверсия будущего listing.

Эти вопросы агент должен либо проверить перед выпуском, либо пометить **UNKNOWN**; не выдумывать значения.

## 5. Повторный проход перед публикацией

1. Открыть действующую форму создания/новой версии для именно нужного store/profile.
2. Сверить поля, форматы, max byte length, orientation и crop с источниками, дата ревизии.
3. Проверить source build/commit и provenance скриншотов; «нельзя менять gameplay на картинке» без обновления приложения.
4. Открыть mobile previews и first screenshot у каждого магазина, проверить читаемость/crop.
5. Локально проверить asset formats/bytes и длины текстов; не выдавать скрипт за official acceptance.
6. Согласовать с владельцем не только дизайн, но и действия **upload / submit / publish**, каждый отдельно.
7. Не заявлять, что store passed moderation, пока не получен реальный результат.

## 6. Итоговая оценка

**Research-to-methodology пригодна для применения агентами:** все ключевые числа имеют ссылки на официальные источники и scope; рекламные и научные заявления не превращены в нормы; поддержаны RuStore-first и отсутствие ненужных full-kit integrations.

**Нерешённое / blocking для конкретного релиза:** реальные console previews и country/account availability. Таков честный предел независимой desk review.

**Изменение kit:** документация и шаблоны; runtime, gameplay, monetization и SDK не должны меняться ради методологии. Новый общий «ASO engine» не создавать без хотя бы двух подтверждённых consumers.

### Дополнение: автоматическая проверка

[Необязательный проверяльщик](tools/README.md) прошёл проверку синтаксиса и пять синтетических сценариев: три ожидаемых PASS (RuStore, Google Play, Yandex) и две ожидаемые ошибки (RuStore: меньше трёх скриншотов; Apple: UTF-8 keywords превышают 100 байт). Проверяльщик не декодирует изображения целиком, не валидирует CRC, исходные скриншоты, требования будущей версии консоли, видео или реальные crop previews. Он **не** является независимым подтверждением приёмки конкретного приложения.
