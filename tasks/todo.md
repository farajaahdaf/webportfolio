# Task List: Indonesian Typography Refresh

## Task 1: Update Global Font Pairing

**Description:** Replace the current sans/display pairing with a warmer editorial pairing while preserving the existing CSS variable names.

**Acceptance criteria:**
- [x] `src/app/layout.tsx` still defines `--font-sans`, `--font-display`, and `--font-mono`.
- [x] Font variables are still applied to `<html>`.
- [x] No package dependency is added.

**Verification:**
- [x] `npm run type-check`
- [x] `npm run build`

**Dependencies:** None

**Files likely touched:**
- `src/app/layout.tsx`

**Estimated scope:** XS

## Task 2: Tune Base Typography Rhythm

**Description:** Adjust global body and heading typography so Indonesian sentence-case text has a cleaner rhythm and less cramped feel.

**Acceptance criteria:**
- [x] Body copy uses readable global line-height and font feature settings.
- [x] Heading elements inherit the display font consistently.
- [x] Existing color and spacing tokens are preserved.

**Verification:**
- [x] `npm run lint`
- [x] `npm run type-check`

**Dependencies:** Task 1

**Files likely touched:**
- `src/app/globals.css`

**Estimated scope:** S

## Task 3: Tune Tailwind Typography Prose Defaults

**Description:** Configure Tailwind Typography defaults for blog/project prose so Indonesian long-form content has better measure, spacing, heading rhythm, and code readability.

**Acceptance criteria:**
- [x] `prose` paragraphs, headings, links, lists, and code blocks use project color tokens.
- [x] Prose width and rhythm remain suitable for blog/project detail pages.
- [x] No component-level prose rewrites are required.

**Verification:**
- [x] `npm run lint`
- [x] `npm run type-check`
- [x] `npm run build`

**Dependencies:** Tasks 1 and 2

**Files likely touched:**
- `tailwind.config.ts`

**Estimated scope:** S
