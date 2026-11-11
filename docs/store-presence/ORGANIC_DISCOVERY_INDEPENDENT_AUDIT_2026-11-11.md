# Independent Second-Pass Audit — Organic Discovery & Launch

**Date:** 2026-11-11. **Audited artifact:** [Organic Discovery & Launch Strategy](ORGANIC_DISCOVERY_LAUNCH_2026-11-11.md). **Type:** independent desk verification against live official platform materials and known failure cases, *not* a causal experiment with our games. No account credentials, consoles or real device-based search experiments were available.

## A. Attack the original thesis

**Claim tested:** 'We can obtain some initial organic audience with no ad spend by preparing a credible listing and a launch process.'

**Verdict: CONDITIONAL.** Platform documentation establishes possible discovery *surfaces*, not adequate traffic supply for a new, low-budget developer. A metadata change might lift relevance without creating user interest; an editorial nomination might be ignored; the platform might be inaccessible; the genre might be saturated. The method therefore optimizes *learning and avoiding wasted effort*, not promised installs.

### Distinguish documentation from causes

| Assertion | Evidence | Verdict | Why it might fail in a real project |
| --- | --- | --- | --- |
| RuStore search considers query match, installs, page interaction, rating | [Official September 2026 ranking article](https://www.rustore.ru/developer/blog/poisk-i-ranzhirovanie-prilozhenij-v-rustore-chto-vazhno-znat-razrabotchiku) | VERIFIED AS PUBLISHED DESCRIPTION | No transparent weights; relevance does not ensure page views |
| RuStore featuring is free, not automatic, editorial | [Official featuring](https://www.rustore.ru/help/developers/advertising-and-promotion/featuring) | VERIFIED | Quality is necessary at best, not a guarantee; editorial selection bias |
| RuStore separates internal and UTM-tagged external traffic | [Official Nov 2026 metrics](https://www.rustore.ru/developer/blog/statistika-v-konsoli-rustore-kak-analizirovat-prosmotry-ustanovki-i-istochniki-trafika) | VERIFIED | Mobile-card views omit browser; misattribution/missing UTM; delay |
| RuStore official store conversion has one unambiguous numerator | Same Nov metrics article | **CONFLICT / UNRESOLVED** | Two consecutive paragraphs say 'all installs regardless of source' and 'installs from card'; cannot choose without inspecting real metric definitions |
| Google Play listing report = completed install | [2026 metric revision](https://support.google.com/googleplay/android-developer/answer/9859173?hl=en) | REJECT | Unique intent clicks are not completed acquisitions; reports exclude some other surfaces |
| All stores boost games in initial seven days | [Yandex New](https://yandex.com/dev/games/doc/en/concepts/ranking-and-featuring) vs [Google](https://support.google.com/googleplay/android-developer/answer/9958766?hl=en), [RuStore](https://www.rustore.ru/developer/blog/poisk-i-ranzhirovanie-prilozhenij-v-rustore-chto-vazhno-znat-razrabotchiku), [Apple](https://developer.apple.com/app-store/search/) | REJECT AS UNIVERSAL | Only Yandex explicitly documents this particular one-week New mechanism; no evidence to generalize |
| Yandex has a one-time New placement for a week | Official Yandex ranking doc | VERIFIED DOCUMENTED NORMAL RULE | New publishing temporarily blocked; not a numeric install prediction |
| Yandex Rating = user star-rating | [Yandex metric definitions](https://yandex.com/dev/games/doc/en/concepts/metric) | REJECT | It is 0–100 engagement index formed after enough daily traffic and time |
| Yandex Conversion To Play = app-store conversion | Same Yandex metrics doc | REJECT | It is share of sessions longer than 60s; a different funnel |
| Yandex new games could be safely scheduled for immediate publication on 11 Nov 2026 | [Developer status](https://t.me/s/yangamesdevnews/540) | **BLOCKED as of last official status inspected** | Submissions/ELS registration temporarily paused amid infrastructure recovery; verify newer updates/console |
| Android vitals influence Play visibility now | [Android vitals](https://developer.android.com/google/play/vitals) | VERIFIED WITH SCOPE | Crash/ANR now; memory/code-optimization visibility effect stated for **Feb 2027**, not an active Nov 2026 sanction |
| Apple featuring can be nominated | [App Store Connect nominations](https://developer.apple.com/help/app-store-connect/manage-featuring-nominations/nominate-your-app-for-featuring) | VERIFIED | Discretionary review; early notification advice is not eligibility or promise |
| App Store listing impressions are identical to RuStore card views | [Apple metrics](https://developer.apple.com/app-store/measuring-app-performance/), [RuStore metrics](https://www.rustore.ru/developer/blog/statistika-v-konsoli-rustore-kak-analizirovat-prosmotry-ustanovki-i-istochniki-trafika) | REJECT | Different surfaces and denominators |
| Individual RuStore publisher can always use native payments | [Official RU page](https://www.rustore.ru/developer) vs [official EN page](https://www.rustore.ru/developer/en) | **CONFLICT / UNKNOWN ACCOUNT** | RU material favors legal/IE; EN material describes self-employed individuals; account-specific terms win |
| Organic campaign has zero cost | Work/time ledger | REJECT | Production and outreach have opportunity cost |
| High volume of ad displays equals healthy Yandex gameplay | No applicable causal evidence | REJECT | Can be achieved via intrusive monetization while harming player experience |
| Buying install/rating traffic is a sustainable growth workaround | [Google policy](https://support.google.com/googleplay/android-developer/answer/18265346?hl=en), [RuStore requirements](https://www.rustore.ru/help/developers/publishing-and-verifying-apps/requirement-apps) | REJECT / POLICY RISK | Manipulation, nonqualifying users, possible enforcement |
| Reddit/Shorts posts give replicable launch uplift | Community stories, creator selection | NOT ESTABLISHED | Anecdotes are survivorship-biased and context-specific |

## B. Recursion: re-test each inferential step

**Round 1: Is there a route to visibility?** Yes, documented search, recommendations, editorial and external links. BUT visible surfaces do not imply our app will receive nonzero meaningful discovery. Reclassify 'visibility' as a hypothesis.

**Round 2: Can a platform metric measure the route?** Sometimes. RuStore card views are not shelf impressions; Google changed the conversion event; Yandex >60s play is post-launch and Apple impressions are different. Require exact dictionary per store. If no metric, unknown; no cross-platform combined CTR.

**Round 3: Is more exposure desirable?** Not inherently. A clip can draw the wrong audience. First-puzzle success, source-aligned experience, voluntarily returning users and time cost guard against vanity. No universal benchmarks.

**Round 4: Is any 'free' channel genuinely cheap?** It can take hours to create video, answer comments and chase creators. A one-off high-performing video might not recur. Record hours spent and the cost of recurring assets; cut the source if it defeats the low-production-burden goal.

**Round 5: Does the method transfer across markets?** Not by default. Geographical availability, monetization rights, platform algorithm, genre, language, device and cultural fit differ. All recommendations require a concrete consumer release and eligibility gate.

**Round 6: Could ranking transparency be reverse engineered?** Not responsibly from one game's traffic series. Concurrent changes and hidden algorithms defeat simple causal inference. Even measured changes may reflect seasonality, shelf selection or attribution reclassification.

**Round 7: Is a seven-day rush needed?** On Yandex normal New listing, launch readiness matters, but do not rush a buggy release. On other platforms universal seven-day deadline is unsupported. On Yandex as of Nov 11, new placement has a *current external blocker*, making readiness and account status more important than launch timing.

## C. Evidence quality and source incentives

1. **Official store policy and product docs**: high confidence for a stated feature as of date, weaker evidence for algorithmic causal weights or current account eligibility.
2. **Official store marketing/developer blogs**: useful for names of signals and workflows, but may promote vendor tools and overstate favorable outcomes; not independent performance validation.
3. **Research papers**: may study developer marketing or ad attribution, often other markets and game types, with poor external validity to small Russian puzzle games. A [2025 mobile app adoption review](https://journals.sagepub.com/doi/10.1177/14413582251358508), a [2023 six-company game marketing case study](https://link.springer.com/article/10.1007/s11042-022-13688-0) and a [2025/26 advertising shutdown working paper](https://arxiv.org/abs/2504.16151) **do not supply** free-launch install/retention constants for this portfolio.
4. **Reddit success stories**: signal potential content/channel combinations and common failure modes, but select for unusual winners, unknown denominator and uncontrolled cases. Do not enter case numbers into revenue models as forecasts.
5. **Our own future production data**: more directly relevant but cannot establish causality without source controls and stable definitions.

## D. Adversarial counterexamples that should change a decision

| If this happens | The tempting wrong conclusion | Correct response |
| --- | --- | --- |
| Search traffic down after changing screenshot | Screenshot hurt ranking | Screenshot may change conversion, ranking/source mix and seasonality separately; investigate segmented sources |
| Hundreds of external clicks, 2 installs | Search algo suppressed app | Check device/geo eligibility, wrong target, RuStore web-view omission and direct link |
| 15 Google install clicks, 9 completed installs | 15 installations acquired | Clicks and actual installs are different events; do not add |
| 1 Yandex day with 100 long sessions | New section permanently secured | Rating needs continued activity, repeat traffic, and quality; one day insufficient |
| 20 friends test app, 75% 'retention' | Good market retention | Friendly cohort is not representative and may not be public |
| First post in community hits 50,000 views | Repeatable cost-free UA strategy | Could be one-off selection; examine engaged/attributable installs and reproducibility |
| App shows no store 'impressions' metric | It has zero ranking visibility | Surface/definition may not be measured; mark unobserved |
| 90 levels and good assets but weak traffic | Build 300 new levels | Distribution/eligibility/intent may be primary bottleneck; do not inflate content scope |

## E. Missing primary evidence — actionable blockers

- **No owner console exports:** cannot estimate impressions, search source share, installation rate, UTM conversions, D1/D7 or revenue for actual games.
- **No device-backed discovery session:** no confirmed position for any Russian query/country/account. Personalized store results cannot be assumed universal.
- **No direct external channel experiment:** no proof Reddit, VK, Telegram, creators or Shorts reaches real players for these particular games.
- **No account/contract review:** Google Play, Apple, Yandex, RuStore payout and ad eligibility must be confirmed per owner and product before cash forecasts.
- **No human first-session sample:** cannot say market users like the first game minute; first-time experience is a separately planned research track.
- **No publisher economics:** time cost of community marketing is a prospective assumption until tracked.
- **No true cross-platform retention join:** individual-level identity/consent/SDK differences prevent comparing raw numbers with confidence.

These limitations are not reasons to invent metrics or to halt all work. They define the minimum consumer validation package.

## E2. Portfolio reality check — stale repo prose is not store evidence

A separate live read of consumer GitHub READMEs found a concrete warning: **seeds-bits README links a historical release document labeled 'published 1.0.0'**, while the owner's explicit status on 11 Nov 2026 is that Seeds **has not been published or submitted to RuStore**. Therefore a filename, signed APK, old release document or a README status cannot replace a *direct current Console or owner-confirmed public listing check*. The same caution applies to Road Lines and other games whose top-level READMEs can refer to early content snapshots while later production plans describe more levels. Treat all game-specific stage and store assertions as UNKNOWN until the exact consumer HEAD / release history / store URL is inspected.

This directly invalidates a tempting retrospective experiment: measuring pre-release AppMetrica devices as if they were a publicly acquired RuStore cohort. The acquisition research must **not** invent a public baseline from test/dev traffic.

## F. Safe consumer experiment and review gate

Before one real release, a consumer should provide: current commit/build and publishing status; verified store account and country; 3–7 query-intent terms; working direct store link; source/campaign ledger; actual Console screenshots/CSV definitions; first-open and first meaningful action events; baseline bug/ads report; one allowed audience-fit source; daily effort log; D1/D7 only when cohorts mature. Use [Launch Brief Template](LAUNCH_BRIEF_TEMPLATE.md). Human research must be consensual and without fake reviews or incentivized ranking behavior.

**Decision standard:** a finding is ADOPT only after an actual game can identify a first acquisition bottleneck and change one controllable lever. A plausible platform mechanism with no consumer evidence is HOLD. A source unsupported by current distribution or payment eligibility is BLOCKED. A causal 'algorithm hack' claim without a reproducible test is REJECT.

**Change safety:** this research requires only docs and templates in mini-games-kit, not new package exports, SDK wrappers, universal search keyword generators, automatic store edits or changes in consumers. No non-approved live submissions.
