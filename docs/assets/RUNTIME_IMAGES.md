# Runtime image production

Import Node tooling from `@danilah/mini-games-kit/assets`. It requires the optional `sharp` peer.

This layer starts **after** source art has been generated/cut out/normalized. It preserves the production steps that materially reduced Signal 2000 cold-start bytes and decoded texture residency without baking Signal-specific dimensions or quality numbers into the kit.

## Transparent physical trimming

`trimTransparentWebp(input, options)` finds alpha-visible bounds, keeps a configurable gutter, writes a physically smaller WebP candidate and returns `LogicalTrimFrame` metadata describing where that physical crop belonged on the original logical canvas.

The function rejects a candidate when reconstructed visible RGB/alpha MAE exceeds configured safety thresholds. If transparent-pixel savings are below `minPixelSavingRatio`, it returns the original bytes unchanged instead of performing a pointless lossy re-encode.

For a committed file pipeline, prefer `trimCanonicalTransparentWebp(input, { existingFrame, ...options })`. If the current physical image already has exactly the dimensions described by `existingFrame`, the image + frame pair is treated as canonical and returned without another lossy crop/re-encode. If a source-generation step later restores the full logical canvas, the dimensions no longer match the saved frame and a fresh trim is computed. This preserves the idempotence that proved important in repeated Signal 2000 asset builds.

The consumer owns how `LogicalTrimFrame` is applied in Phaser or another engine. Persist that metadata beside the asset manifest and treat the image + frame as one canonical runtime asset.

## AVIF companions

`buildAvifCompanions()` accepts explicit `{ id, input, output, category }` rows plus an injected quality policy. The policy may return a different quality per category; the kit deliberately does not encode Signal 2000's q60/q65/q70 profile.

`validateAvifCompanions()` verifies companion existence, AVIF/HEIF metadata, dimensions, alpha preservation and an optional aggregate byte-saving floor.

Do not infer browser startup improvement from encoder output alone. Run controlled browser comparison and then the target host/device gate.

## Runtime budget accounting

`inspectRuntimeImageBudget()` reports, globally and by category:

- encoded file bytes;
- physical pixel count;
- a simple `pixels × 4` decoded RGBA residency proxy.

This distinction matters: an optimization can save requests or encoded bytes while increasing decoded texture area.

## Recommended pipeline

1. Preserve the best available source/master.
2. Remove background and normalize to a canonical logical canvas.
3. Determine actual maximum presentation size/DPR before choosing runtime dimensions.
4. Produce the fallback WebP.
5. Trim transparent physical bounds and persist logical-frame metadata; make repeated builds idempotent with the canonical frame.
6. Generate AVIF companions from the best practical source available.
7. Validate dimensions, alpha and aggregate payload budget in CI.
8. Measure encoded bytes **and** physical decoded-pixel proxy.
9. Compare candidates in a controlled browser profile.
10. Finish on the real distribution host/device.

A lossy WebP→AVIF conversion can still be a useful production optimization when masters are unavailable, but it is not equivalent to encoding both formats from a pristine master. Record that provenance so a later art refresh can rebuild from source.

## Non-goals

This module does not decide canonical dimensions, codec quality, asset categories, texture keys, loader policy or visual acceptance. Those are project decisions derived from presentation budget and hands-on QA.
