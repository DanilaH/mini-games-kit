# Contributing

Keep changes small and evidence-driven. Prefer extracting a proven primitive with focused tests over introducing a broad framework abstraction. Breaking `0.x` APIs is acceptable when a real consumer demonstrates a better contract.

## Public surface checklist

When adding or materially changing an exported utility/subsystem:

1. Add or update focused tests for the reusable behavior and lifecycle edge cases.
2. Add or update a focused document under `docs/` that explains purpose, public import/API, normal usage, guarantees and non-goals.
3. Link the document from `docs/API.md`.
4. Keep project-specific policy/configuration out of the reusable contract.
5. Record provenance or intentional semantic changes when the implementation was extracted from a production project.

Public API documentation is part of the change, not optional follow-up work.
