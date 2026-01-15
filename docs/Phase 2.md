# PHASE 2 — Planning (Decision + Routes)

## 2.0 Read Prior Phases

✅ Read `docs/Phase 1.md`

**Key Evidence to Reference:**
- Current app: React 18 + Vite 4.5 + TypeScript SPA
- Uses React Router BrowserRouter (incompatible with extensions)
- No manifest.json exists
- No extension icons exist
- Timer component is self-contained and functional
- Vite config needs extension-specific modifications

---

## 2.1 Decision Tree (Route Selector)

### Route A: Minimal Conversion (Chosen)
**Condition:** App has simple, self-contained functionality that works in popup context
**When to use:** ✅ Current app is a timer - perfect for popup
**Characteristics:**
- Remove React Router entirely
- Create manifest.json with popup action
- Modify Vite config to copy manifest + icons
- Preserve all existing components
- Simplify main.tsx and App.tsx

### Route B: Multi-Page Extension with Background Service Worker
**Condition:** App needs persistent background processes, storage sync, or multiple pages
**When NOT to use:** ❌ Current app is single-page with local state only
**Characteristics:**
- Would require background service worker
- Complex message passing between popup and background
- Unnecessary for simple timer functionality

### Route C: Content Script Injection Extension
**Condition:** Extension needs to interact with web page DOM
**When NOT to use:** ❌ Timer doesn't need webpage interaction
**Characteristics:**
- Injects into active tabs
- Modifies webpage content
- Not applicable for standalone timer

---

## 2.2 Chosen Route: Route A - Minimal Conversion

**Why This Route:**
1. **Evidence from PHASE 1:** App has single page with self-contained timer
2. **Chrome Extension Pattern:** Popup extensions are ideal for standalone tools
3. **Simplicity:** Minimal changes preserve existing functionality
4. **Best Practice:** Web research confirmed popup pattern for tool-type extensions

**Alignment with Repo Conventions:**
- Maintains existing component structure
- Preserves React + TypeScript + Vite stack
- Keeps Jest testing setup
- Retains ESLint/Prettier configuration

---

## 2.3 Step-by-Step Plan

### Step 1: Create Extension Manifest
**What:** Create `public/manifest.json` with Manifest V3 specification
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/public/manifest.json`
**Why:** Chrome extensions require manifest.json (Evidence: PHASE 1.2 web research)
**Acceptance Criteria:**
- manifest_version: 3
- name, version, description present
- action.default_popup: "index.html"
- icons object with 48px and 128px sizes
- Empty permissions array (no special permissions needed)

### Step 2: Create Extension Icons
**What:** Create basic icon assets for the extension
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/public/icons/`
**Why:** Manifest requires icon references (Evidence: PHASE 1.2 manifest requirements)
**Acceptance Criteria:**
- icon-48.png (48x48 pixels)
- icon-128.png (128x128 pixels)
- Simple, recognizable design (timer or clock theme)
- Referenced correctly in manifest.json

### Step 3: Modify Vite Configuration
**What:** Update vite.config.ts to copy manifest and icons to dist/
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/vite.config.ts`
**Why:** Vite must include manifest.json and icons in build output (Evidence: PHASE 1.2 build patterns)
**Acceptance Criteria:**
- Install vite-plugin-static-copy (or equivalent)
- Configure plugin to copy public/manifest.json → dist/manifest.json
- Configure plugin to copy public/icons/ → dist/icons/
- Build output includes all required extension files

### Step 4: Remove React Router
**What:** Eliminate react-router-dom dependency and routing logic
**Where:**
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/routes.tsx` (delete)
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/App.tsx` (simplify)
- `/Users/victorwilliams/Documents/GitHub/Background-Sounds/package.json` (remove dependency)
**Why:** BrowserRouter incompatible with popup context (Evidence: PHASE 1.2 technical requirements)
**Acceptance Criteria:**
- routes.tsx deleted
- react-router-dom removed from package.json
- App.tsx directly renders HomePage component
- No routing logic remains

### Step 5: Simplify Application Structure
**What:** Make App.tsx render content directly without routing abstraction
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/App.tsx`
**Why:** Single popup page doesn't need routing (Evidence: existing single-page app from PHASE 1)
**Acceptance Criteria:**
- App component directly renders HomePage content
- No unnecessary abstraction layers
- Maintains existing component hierarchy

### Step 6: Update Package Scripts
**What:** Modify npm scripts to reflect Chrome extension workflow
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/package.json`
**Why:** Extension loading differs from web deployment (Evidence: PHASE 1.2 loading instructions)
**Acceptance Criteria:**
- Remove or comment gh-pages deployment scripts
- Keep build script unchanged (still outputs to dist/)
- Add helpful extension loading instructions to README

### Step 7: Update README with Extension Instructions
**What:** Replace GitHub Pages deployment info with extension loading steps
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/README.md`
**Why:** Installation process changes for Chrome extensions (Evidence: PHASE 1.2 loading pattern)
**Acceptance Criteria:**
- Instructions for enabling Developer mode
- Steps to load unpacked extension from dist/
- Chrome Web Store publishing guidance (optional future step)
- Remove GitHub Pages deployment instructions

### Step 8: Adjust Popup Sizing (Optional Enhancement)
**What:** Add explicit dimensions for popup window
**Where:** `/Users/victorwilliams/Documents/GitHub/Background-Sounds/src/index.css` or new popup.css
**Why:** Chrome extension popups have size constraints
**Acceptance Criteria:**
- Body width: 400px (typical popup width)
- Body height: 600px max (or auto)
- Responsive within popup constraints
- Footer doesn't overflow

---

## 2.4 Assumption Checkpoint

### Assumptions Validated by Recon ✅

1. **React/TypeScript/Vite compatible with Chrome extensions**
   - Validated: PHASE 1.2 web research shows multiple successful implementations

2. **Timer component will work in popup context**
   - Validated: Local state with setInterval works in popup environment

3. **No background service worker needed**
   - Validated: Timer uses only local state, no persistence required

4. **Existing component structure can be preserved**
   - Validated: PHASE 1.1 shows clean component separation

5. **Build output to dist/ is correct pattern**
   - Validated: PHASE 1.2 confirms dist/ folder for unpacked extensions

### Assumptions Still Unverified ⚠️

None. All critical assumptions validated through web research and codebase analysis.

---

## 2.5 Dependencies and Prerequisites

**Before Implementation:**
- ✅ All package dependencies already installed (React, Vite, TypeScript)
- ⚠️ Need to install: `vite-plugin-static-copy` for manifest copying
- ✅ No API keys or external services required
- ✅ Icon creation can use simple placeholder SVG → PNG conversion

**Potential Blockers:**
- None identified. All requirements can be satisfied from research evidence.

---

## 2.6 Persist Phase

Writing full PHASE 2 content to `docs/Phase 2.md` ✓