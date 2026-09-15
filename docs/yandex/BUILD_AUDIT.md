# Yandex build audit

Import Node-only helpers from `@danilah/mini-games-kit/yandex-tooling`.

`auditYandexBuildDirectory(root, options)` inspects the directory that is intended to become the **root** of the upload ZIP. It verifies required root files (default `index.html`), counts files/uncompressed bytes, applies a caller-supplied size ceiling and warns about a suspicious nested `dist/` wrapper.

```ts
const report = await assertYandexBuildDirectory('dist', {
  maxUncompressedBytes: 100_000_000, // current project/platform policy, not a kit constant
});
```

The kit deliberately does not ship a ZIP implementation or hardcode the platform's current archive-size requirement. CI can use the environment's archiver, then `sha256File()` to identify the exact artifact that was uploaded/tested.

A release workflow should also verify build-time policy that cannot be inferred generically from files alone: real Yandex runtime selected, debug access intentionally enabled/disabled, correct SDK URL, analytics/CSP configuration, and no mock-only behavior in the public candidate.
