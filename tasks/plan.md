# Implementation Plan: Indonesian Typography Refresh

## Overview
Implement a warm editorial typography refresh for the portfolio by changing global font choices and typography tokens in the existing Next.js + Tailwind setup. The change stays centralized in font loading, Tailwind font/prose configuration, and global CSS so Indonesian content becomes more readable without component rewrites.

## Architecture Decisions
- Use `next/font/google` with CSS variables because the project already exposes fonts through `--font-sans`, `--font-display`, and `--font-mono`.
- Keep the system shared across English and Indonesian to avoid maintaining separate component styles per locale.
- Apply Indonesian-friendly rhythm through global base CSS and Tailwind Typography settings rather than per-component overrides.
- Preserve existing spacing, color, layout, and i18n behavior.

## Task List

### Phase 1: Foundation
- [x] Task 1: Update global font pairing
- [x] Task 2: Tune base typography rhythm

### Checkpoint: Foundation
- [x] `npm run lint` passes
- [x] `npm run type-check` passes

### Phase 2: Long-Form Readability
- [x] Task 3: Tune Tailwind Typography prose defaults

### Checkpoint: Complete
- [x] `npm run build` passes
- [x] Indonesian home/blog/project copy remains readable through inherited typography styles
- [x] Spec success criteria are met

## Dependency Graph
Font loading in `src/app/layout.tsx`
  -> Tailwind font family mapping in `tailwind.config.ts`
  -> Global base/prose rhythm in `src/app/globals.css` and Tailwind Typography config
  -> Components inherit typography without local rewrites

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Google font import name is invalid | High | Use documented `next/font/google` exports and verify with build |
| New display font makes existing headings too wide | Medium | Choose calm editorial display face and avoid large tracking changes |
| Prose changes affect code blocks or admin editor unexpectedly | Medium | Scope prose tuning to Tailwind Typography styles and preserve mono mapping |
| Visual regression in English locale | Low | Use shared readable typography and avoid `html[lang="id"]` overrides for now |

## Open Questions
- None blocking. User selected the warm editorial direction.
