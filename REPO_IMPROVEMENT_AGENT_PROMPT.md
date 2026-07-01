# Agent Prompt: Comprehensive Repository Improvement — Background Sounds

> **How to use this file:** Paste the entire contents of this document as the first message to a fresh coding
> agent (Claude Code or equivalent) with write access to this repository. It is self-contained — the agent
> does not need any other context from outside this file. Work through the phases in order. Do not skip the
> verification steps. Do not skip the "ask before doing" checkpoints.

## Mission

You are working in the `Background-Sounds` repository — a small React + TypeScript + Vite Chrome extension
(Manifest V3) that currently implements a simple stopwatch/timer popup. The codebase is small (~15 source
files), has a working build/lint/test pipeline, and 0 known dependency vulnerabilities, but it has accumulated
real correctness bugs, near-zero test coverage, misconfigured tooling, stale documentation, and a large
dependency-currency gap. Your job is to systematically improve the repository's health — correctness, test
coverage, tooling correctness, CI/CD, dependency currency, security posture, documentation, and hygiene —
**without changing the product's visible behavior** except where a fix is explicitly called for below.

Treat this as a real, ongoing engineering improvement effort, not a one-shot patch. Work in small, verifiable,
logically-scoped commits. After every single change, run the relevant verification commands (below) before
moving to the next item. If something breaks, stop and fix it before continuing — never leave the tree in a
broken state between commits.

## Ground rules (non-negotiable)

1. **Work directly on the current branch** unless you judge a specific change to be risky enough to warrant a
   feature branch (e.g., a major dependency bump) — in that case, say so and use a branch, then merge back
   when green.
2. **Small commits, one logical change per commit.** Do not bundle unrelated fixes together (e.g., don't mix a
   lint-config fix with a dependency bump in the same commit).
3. **Verify before and after every change.** Minimum gate for any commit that touches source, config, or CI:
   ```bash
   npx tsc --noEmit
   npm run lint
   npx jest --coverage
   npm run build
   ```
   All four must succeed (or show *only* the expected/intended diff in output, e.g., coverage numbers rising)
   before you commit.
4. **Never silently reduce strictness** (don't loosen `tsconfig.json` `strict`, don't add blanket
   `eslint-disable`, don't lower coverage thresholds you just added) to make something pass.
5. **Do not commit generated artifacts.** `coverage/`, `dist/`, and any new build output must stay untracked
   (see Phase 1).
6. **Ask before doing anything irreversible or product-affecting** — see the dedicated "Ask before doing"
   section near the end. When in doubt, pause and ask rather than guessing.
7. **Keep the extension's actual runtime behavior unchanged** except for the specific correctness fixes called
   out in Phase 2 — this is a health/quality pass, not a feature rewrite (Phase 8 is the one exception, and it
   requires explicit user sign-off first).
8. Reference exact file paths and line-level evidence in your commit messages and any summary you give the
   user — don't describe changes vaguely.

---

## Phase 0 — Baseline safety net

- [ ] Confirm working tree is clean (`git status`). If not, stop and ask the user how to proceed.
- [ ] Run the full verification gate (tsc, lint, jest --coverage, build) and record the baseline output
      (especially the current 0% coverage numbers) so later progress is measurable.
- [ ] Confirm `node_modules` is installed via `npm ci` (not `npm install`) so the lockfile is respected.

---

## Phase 1 — Repository hygiene (safe, no behavior change)

- [ ] Remove the committed `coverage/` directory from git tracking: `git rm -r --cached coverage` and add
      `coverage/` to `.gitignore` (it currently is **not** ignored — confirmed 11 tracked files under
      `coverage/`). Commit as a standalone hygiene commit.
- [ ] Add a `.gitattributes`/`.editorconfig` for consistent line endings/indentation across editors, matching
      the existing `.prettierrc` settings (2-space indent, single quotes, semicolons).
- [ ] Investigate `CNAME` (contains `cybrlux.com`) and the `gh-pages` devDependency in `package.json`. Both
      look like leftovers from a previous GitHub-Pages-hosted version of this project that predates the
      Chrome-extension conversion documented in `docs/Phase 1.md`–`Phase 5.md`. **This is an "ask before
      doing" item — see below.** Do not delete them until the user confirms they're unused.
- [ ] Rename `src/backend/types/` → `src/types/` (there is no backend in this client-only extension; update
      all imports in `src/frontend/components/timer/**` and `src/frontend/components/timer/components/**`
      accordingly). Run the full verification gate after.
- [ ] Add an `engines` field to `package.json` pinning the supported Node range (align with the CI matrix:
      `"engines": { "node": ">=18 <23" }` or similar), and consider an `.nvmrc`.

---

## Phase 2 — Correctness fixes

- [ ] **Timer drift bug**: In `src/frontend/components/timer/timer.tsx`, replace the "add 0.01 every 10ms tick"
      accumulator with a timestamp-delta approach (e.g., track a start timestamp with `useRef`, compute
      elapsed time from `performance.now() - startRef.current` on each tick, or `requestAnimationFrame` for
      smoother updates). This removes the timer drift caused by `setInterval` not firing at exactly 10ms.
      Add a regression test (Phase 3) proving elapsed time tracks wall-clock time within tolerance, not tick
      count.
- [ ] **Dead throwaway interval**: In the same file, remove the `let interval: NodeJS.Timeout =
      setInterval(() => {}, 10)` pattern used purely to satisfy TypeScript. Use
      `const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)` instead, and guard
      all `clearInterval` calls with `if (intervalRef.current) { ... }`.
- [ ] **State persistence bug**: Chrome unmounts extension popups when closed, so all timer state
      (`time`, `timerOn`) is currently lost every time the user closes the popup. Add `chrome.storage.local`
      (or `.session`) persistence:
  - Add `"storage"` to `permissions` in `public/manifest.json`.
  - Persist `time` and `timerOn` (plus a `lastUpdatedAt` timestamp if using the timestamp-delta approach
    above) on every meaningful state change, and rehydrate on mount.
  - Handle the case where `chrome.storage` is unavailable (e.g., running the popup outside the extension
    context in `npm run dev`) gracefully — don't crash the dev server.
- [ ] **Dynamic copyright year**: In `src/frontend/components/footer.tsx`, replace the hardcoded `© 2023` with
      a dynamically computed year.
- [ ] **Remove Vite/React starter boilerplate from the shipped UI**: `src/frontend/pages/homePage.tsx` still
      renders the default Vite and React logos linking to `vitejs.dev`/`react.dev`, and `src/App.css` still
      carries the associated `.logo` styling; `index.html`'s favicon is still `/vite.svg`. Remove the
      boilerplate logos/links (they serve no purpose in a shipped extension popup), clean up now-unused CSS,
      and point the favicon at one of the extension's own icons in `public/icons/`.

---

## Phase 3 — Test coverage build-out

Current real coverage is 0% (verified — the only existing test is a placeholder `expect(true).toBe(true)` in
`src/tests/test.test.ts`).

- [ ] Add `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` as
      devDependencies; wire up `@testing-library/jest-dom` matchers in a Jest setup file referenced from
      `jest.config.cjs` (`setupFilesAfterEach`/`setupFilesAfterEnv`).
- [ ] Delete the placeholder `src/tests/test.test.ts` once real tests exist, or repurpose it as a real smoke
      test.
- [ ] Add unit tests for:
  - `startTimer`, `stopTimer`, `clearTimer` (`src/frontend/components/timer/api/*.ts`) — pure function
    behavior against mocked setters.
  - `TimerStartButton`, `TimerStopButton`, `TimerClearButton` — render + click behavior, including the
    conditional rendering logic (`!timerOn`/`timerOn`).
  - `Timer` — full integration test using `@testing-library/react` + fake timers (`jest.useFakeTimers()`)
    proving: start increments time, stop halts it, clear resets to zero, and the timestamp-delta fix from
    Phase 2 actually tracks elapsed wall-clock time (not tick count).
  - `Header`, `Footer`, `App`, `HomePage` — basic render/smoke tests.
  - The new `chrome.storage` persistence logic from Phase 2 — mock the `chrome` global and verify
    save/rehydrate behavior.
- [ ] Add coverage thresholds to `jest.config.cjs` (`coverageThreshold`) once coverage is meaningfully above
      0%, and ratchet them up over time rather than setting an unrealistic target immediately. A reasonable
      first target: 70% statements/lines, 60% branches — then update `testing.js.yml` (Phase 5) to actually
      run `npm run test:coverage` so this is enforced in CI.
- [ ] Remove the orphaned `tsconfig.test.json` if nothing ends up referencing it after the above changes, or
      wire it in properly if it's meant to be used by ts-jest.

---

## Phase 4 — Tooling / lint config correctness

- [ ] In `.eslintrc.cjs`, either install and enable `eslint-plugin-import` and `eslint-plugin-jsx-a11y` (since
      rules like `import/no-extraneous-dependencies` and `jsx-a11y/interactive-supports-focus` are already
      referenced in the `rules` block but are currently silent no-ops because the plugins aren't loaded), or
      remove those dead rule entries if you decide they're not wanted. Don't leave config that looks active
      but isn't.
- [ ] Add `plugin:react-hooks/recommended` to `extends` — `eslint-plugin-react-hooks` is already a
      devDependency but isn't wired in. This is the exact lint rule category that would have caught the
      Phase-2 timer bugs; enabling it going forward guards against regressions.
- [ ] Either re-enable `plugin:prettier/recommended` (currently commented out in `.eslintrc.cjs`) or document
      why it's intentionally disabled.
- [ ] Fix the `"check"` script in `package.json`: replace `npm run format` (which mutates files via
      `prettier --write`) with a non-mutating check (`prettier --check "src/**/*.{ts,tsx}"`), and drop the
      `npm install` step from a script whose purpose is verification, not setup (use `npm ci` upstream in CI
      instead, and let local devs decide when to install).
- [ ] Add a dedicated `typecheck` script (`tsc --noEmit`) separate from `build`, so CI/devs can fail fast on
      type errors without running a full bundle build.
- [ ] Consider Husky + lint-staged for pre-commit enforcement of lint/format on staged files — propose this to
      the user before adding new tooling dependencies (see "ask before doing").

---

## Phase 5 — CI/CD consolidation and modernization

- [ ] Bump `actions/checkout@v3` → `@v4` and `actions/setup-node@v3` → `@v4` across all workflow files in
      `.github/workflows/`.
- [ ] Fix `.github/dependabot.yml` — `package-ecosystem: ""` is an **unfilled template placeholder** and is
      almost certainly not functioning as intended. Set it to `"npm"` for the root npm manifest, and add a
      second `updates` entry for `package-ecosystem: "github-actions"` (`directory: "/"`) so workflow action
      versions get automatic update PRs too.
- [ ] Consolidate `build.js.yml`, `installation.js.yml`, `linting.js.yml`, and `testing.js.yml` — they
      currently duplicate `npm ci` across the same 3-version Node matrix with heavy overlap. Merge into a
      single `ci.yml` with separate jobs (`install`, `build`, `lint`, `test`) or at minimum share a composite
      action/reusable workflow for the setup steps.
- [ ] Update `testing.js.yml` (or its consolidated replacement) to run `npm run test:coverage` instead of
      `npm run test`, and add a Codecov (or equivalent) upload step — the README already displays a CodeCov
      badge that currently corresponds to nothing being uploaded.
- [ ] Add a CI job (or extend `build.js.yml`) that zips the `dist/` output as a build artifact, so a
      Chrome-Web-Store-ready package is produced on every push to `main` / on tag, rather than only being
      documented as a manual step in the README.
- [ ] Consider adding CodeQL (JS/TS) alongside the existing `njsscan` security scan, and add an `npm audit`
      step (non-blocking initially, e.g. `--audit-level=high`) to catch newly introduced vulnerabilities.
- [ ] Add a `CODEOWNERS` file if there's a defined maintainer/reviewer set.

---

## Phase 6 — Dependency upgrades (staged, verified, one ecosystem at a time)

Current state (verified via `npm outdated` / `npm audit`): 0 known vulnerabilities, but significant version
lag — Vite 4.5.3 (latest major is 8.x), React 18.2 (19.x available), `@typescript-eslint/*` 6.x (8.x
available), ESLint 8.x (9.x/10.x available, requires flat-config migration).

- [ ] Do **not** attempt all upgrades in one commit. Stage them:
  1. Low-risk patch/minor bumps first (`@types/*`, `prettier`, `eslint-plugin-react`, `eslint-plugin-prettier`,
     `gh-pages`, `ts-jest`, `jest`/`jest-environment-jsdom` within the same major) — verify full gate after
     each batch.
  2. Vite major version bump(s) — read the Vite migration guide for each major version boundary crossed (4→5,
     5→6, etc.), update `vite.config.ts` and `@vitejs/plugin-react-swc` in lockstep, and re-verify build output
     (`npm run build` + manually confirm `dist/` loads correctly as an unpacked extension) after each major
     step.
  3. ESLint 8→9/10 flat-config migration — this changes `.eslintrc.cjs` → `eslint.config.js` and affects how
     `.eslintignore` is expressed (flat config uses `ignores` in the config file itself). Treat this as its
     own PR/commit with the full lint rule-set re-verified against the codebase.
  4. React 18→19 — check for breaking changes relevant to this codebase (unlikely to be many given how small
     the component surface is), bump `@types/react`/`@types/react-dom` in lockstep.
  5. `@typescript-eslint/*` 6→8 — check for renamed/removed rules referenced in `.eslintrc.cjs`.
- [ ] After each staged upgrade, re-run the full verification gate and manually smoke-test the extension by
      loading `dist/` unpacked in Chrome (per the README's existing instructions).
- [ ] Re-run `npm audit` after all upgrades to confirm no new advisories were introduced.

---

## Phase 7 — Documentation overhaul

- [ ] Add a `LICENSE` file (the README already displays a GitHub-license badge that currently has nothing to
      point to) and add a matching `"license"` field to `package.json`. **Ask the user which license** before
      choosing one (MIT is a reasonable default for a small open-source Chrome extension, but confirm).
- [ ] `docs/Phase 1.md` through `docs/Phase 5.md` are internal AI-agent planning/reconnaissance artifacts from
      a previous "Chrome extension conversion" effort — they reference files that no longer exist (e.g.
      `routes.tsx`, React Router) because that conversion has already been completed. They are not
      contributor-facing documentation. **Ask the user** whether to delete them, move them to a
      non-published tracking location (e.g. `.copilot-tracking/` or a `docs/archive/` folder with a note
      explaining they're historical), or keep them as-is — do not delete history without confirmation.
  - **Do the same check-in for this very file** (`REPO_IMPROVEMENT_AGENT_PROMPT.md`) once the plan below is
    fully executed: propose archiving or deleting it rather than leaving a stale improvement prompt in the
    repo root indefinitely.
- [ ] Add a `CHANGELOG.md` (Keep a Changelog format) and start recording entries going forward, aligned with
      the `0.0.1` version in `package.json`.
- [ ] Update `README.md`:
  - Document the new `chrome.storage` persistence behavior from Phase 2.
  - Document the `"storage"` permission and why it's needed.
  - Fix/remove the CodeCov badge if Phase 5's coverage upload isn't implemented, or confirm it's now backed
    by real data if it is.
  - Add a short "Repository Health" or "Development" section summarizing the `typecheck`/`lint`/`test`/`build`
    scripts.
- [ ] Update `CONTRIBUTING.md` to reflect the `src/types/` rename from Phase 1 and any new test conventions
      from Phase 3.

---

## Phase 8 — Product decision checkpoint (requires explicit user sign-off — do not implement without asking)

The extension is named and described as "Background Sounds" but currently contains **no audio/sound
functionality whatsoever** — it is purely a stopwatch. Before doing any work in this phase:

- [ ] Ask the user directly: should this extension actually gain background-sound playback (the feature
      implied by its name/description), or should the name/description instead be updated to accurately
      describe it as a focus timer (matching its stated inspiration, Focusly)?
- [ ] If the user wants the sound feature: this requires new scope (audio asset sourcing/licensing, a sound
      picker UI, `chrome.offscreen`/`Audio` API usage appropriate for MV3 service-worker constraints, volume
      controls, and new manifest permissions/CSP considerations) — treat it as its own planning effort with a
      dedicated design pass, not something to bolt on inside this hygiene/quality pass.
- [ ] If the user wants the name/description updated instead: update `package.json` `description`, `README.md`
      title/description, and `public/manifest.json` `name`/`description` for consistency.

---

## Definition of done

- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run test:coverage`, and `npm run build` all pass with zero
      warnings/errors.
- [ ] Real (non-placeholder) test coverage is meaningfully above 0% and enforced via `coverageThreshold` in CI.
- [ ] `coverage/` is no longer tracked in git.
- [ ] `.github/dependabot.yml` has a valid `package-ecosystem` and covers both `npm` and `github-actions`.
- [ ] All GitHub Actions use current major versions (`@v4`+) of `actions/checkout`/`actions/setup-node`.
- [ ] CI actually runs and (ideally) uploads coverage, matching what the README badges claim.
- [ ] `LICENSE` exists and matches the README's license badge.
- [ ] `docs/Phase 1.md`–`Phase 5.md` have been explicitly triaged (archived, deleted, or kept) per user
      decision, not left ambiguously in `docs/`.
- [ ] The timer no longer drifts and no longer loses state when the popup closes.
- [ ] No Vite/React starter boilerplate remains in the shipped UI.
- [ ] Dependency upgrades have been staged and verified per Phase 6, with `npm audit` clean.
- [ ] The Phase 8 product question has been asked and answered (even if the answer is "leave it as a timer").

## Ask-before-doing checklist (do not proceed on these without explicit user confirmation)

- Deleting or moving `CNAME` and/or the `gh-pages` dependency (Phase 1).
- Choosing and applying a specific open-source license (Phase 7).
- Deleting or archiving `docs/Phase 1.md`–`Phase 5.md`, and later this prompt file itself (Phase 7).
- Any major dependency version bump that crosses a breaking-change boundary (Vite, ESLint, React, TypeScript)
  (Phase 6) — confirm the upgrade order/timing, not just that upgrades should eventually happen.
- Anything in Phase 8 (the actual "background sounds" feature vs. renaming the product).
- Adding new tooling dependencies not already discussed above (e.g., Husky/lint-staged, CodeQL, Playwright).

## Commit conventions

Use Conventional Commits (`fix:`, `feat:`, `test:`, `chore:`, `docs:`, `ci:`, `refactor:`) scoped to exactly
one phase/item at a time, e.g.:

```
fix(timer): derive elapsed time from timestamp deltas instead of tick accumulation

The previous implementation added a fixed 0.01s per setInterval tick, which drifts
from real time because setInterval does not fire at an exact 10ms cadence. This
computes elapsed time from performance.now() deltas instead.
```

Work through the phases in order, verify continuously, and stop to ask whenever you hit one of the
ask-before-doing items above.
