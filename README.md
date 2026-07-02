<div align="center">

# Background Sounds - Chrome Extension

<div style="display: flex; justify-content: center; align-items: center; width: 100%;">


[![CI](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/ci.yml/badge.svg)](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/ci.yml)[![CodeQL](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/codeql.yml/badge.svg)](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/codeql.yml)[![Security Scan](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/securityscan.yml/badge.svg)](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/securityscan.yml)[![codecov](https://codecov.io/gh/Vaporjawn/Background-Sounds/graph/badge.svg)](https://codecov.io/gh/Vaporjawn/Background-Sounds)

</div>

## About

A simple Chrome extension timer for tracking time and focus sessions. Built with React, TypeScript, and Vite.

## Technologies

<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%233178C6.svg?style=for-the-badge&logo=typescript&logoColor=white"/><img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/><img alt="Vite" src="https://img.shields.io/badge/vite-%23007ACC.svg?style=for-the-badge&logo=vite&logoColor=white"/><img alt="SWC" src="https://img.shields.io/badge/swc-%23F7B93E.svg?style=for-the-badge&logo=swc&logoColor=white"/><img alt="Chrome Extension" src="https://img.shields.io/badge/chrome_extension-4285F4.svg?style=for-the-badge&logo=googlechrome&logoColor=white"/><img alt="CodeCov" src="https://img.shields.io/badge/codecov-%23ff0077.svg?style=for-the-badge&logo=codecov&logoColor=white"/><img alt="Prettier" src="https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=white"/><img alt="ESLint" src="https://img.shields.io/badge/eslint-%234B32C3.svg?style=for-the-badge&logo=eslint&logoColor=white"/><img alt="Jest" src="https://img.shields.io/badge/jest-%23C21325.svg?style=for-the-badge&logo=jest&logoColor=white"/>

</div>

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Installation

### Development Setup

1. Fork the repository
2. Clone the project
3. Navigate to `cd Background-Sounds`
4. Install dependencies with

```bash
npm install
```

5. Build the extension

```bash
npm run build
```

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **"Developer mode"** using the toggle in the top-right corner
3. Click **"Load unpacked"**
4. Select the `dist/` folder from the project directory
5. The extension icon should appear in your Chrome toolbar

### Using the Extension

- Click the extension icon in your Chrome toolbar to open the timer popup
- Use Start/Stop buttons to control the timer
- Use Clear button to reset the timer
- The timer keeps running even after you close the popup - reopening it
  shows the correct elapsed time, picking back up right where it left off

### Timer Persistence

Chrome discards a popup's entire in-memory state every time it closes, so
without extra handling, closing the popup would reset the timer back to
`0.00 seconds`. To prevent that, the extension persists `{ time, timerOn,
updatedAt }` to `chrome.storage.local` on every meaningful change (start,
stop, clear) and rehydrates it on mount. If a run was in progress when the
popup last closed, the elapsed wall-clock time since `updatedAt` is folded
back in on reopen, so the stopwatch reads as if it had kept counting the
whole time. This is why the extension requests the `"storage"` permission
in `public/manifest.json` - it's used exclusively for this local,
on-device persistence and nothing is sent off the device.

## Development

Run the development server:

```bash
npm run dev
```

Note: For Chrome extension development, you'll need to rebuild and reload the extension in Chrome after making changes.

### Repository Health

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server (runs as a regular webpage, not inside the extension popup - `chrome.storage` calls are automatically no-ops here). |
| `npm run build` | Type-check (`tsc`) then produce a production build in `dist/`. |
| `npm run typecheck` | Type-check only (`tsc --noEmit`), without a full bundle build - useful for a fast fail in CI/local dev. |
| `npm run lint` | ESLint across the project (`--max-warnings 0`, so any warning fails the command). |
| `npm run format` | Format `src/**/*.{ts,tsx}` in place with Prettier. |
| `npm run format:check` | Check Prettier formatting without writing any files. |
| `npm test` / `npm run test:watch` | Run the Jest test suite (optionally in watch mode). |
| `npm run test:coverage` | Run the test suite with coverage; enforces the thresholds in `jest.config.cjs`. |
| `npm run check` | Everything CI checks: build, format:check, lint, and test:coverage. |

A pre-commit hook (Husky + lint-staged) runs `eslint --fix` on staged
`*.{ts,tsx}` files automatically. CI (`.github/workflows/ci.yml`) runs
build/lint/test across Node 18/20/22, uploads coverage to Codecov, runs a
non-blocking `npm audit`, and packages a Chrome-Web-Store-ready `dist/` zip
artifact on every push to `main` or a version tag.

## Contributing

- **Thank you** for considering to contribute
- Feel free to submit feature requests, UI updates, bugs as issues.
- Checkout [Contribution Guidelines](./CONTRIBUTING.md) for more information.
- Have a feature request? Feel free to create a issue for it.

## Publishing to Chrome Web Store (Optional)

To publish this extension to the Chrome Web Store:

1. Create a developer account at [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Get a `dist/` zip, either:
   - Download the `background-sounds-extension` artifact from the latest
     successful run of the [CI workflow](https://github.com/Vaporjawn/Background-Sounds/actions/workflows/ci.yml)
     on `main` (or a version tag) - built automatically, no local steps
     needed, **or**
   - Build it yourself: `npm run build`, then zip the *contents* of `dist/`
     (not the `dist/` folder itself - `manifest.json` needs to be at the
     root of the archive)
3. Upload the zip file to the Chrome Web Store
4. Fill in the required store listing information
5. Submit for review

## Thanks to all Contributors 💪

Thanks a lot for contributing to Background Sounds.


[![Contributors](https://contrib.rocks/image?repo=vaporjawn/Background-Sounds)](https://github.com/vaporjawn/Background-Sounds/graphs/contributors)

### Inspiration

https://github.com/Utkarshn10/Focusly

### Stats

![GitHub package.json version](https://img.shields.io/github/package-json/v/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub pull requests](https://img.shields.io/github/issues-pr-closed/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/Vaporjawn/Background-Sounds?style=for-the-badge)
![GitHub watchers](https://img.shields.io/github/watchers/Vaporjawn/Background-Sounds?style=for-the-badge)

