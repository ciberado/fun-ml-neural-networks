# funlessons — fun-ml-neural-networks

## Headless Browser (Playwright / Puppeteer)

This container runs **Ubuntu 26.04**, which Playwright does not officially distribute Chromium builds for. To work around it:

```bash
# 1. Override the platform check so Playwright downloads Ubuntu 24.04's Chromium
echo 'export PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64' >> ~/.bashrc
source ~/.bashrc

# 2. Download Chromium via Playwright
npx playwright install chrome

# OR install Google Chrome directly (requires sudo)
# wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# sudo apt install -y ./google-chrome-stable_current_amd64.deb
```

Once either Playwright Chrome or Google Chrome is installed, you can:

```bash
# Playwright script (CommonJS)
cd /tmp && npm install playwright
node my-script.cjs

# Or Puppeteer (bundles its own Chromium)
cd /tmp && npm install puppeteer
node my-puppeteer-script.cjs
```

**Note:** `waitUntil: 'networkidle'` is deprecated in newer Puppeteer — use `'networkidle0'` instead.

## Build / Test / Lint

```bash
# From fun-ml-neural-networks/
npm install        # only if dependencies change (http-server is devDependency)
npm test           # run all Node.js built-in tests (node --test)
npm run serve      # start static server on :8080 (http-server --cors)

# Run a single test file
node --test tests/domain/neuron-model.test.js

# Run tests matching a pattern
node --test --test-name-pattern="sigmoid" tests/domain/neuron-model.test.js
```

No build step. No linter/formatter configured. The app is static — opening any `.html` file in a browser (or via `npm run serve`) is sufficient.

## Architecture

This is a **static, framework-free, multi-lesson teaching app**. It runs entirely in the browser — zero runtime dependencies, no build, ES modules imported directly.

**Purpose**: Teach neural network concepts (single neuron, weighted sum, activation functions, and multi-layer networks) through interactive visual lessons on a tiny classification dataset.

### Layer Stack (top to bottom)

```
HTML Entry Points  ← index.html, lesson-single-neuron.html, lesson-neural-network.html
Components         ← Web Components (Custom Elements), event emitters
State Management   ← Immutable source state → deriveState → derived state
Domain Logic       ← Pure functions, no DOM access, testable in Node
Data / Config      ← Static dataset, feature config, constants
```

### Two Component Patterns

- **Pattern B — Self-contained** (Lesson 1, Single Neuron): The lesson component owns its own local state, calls domain functions directly, renders inline HTML. No separate state layer.
- **Pattern A — Centralized** (Lesson 2, Neural Network — future): `app-root` owns all state, sub-components receive state via property assignment and emit CustomEvents upward. State layer in `src/state/`.

### Data Flow

```
User Action → CustomEvent (bubbles) → State Owner catches → action(oldState) → deriveState() → render() → state passed down to children via .state property
```

Locale changes use `window.dispatchEvent("app-locale-change")` so all components re-render regardless of DOM hierarchy.

## Key Files & Directories

```
fun-ml-neural-networks/
├── index.html                        # Home page
├── lesson-single-neuron.html         # Lesson 1 entry
├── lesson-neural-network.html        # Lesson 2 entry (placeholder)
├── styles.css                        # All CSS (single file)
├── package.json                      # npm scripts & devDependencies
├── .github/workflows/pages.yml       # CI: deploys to GitHub Pages on push to main
├── src/
│   ├── home-main.js                  # Bootstrap: Home page
│   ├── single-neuron-main.js         # Bootstrap: Lesson 1
│   ├── neural-network-main.js        # Bootstrap: Lesson 2
│   ├── domain/
│   │   ├── config.js                 # Constants (activation threshold, weight/bias limits)
│   │   └── neuron-model.js           # Weighted sum, sigmoid, step activation
│   ├── state/
│   │   ├── app-state.js              # State actions + deriveState wrapper
│   │   └── recompute.js              # Full recompute pipeline
│   ├── components/
│   │   ├── site-nav.js               # Nav + locale picker (used by all pages)
│   │   ├── home-page.js              # Home page listing
│   │   ├── single-neuron-lesson.js   # Pattern B lesson (Lesson 1)
│   │   └── neural-network-lesson.js  # Pattern A lesson (Lesson 2)
│   ├── i18n/
│   │   ├── index.js                  # getMessages(), detectInitialLocale(), resolveLocale()
│   │   ├── en.js / es.js / ca.js     # Message catalogs (identical key structure)
│   └── utils/
│       ├── ids.js                    # Monotonic unique ID generator
│       └── formatters.js             # formatDecimal, formatPercent
├── tests/
│   ├── domain/                       # Pure logic tests (neuron-model)
│   ├── state/                        # Recompute + locale tests
│   └── utils/                        # Formatter tests
├── docs/                             # Generated architecture docs
├── ARCHITECTURE.md                   # Architecture spec (authoritative)
├── DESIGN.md                         # Product/UX requirements
└── PLAN.md                           # Delivery phases with test gates
```

## Coding Conventions

- **JavaScript style**: 2-space indent, ES modules, kebab-case filenames (`single-neuron-lesson.js`)
- **No framework**: Vanilla JS Custom Elements only, no Shadow DOM
- **Domain functions**: Pure, no DOM access. Take plain objects, return plain objects. Throw on invalid input.
- **State**: Immutable. Every mutation returns a new object. Use `structuredClone` for deep cloning, spread for shallow.
- **Components**: Full re-render via `this.innerHTML` for structural changes (locale switch, reset). Incremental display updates via `updateDisplay()` for slider drags — updates only the formula, activation output, and slider readouts via `textContent` without replacing the DOM tree, keeping slider interaction smooth.
- **Events**: Custom DOM events with `bubbles: true`, payload in `event.detail`. Listen on `this` for child events, on `window` for `app-locale-change`.
- **Click delegation**: Buttons use `data-action` attributes. Handler checks `event.target.closest("[data-action]")?.dataset.action`. Help (i) icons use `data-help-key` attributes and are handled separately in `handleClick` before the action-button path.
- **Naming**: `handleEvent` for general event dispatch, `handleLocaleChange` for locale, `handleClick` for clicks.
- **Error handling**: State actions throw. The orchestrator catches, stores the message in `this.notice`, and re-renders to show a status banner.
- **i18n**: All visible strings via `getMessages(locale)`. Catalogs are plain JS objects with identical structure across `en/es/ca`. Parameterized strings use arrow functions.
- **Tests**: Use `node:test` + `node:assert/strict`. Import from `describe/it` or `test`. Descriptive names.

## Git Workflow

- **Branch**: `main` only
- **Commit style**: Short imperative messages
- **CI**: On push to `main`, GitHub Actions deploys to GitHub Pages

## Tips for AI Agents

### Adding a new lesson
Follow `docs/lesson-blueprint.md` step-by-step. The checklist at the bottom is authoritative. Start with Pattern B (self-contained component) unless you need 4+ synchronized sub-components.

### Common pitfalls
- **Domain functions must not touch DOM.** If a test fails because `document` is undefined, you're importing a component into domain logic.
- **All three locale files must have identical key structure.** Missing a key in `es.js` causes `TypeError` at runtime when the user switches to Spanish.
- **`structuredClone` the dataset** if your lesson mutates it. The default `DATASET` is shared.
- **`setLocale()` does not trigger re-render on its own.** Components must listen for `window` `app-locale-change`.
- **`removeEventListener` in `disconnectedCallback`** for all listeners — especially `window` ones. Forgetting this leaks handlers when the component is recreated.

### Where to look
- **How a user action flows through the system**: `single-neuron-lesson.js` `handleEvent()` → local state update → `render()` or `updateDisplay()`
- **Help modal flow**: icon `[data-help-key]` → `handleClick` → `openHelp(key)` → fills modal overlay via `textContent` → sets `overlay.hidden = false` → close via Escape/backdrop/✕
- **How a component emits state**: look for `this.dispatchEvent(new CustomEvent(...))`
- **How a component receives state**: look for `set state(nextState)` or `this.querySelector("...").state = ...`
- **Test patterns**: `tests/domain/neuron-model.test.js` for unit tests
