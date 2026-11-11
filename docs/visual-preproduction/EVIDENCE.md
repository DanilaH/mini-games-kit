# Источники, границы доказательств и проверка методологии

**Сверено:** 11 ноября 2026. Внешние документы помогают сформировать профессиональный процесс и минимальные UX-требования, но **не доказывают** конверсию, retention или доход какого-либо из наших концептов.

## I. Официальные стандарты

1. [Apple Human Interface Guidelines — Designing for Games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games/): интерактивность, читаемый текст, безопасная композиция на дисплеях, быстрый доступ к геймплею, onboarding, платформенные особенности. Приводит рекомендации по размерам элементов для iOS/iPadOS; **не Android-норма**.
2. [Apple Game Controls](https://developer.apple.com/design/human-interface-guidelines/game-controls): прямой touch input, размещение виртуальных кнопок, press-state, 44pt для основных и 28pt для менее важных контролов. Подходит как профессиональное обоснование UX решения, **не задаёт оптимальную компоновку конкретной игры**.
3. [Google Android Accessibility — touch targets](https://support.google.com/accessibility/android/answer/7101858?hl=en): ориентир минимум 48×48dp, обычно 8dp между зонами; нужно проверять реальные hit regions.
4. [Android Adaptive Layout](https://developer.android.com/design/ui/mobile/guides/layout-and-content/adapt-layout): несколько размеров и aspect ratios, структурные изменения layout, ограничения одного portrait mockup.
5. [WCAG 2.2 — Use of Color, Contrast Minimum](https://www.w3.org/TR/WCAG22/): различие помимо цвета, обычный текст 4.5:1, крупный текст 3:1.
6. [WCAG 2.2 Understanding — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast): важная визуальная информация/элементы управления 3:1.
7. [WCAG Motion from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions): поддержка уменьшения необязательного движения и отказ от несущественных motion effects; уровень критерия AAA, **не универсальная законодательная норма для игры**.

## II. Профессиональные art direction методики

8. [GDC Vault — Building a Visual Identity: An Art Direction Framework](https://www.gdcvault.com/play/1028954/Art-Direction-Summit-Building-a): художественные, творческие, технические и маркетинговые ограничения visual identity и art pillars. Страница-аннотация доклада; не выдавать её за просмотр полной лекции.
9. [Guerrilla Games' Approach to Asset Art — GDC 2016 PDF](https://media.gdcvault.com/gdc2016/Presentations/Gaag_Maarten_Guerrilla%20Games%20Approach.pdf): роль style guides и разделения идеации/производства у большой студии. **Для маленькой команды нужен существенно облегчённый процесс**.
10. [OpenGDD — Art Direction](https://opengdd.org/handbook/direction/): pillars, mood, anti-references, must-keep, viewing instructions. Полезный шаблон, не академическое доказательство успеха.
11. [The Level Design Book, art/visual pillars overview](https://teardownatlas.com/environment-art/art-direction): theme, game emphasis, style, palette, shapes; обзор на основе иных учебных материалов, не исследование retention.

## III. Сеттинг, персонажи и маскоты

12. [NOVA Game Concept Guidelines](https://novagamesfoundation.org/how-to-apply/game-concept): world/story/character, experience goals и visual touchstones — **варианты дизайн-документа**, а не обязанность добавлять сюжет.
13. [Azur Games Brand Guide — Mascot](https://azurgames.com/branding/): реальный пример того, как компания формально различает Sharkie и Junior Sharkie и задаёт роли бренд-персонажа. **Корпоративный маскот издателя не означает персонажа каждой игры**.
14. [Do humanized team mascots attract new fans? (2022)](https://doi.org/10.1080/14413523.2021.2014184): в эксперименте с 239 потенциальными поклонниками спортивной команды антропоморфный маскот увеличивал психологическую близость и намерение потреблять медиа. **Спортивный маркетинг, не мобильные пазлы; эффекты на D1/D7 или монетизацию не установлены**.
15. [Solitaire Associations Journey — App Store](https://apps.apple.com/us/app/solitaire-associations-journey/id6748950306): пример карточного ассоциативного пазла; указан продавец/разработчик Hitapps Games LTD. Отдельно отличать screenshots от реального gameplay и не приписывать приложению персонажа без проверки.
16. [Creatune — Mascot design overview](https://www.creatuneagency.com/en/blog/game-mascot-design/): силуэт в маленьком масштабе, expression sheets и использование в app icon; **коммерческий совет, не экспериментальное доказательство эффективности**.

## IV. История собственных проектов — конкретные уроки

- [Солитёр ассоциаций — CASUAL_SUBJECTS_0_9_1](https://github.com/DanilaH/asoc-solitair/blob/main/docs/art/CASUAL_SUBJECTS_0_9_1.md): 33 изображения предметов переработаны в последовательный силуэтный язык; натуральная карточка имеет около 50–65 CSS px, а не размер hero illustration. Это **свидетельство производственного дефекта несогласованных деталей, а не независимый A/B тест улучшения retention**.
- [Стрелки — UX REVIEW 0.15.0](https://github.com/DanilaH/arrows/blob/main/docs/UX_REVIEW.md): реальные проблемы компактного календаря, скрытой информации, конфликтов навигации и крупного текста; видна цена несогласованной layout системы.
- [Water Sort — DESIGN REVIEW 0.15](https://github.com/DanilaH/watery-water-sort/blob/main/docs/DESIGN_REVIEW_15.md): сравнительный обзор разных water-sort оформлений и два варианта, один из которых был выбран владельцем. Сильный прототип процесса визуального выбора, но screenshots из магазина не доказывают геймплей и субъективные выводы не доказывают uplift.
- [Blocky Block Puzzle — DECISIONS D06](https://github.com/DanilaH/blocky-block-puzzle/blob/main/docs/DECISIONS.md): уже сформулировано требование **одного цельного макета** портретного/горизонтального поля, обычного хода, комбо и результата до массовой графики. Новая методология расширяет этот шаг сеттингом, персонажем, тремя конкурентными продукт-пакетами и бюджетом ассетов.

## V. Классификация утверждений

| Тип утверждения | Пример | Как использовать |
| --- | --- | --- |
| **Установленное требование/стандарт** | Android ориентир 48dp | Инженерный UX-gate на Android |
| **Профессиональная практика** | Visual pillars + style guide + sample assets | Рабочий процесс, проверять стоимость |
| **Наблюдение из собственного проекта** | Дробные детали нечитабельны на карточках | Дизайн-риск, реальный пример, не научный закон |
| **Внешнее исследование другого контекста** | Sports mascot связан с closeness | Гипотеза о роли персонажа, не доказательство D7 |
| **Наша проектная эвристика** | 3 варианта, веса 25/15/..., 1–2 направления | Удобная дисциплина выбора, можно менять |
| **Продуктовая гипотеза** | Тема «чердак» повысит привлекательность | Требует живого сравнения и данных |
| **Факт, которого нет** | «Иконка с енотом даст +X% installs» | Нельзя использовать как аргумент |

## VI. Самопроверка методологии на ложные выводы

1. **Есть красивые рендеры, но нет истинного gameplay UI?** Gate не пройден.
2. **Успешный конкурент использует маскота, значит он обязательный?** Ложная причинность.
3. **Один пользователь выбрал стиль — доказано повышение retention?** Нет, это art direction approval.
4. **AI нарисовал 10 подходящих предметов — pipeline устойчив на 100?** Нет, нужен повторяемый тест серии.
5. **Маскот издателя = персонаж игры?** Нет, роли проверяются отдельно.
6. **Кандидаты различаются и управлением, и цветом, и контентом — сравнили только эстетику?** Нет, переменные перепутаны.
7. **Один универсальный победитель всех 6 игр?** Необоснованно: каждое решение зависит от жанра, места и стоимости.
8. **Художественное направление закреплено — UX нельзя менять?** Неверно: подтверждённые usability/доступность defects имеют приоритет.
9. **Наш скоринг 100 баллов научно валиден?** Нет, удобная сравнительная матрица с субъективными весами.
10. **Тёмный/дорогой вид гарантирует платящих игроков?** Нет.

**Итог:** методология должна уменьшать поздние переделки и давать владельцу сопоставимый выбор. Реальное улучшение conversion/retention остаётся неизвестным до соответствующего эксперимента.
