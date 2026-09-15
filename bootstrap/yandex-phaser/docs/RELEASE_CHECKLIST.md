# Yandex release checklist

Use the current `mini-games-kit/docs/yandex/DRAFT_RELEASE_PLAYBOOK.md` as the detailed source of truth and re-check current Yandex requirements before submission.

Minimum hosted gate:

- production build uses the real Yandex runtime, not mock;
- `index.html` is at upload-root level and `npm run release:check` is clean;
- first correct/usable frame is visible before semantic Game Ready is sent;
- `LoadingAPI.ready()` is sent once from the semantic ready path;
- GameplayAPI pause/resume, document visibility and orientation blockers do not resume prematurely;
- audio obeys platform pause/resume and user mute state;
- persistence/recovery survives refresh and any pending durable work;
- interstitial/rewarded ad semantics are checked in hosted DRAFT where applicable;
- RU/EN or the project's supported language set is verified;
- rotate portrait → landscape → portrait → landscape on a real mobile browser/WebView;
- cold startup is measured on Yandex DRAFT/CDN; convenience hosting is not used as the production network verdict;
- debug build/panel is disabled in the submission candidate;
- the exact submitted archive/build is identifiable by commit/artifact hash.
