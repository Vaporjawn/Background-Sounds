# Contributing Guidelines

This documentation contains a set of guidelines to help you during the contribution process.

**No Contribution is small. Every contribution counts**

# How to contribute 👩‍💻👨‍💻

## Find an issue

- Take a look at the existing issues or create you own issues.
- If you want to work on an issue and someone else is not working on it, comment that you would like to contribute to it.

## Fork the Project

- Fork this Repository. This will create a Local Copy of this Repository on your Github Profile. Keep a reference to the original project in remote upstream.

```
$ git clone https://github.com/<your-username>/Background-Sounds.git
$ cd <repo-name>
$ git remote add upstream https://github.com/Vaporjawn/Background-Sounds.git
```

- Update your forked repo before working.

```
$ git remote update
$ git checkout <branch-name>
$ git rebase upstream/<branch-name>
```

## Branch name

- Create a new branch. Name the branch same as the issue you are working on.

```
# It will create a new branch with name Branch_Name and will switch to that branch
$ git checkout -b branch_name
```

## Work on the assigned issue

- Work on the assigned issue(s)
- Add the files/folder needed

```
# To add all new files to branch Branch_Name
$ git add .

# To add only a few files to Branch_Name
$ git add <some files>
```

### Project structure

- `src/frontend/pages/` - top-level pages (currently just the popup's `HomePage`).
- `src/frontend/components/` - UI components. The timer feature lives under
  `src/frontend/components/timer/`, split into `api/` (state-transition
  functions like `startTimer`/`stopTimer`/`clearTimer`, plus
  `chrome.storage` persistence in `timerStorage.ts`) and `components/`
  (the Start/Stop/Clear buttons).
- `src/types/` - shared TypeScript type aliases (e.g. `UseStateBoolean`,
  `UseStateNumber`). This is a client-only extension with no backend, so
  don't reintroduce a `src/backend/` split.
- `public/manifest.json` - the Chrome extension manifest (permissions,
  icons, popup entry point).

### Testing

- Tests are colocated with the code they test, using a `.test.ts` /
  `.test.tsx` suffix (e.g. `footer.tsx` + `footer.test.tsx`), not gathered
  into a separate top-level test folder.
- We use Jest + `@testing-library/react`. Prefer testing observable
  behavior (rendered text, button roles, click handlers) over
  implementation details.
- `jest.config.cjs` enforces minimum coverage thresholds
  (`coverageThreshold`) - `npm run test:coverage` fails if a change drops
  coverage below them.
- Code that touches `chrome.storage` should mock the `chrome` global (see
  `src/frontend/components/timer/api/timerStorage.test.ts` for the
  pattern) rather than requiring the extension environment.
- Before opening a PR, run `npm run check` (build, format check, lint,
  test:coverage - see the README's "Repository Health" section) to make
  sure it passes everything CI will run.

## Commit the changes

- Commit the changes made

```
# This message get associated with all files you have changed
$ git commit -m "message"
```

## Pull Request

- Go to your repository in the browser and click on compare and pull requests. Then add a title and description to your pull request that explains your contribution.
- Create a Pull Request by clicking on the "Create pull request" button
