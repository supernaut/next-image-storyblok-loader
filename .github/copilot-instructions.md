# Copilot Project Instructions

Concise guidance for AI coding agents working on `@supernaut/next-image-storyblok-loader`.

## Purpose & Architecture

A small TypeScript library that provides a custom Storyblok-aware image loader (and helpers) for the Next.js `<Image>` component. Core responsibilities:

- Parse Storyblok asset URLs and extract transformation directives (size, quality, format, focal crop).
- Generate canonical Storyblok image URLs from options.
- Provide a Next.js-compatible `ImageLoader` (`storyblokImageLoader`) and a factory (`getStoryblokImageLoader`).
- Offer utility guards (`imgSrcIsStoryblok`) and parsing helpers (`parseStoryblokSrc`).

Public API surface is defined in `src/index.ts` and bundled via `tsup` (`tsup.config.ts`). Each helper lives in `src/lib` or `src/types` (types only). Build outputs go to `dist/` in both ESM and CJS with generated d.ts.

## Key Files

- `src/index.ts` – central export hub (treat additions deliberately; maintain type-only exports).
- `src/lib/get-storyblok-image-loader.ts` – core dynamic loader logic (resizing & quality negotiation based on requested width).
- `src/lib/storyblok-image-loader.ts` – default instance export.
- `src/lib/get-storyblok-src.ts` & related helpers (`get-storyblok-src-host`, `get-storyblok-src-path`, etc.) – compose the final URL.
- `src/lib/parse-storyblok-src.ts` – robust URL parser; normalizes host, extracts resize, quality, format, focus.
- `src/lib/img-src-is-storyblok.ts` – hostname guard used early in loader.
- `src/types/*.ts` – discrete, narrow type definitions (avoid circular imports; keep them granular).
- `vitest.config.ts` – test inclusion/exclusion; note `src/types` tests intentionally removed.

## Conventions & Patterns

- Functional, stateless helpers; no classes.
- Optional values only added to result objects when defined (avoid undefined keys).
- Host override precedence: explicit option > env var `STORYBLOK_IMAGE_LOADER_HOST` > default (`a.storyblok.com`).
- Formats are whitelisted (`avif|jpeg|png|webp`). Do not add others without updating both type and allowed list.
- URL parsing: prefer `new URL()` then operate on `pathname.split('/')`; avoid regex-only parsing except for focused sub-patterns (size, focal, filters).
- Error throwing: parsing invalid URLs should throw `TypeError` with message `Invalid Storyblok image URL: <input>` (keep tests aligned).
- When enhancing loader behavior preserve early return for non-Storyblok URLs.

### Code Style (Project-Specific)

- Avoid ternary (`cond ? a : b`) expressions; prefer explicit `if {}` / `else {}` blocks for clarity.
- Avoid single-line `if` statements; always wrap bodies in braces:

  ```ts
  // Preferred
  if (condition) {
    doThing();
  } else {
    doOther();
  }

  // Avoid
  if (condition) doThing();
  const value = condition ? a : b;
  ```

- Early returns are fine (and preferred to deep nesting) but still use braces:
  ```ts
  if (!isValid) {
    return defaultValue;
  }
  ```
- Use explicit variable declarations over inline logical (`&&`) execution; e.g. do not rely on `condition && fn()`.

## Tests

- Located under `src/lib/*.test.ts`; use Vitest globals (configured with `globals: true`).
- Type placeholder tests in `src/types` were removed; do not recreate unless adding meaningful runtime behavior.
- When modifying parsing or URL generation, update/add tests mirroring real Storyblok URL patterns (see existing cases in `parse-storyblok-src.test.ts`).

## Build & Tooling

- Build: `pnpm build` (tsup) → multi-entry outputs defined explicitly; add new entry keys if exposing new top-level modules.
- Test: `pnpm test` (watch variants available). Coverage excludes `src/types` and config files.
- Lint: `pnpm lint` / `pnpm lint:fix` (ESLint flat config in `eslint.config.mjs`). Follow existing code style (Prettier auto-format; no semi config specifics—trust tooling).
- Type check: `pnpm type-check` (strict enough to catch misuse; keep surface types stable).

## Release & CI

- Conventional commits enforced via `commitlint` & `lefthook` (see `commitlint.config.js`). Use semantic prefixes (`feat:`, `fix:`, etc.).
- CI (`.github/workflows/pull-request.yml`) validates commits only; publishing workflow (`publish.yml`) runs tests then builds before npm publish on `main` push.
- Versioning handled manually (see `CHANGELOG.md` & `release.md`). Do not bump version casually in PRs without aligning changelog.

## Adding Features / Changes

1. Prefer adding a focused helper in `src/lib` + corresponding tests.
2. Export through `src/index.ts` only if part of public API; otherwise keep internal.
3. For new image filters or URL params: extend parser (update allowed lists) AND generation (mirrored logic in src building helpers) with tests for round-trip.
4. Maintain backward compatibility in error messages and object shapes; add new optional fields rather than repurposing existing ones.

## Common Pitfalls

- Forgetting to normalize host when building or parsing → always pass through `getStoryblokSrcHost`.
- Introducing unsupported format without updating both the type alias and whitelist.
- Mutating shared `options` object inside loader unintentionally; clone if you need to derive state (current code mutates selectively—be cautious extending this pattern).
- Adding a file but not adding it to `tsup.config.ts` when it needs to be a distributable entry.

## Quick Reference Snippets

Check Storyblok URL: `imgSrcIsStoryblok(src, options.host)`.
Parse & derive resize: `const parsed = parseStoryblokSrc(src); if (parsed.resize) { ... }`.
Generate URL with overrides: `getStoryblokSrc(src, { format: 'webp', resize: { width: 800 } })`.
Create custom loader: `const loader = getStoryblokImageLoader({ host: 'images.example.com' });`.

## When Unsure

Search existing helpers before adding new logic—many URL concerns already covered. Keep the library lean; avoid adding Next.js app-level concerns here.

---

Adjust or ask for clarification if expanding into new transformation features (e.g., background color, blur) so instructions can be updated.
