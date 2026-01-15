# PHASE 1 — Reconnaissance (Evidence Only)

## 1.1 Codebase Recon

### 🔍 Search Terms Used
- `audio|sound|play|media` (grep search)
- File structure inspection
- Package dependencies analysis

### 📁 Files and Folders Inspected (Exact Paths)

**Configuration Files:**
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/package.json`
  - React 18 + Vite 4.5 + TypeScript app
  - Build target: GitHub Pages deployment (gh-pages package)
  - Test framework: Jest with jsdom environment
  - No actual audio/sound functionality - only a timer component

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/vite.config.ts`
  - Basic Vite config with React SWC plugin only
  - No special build configurations for Chrome extensions

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/index.html`
  - Standard SPA entry point with root div
  - Loads `/src/main.tsx` as module entry

**Application Source Files:**
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/main.tsx`
  - Standard React 18 ReactDOM.createRoot pattern
  - Mounts to `#root` element

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/App.tsx`
  - Minimal wrapper that renders `<Routes />` component

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/routes.tsx`
  - Uses React Router v6 with BrowserRouter
  - Single route: `/` → HomePage

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/pages/homePage.tsx`
  - Displays Header, Footer, Timer components
  - Shows Vite and React logos with external links

**Component Files:**
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/header.tsx`
  - Simple header with "Background Sounds" title

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/footer.tsx`
  - Fixed footer at bottom with copyright text

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/timer/timer.tsx`
  - useState for time (number) and timerOn (boolean)
  - useEffect with setInterval incrementing by 0.01 every 10ms
  - Displays time in seconds with 2 decimal places
  - Renders Start, Stop, Clear buttons conditionally

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/timer/components/timerStartButton.tsx`
  - Shows button when timer is not running
  - Calls `startTimer` API function

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/timer/components/timerStopButton.tsx`
  - Shows button when timer is running
  - Calls `stopTimer` API function

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/frontend/components/timer/components/timerClearButton.tsx`
  - Shows button when timer is not running
  - Calls `clearTimer` API function

**Backend/API Structure:**
- Timer API functions (startTimer, stopTimer, clearTimer) exist but not inspected yet
- Type definitions for useState helpers (UseStateBoolean, UseStateNumber)

**Assets:**
- `/public/vite.svg`
- `/src/assets/react.svg`

### 📌 What Each File Does (Factual Summary)

**Current Application State:**
1. This is a **web application**, not a Chrome extension
2. **Core functionality**: A simple timer that counts seconds with Start/Stop/Clear buttons
3. **No audio/sound features** despite the name "Background Sounds"
4. Uses React Router for SPA navigation (single homepage route)
5. Designed for GitHub Pages deployment
6. Has CI/CD workflows for installation, build, linting, testing, security scanning

**Architecture Pattern:**
- Standard React SPA structure
- Component composition with logical separation
- API layer pattern (separate API functions from components)
- Custom type definitions for common patterns

### 🔗 Existing Patterns or Shared Components

**State Management:**
- Local React useState (no global state library)
- Custom type definitions: `UseStateBoolean`, `UseStateNumber`

**Component Structure:**
- Feature-based folders: `/frontend/components/timer/`
- Separation of UI components and API logic
- Conditional rendering pattern for button visibility

**Testing:**
- Jest configuration present
- Single test file: `/src/tests/test.test.ts`

### 🧪 Related Tests Found

- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/tests/test.test.ts` (not yet inspected)
- Jest config: `/Users/victorwilliams/Documents/GitHub/Background-Sounds/jest.config.cjs`
- Coverage reports exist in `/coverage/` directory

---

## 1.2 Web Recon (Mandatory - External Chrome Extension Requirements)

### 🔎 Queries Performed
1. "chrome extension manifest v3 react typescript vite setup 2024"
2. "chrome extension action default_popup how to use with vite build dist folder"
3. Fetch from official Chrome documentation: https://developer.chrome.com/docs/extensions/mv3/manifest/

### 📚 Sources Consulted

**Primary Source - Official Chrome Documentation:**
- Chrome Manifest V3 documentation (developer.chrome.com)
- Retrieved comprehensive manifest structure and requirements

**Secondary Sources - Community Implementation Patterns:**
- Multiple Medium articles on React + Vite Chrome extensions
- GitHub boilerplate: Jonghakseo/chrome-extension-boilerplate-react-vite
- AllKeep.org guide for React/TypeScript/Vite Chrome extensions

### 📌 Relevant Takeaways

**Chrome Extension Manifest V3 Requirements:**

1. **Required Keys (Platform):**
   - `manifest_version`: Must be `3`
   - `name`: Extension name (max 75 chars)
   - `version`: Semantic version string

2. **Required Keys (Chrome Web Store):**
   - `description`: Extension description (max 132 chars)
   - `icons`: Object with icon sizes (48px, 128px recommended)

3. **Key Optional Fields for This Use Case:**
   - `action`: Defines popup behavior
     - `default_popup`: Path to HTML file (e.g., "index.html")
     - `default_icon`: Icon shown in toolbar
   - `permissions`: Array of required permissions (empty array for basic popup)

**Vite + React Build Pattern for Chrome Extensions:**

1. **manifest.json Location:**
   - Must be in `dist/` folder after build
   - Vite should copy it during build process

2. **Popup Architecture:**
   - `action.default_popup` points to `index.html` in dist folder
   - Vite builds React app into `dist/index.html`
   - No need for React Router in popup context (single page)

3. **Build Output Structure:**
   ```
   dist/
     manifest.json
     index.html
     assets/
       *.js
       *.css
     icons/
   ```

4. **Loading Extension:**
   - Navigate to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

**Key Technical Requirements:**

1. **BrowserRouter Incompatibility:**
   - Chrome extension popups don't support browser history routing
   - Must remove React Router or use HashRouter/MemoryRouter
   - Best practice: Single-page popup without routing

2. **Build Configuration:**
   - Vite needs to copy manifest.json to dist/
   - Icons must be included in build output
   - No SPA history fallback needed

3. **Asset Paths:**
   - Must use relative paths in manifest
   - Vite base configuration might need adjustment

---

## 1.3 Evidence Summary

**Conversion Requirements Identified:**

1. ✅ **Existing React/TypeScript/Vite stack** - Compatible with Chrome extensions
2. ⚠️ **React Router BrowserRouter** - Must be removed (incompatible)
3. ⚠️ **No manifest.json** - Must be created with Manifest V3 format
4. ⚠️ **No icon assets** - Must create or source extension icons
5. ⚠️ **Vite config** - Must add manifest copying to build process
6. ✅ **Component structure** - Can be preserved
7. ✅ **Timer functionality** - Can be preserved
8. ⚠️ **GitHub Pages deployment** - No longer applicable (extensions use Chrome Web Store or manual loading)

**Functionality Status:**
- Current app is a simple timer, NOT a background sounds player
- Name "Background Sounds" suggests audio features were intended but not implemented
- Timer component is complete and functional

---

## 1.4 Persist Phase

Writing full PHASE 1 content to `docs/Phase 1.md` ✓