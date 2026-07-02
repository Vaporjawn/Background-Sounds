# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Persisted timer state (elapsed time and running/paused status) across popup
  close/reopen via `chrome.storage.local`, including the new `"storage"`
  permission in `public/manifest.json`.
- Real unit and integration test coverage (~98% statements/lines, ~96%
  branches) via Jest + React Testing Library, replacing the previous
  placeholder test.
- `typecheck` and `format:check` npm scripts.
- Husky + lint-staged pre-commit enforcement.
- CodeQL (JavaScript/TypeScript) static analysis alongside the existing
  njsscan scan.
- Consolidated CI workflow (`ci.yml`) with build/lint/test jobs, coverage
  upload to Codecov, a non-blocking `npm audit` job, and an automated
  Chrome-Web-Store-ready `dist/` zip artifact produced on push/tag.
- `CODEOWNERS`, `.editorconfig`, `.gitattributes`, `LICENSE` (MIT).

### Fixed

- Timer drift: elapsed time is now derived from `performance.now()`
  timestamp deltas instead of accumulating a fixed 0.01s per `setInterval`
  tick, which previously drifted from real elapsed time.
- Removed a dead "throwaway interval" pattern that existed only to satisfy
  TypeScript's type checker.
- Footer copyright year is now computed dynamically instead of being
  hardcoded to `2023`.
- Fixed several ESLint configuration issues: `eslint-plugin-import` and
  `eslint-plugin-jsx-a11y` were referenced in rules but never
  installed/loaded; `eslint-plugin-react-hooks` was installed but never
  enabled; `plugin:prettier/recommended` was disabled with no explanation;
  the base `no-unused-vars` rule false-positived on valid TypeScript-only
  syntax.
- `npm run check` no longer mutates files (`prettier --write` replaced with
  a new non-mutating `format:check` script) or runs `npm install` as a side
  effect.
- Fixed `.github/dependabot.yml`'s unfilled `package-ecosystem: ""`
  placeholder (now `npm` and `github-actions`).

### Changed

- Moved `src/backend/types/` to `src/types/` (this is a client-only
  extension with no backend).
- Bumped `actions/checkout`/`actions/setup-node` to v4 across all workflows.
- Applied safe patch/minor dependency updates (no major-version crossings);
  `npm audit` findings dropped from 19 (1 critical) to 8 (0 critical).
- Pinned the supported Node.js version range via `engines` in
  `package.json` and a matching `.nvmrc`.

### Removed

- Removed the unused GitHub Pages leftovers (`CNAME`, the `gh-pages`
  devDependency) and the Vite/React starter boilerplate (default logos,
  unused CSS, default favicon) from the shipped popup UI.
- Untracked the generated `coverage/` directory from git.
- Removed internal AI-agent planning docs (`docs/Phase 1.md`-`Phase 5.md`)
  describing an already-completed prior migration.
