# Optional store-pack static preflight

**Snapshot:** official fields interpreted as of 2026-11-11. **Not a moderator, image decoder, crop preview, SEO evaluator or publisher.** No package dependency or integration into CI/build. Intended for a game agent preparing an explicitly targeted store release.

Run from any directory with Node.js 20+:

```sh
node path/to/mini-games-kit/docs/store-presence/tools/check-assets.mjs path/to/store-pack.json
```

Example `store-pack.json` for RuStore main mobile listing (image paths are relative to the JSON file):

```json
{
  "store": "rustore",
  "page": "main",
  "device": "phone",
  "metadata": {
    "title": "Название",
    "short": "Настоящая механика игры",
    "description": "Описание реально существующих игровых возможностей."
  },
  "assets": {
    "icon": "icon.png",
    "screenshots": ["01.png", "02.png", "03.png"]
  }
}
```

Other accepted `store` values: `google-play`, `app-store`, `yandex-games`. Asset fields: `icon`, `cover` (Yandex), `feature` (Google), `screenshots`. Text fields follow [PLATFORM_REQUIREMENTS.md](../PLATFORM_REQUIREMENTS.md): `title`, `short`, `description`, Apple `subtitle`, `keywords` and `promotionalText`, Yandex `howToPlay` and `seo`. For Apple, `device` can be `iphone-dynamic-island-medium` or `ipad-13`, but the spec supports more sizes; unrecognized device group must be checked manually. Yandex `device`: `mobile-portrait`, `mobile-landscape`, or `desktop`. Unlisted form fields or screenshots for additional devices require review in the relevant console.

Checks are intentionally restricted to:
- Declared store, mandatory text presence and length, including Apple keyword UTF-8 **bytes**.
- PNG/JPEG header signatures, PNG IHDR, PNG IEND marker, JPEG SOF/EOI marker, width/height, PNG color model/transparency flag and file byte length.
- Basic required asset count, known aspect ratios and format family per store/surface.
- Warnings on known issues: RuStore 30/50 title conflict; Apple device-specific screenshots; Google promotional surface requirements; Yandex gameplay-area rule.

**Not checked:** full PNG/JPEG decode/CRC; whether actual gameplay occupies the required area; correct store preview cropping; genuine in-app screenshots; ownership/license; review policy; correct translations; motion/video duration/codec; account eligibility; iPad/TV/XR and other unmodeled device-specific requirements; Apple in-app icon; production build provenance; page experiment validity; app performance or store-side moderation. These are **manual gates**, even when the tool returns `pass: true`.

Testing of the static checker: V8 syntax validation and five isolated synthetic-manifest scenarios passed (RuStore positive and screenshot-count negative, Google Play positive, Apple UTF-8 keyword negative, Yandex positive). This **does not** establish that all real images decode or that the tool matches every future store console rule.

This tool is **optional**. Do not embed it into a consumer's runtime package or hard-fail a production build for outdated store fields. Re-check official docs and actual console fields **at the time of intended submission**.

Entry point: [Store Presence methodology](../README.md).
