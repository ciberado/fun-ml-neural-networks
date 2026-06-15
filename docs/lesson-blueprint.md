# Lesson Blueprint

Use this blueprint when adding a new lesson to the neural-network app.

## Step-by-step

1. **Create the HTML entry point** (`lesson-<name>.html`)
   - Include `<site-nav></site-nav>` at top
   - Include `<lesson-component-name></lesson-component-name>` for the main element
   - Import `./src/<name>-main.js` as a module script

2. **Create the bootstrap JS** (`src/<name>-main.js`)
   - Import `site-nav.js` and the lesson component
   - No other logic needed

3. **Choose a pattern**

   **Pattern B (self-contained)** — for lessons with simple local state:
   - The component owns `this.state` directly
   - Calls domain functions inline in `render()`
   - Handles events via `data-*` attributes and click delegation
   - See `single-neuron-lesson.js` for example

   **Pattern A (centralized)** — for lessons needing 4+ synchronized sub-components:
   - Create an `app-root` component that owns state
   - Sub-components receive state via `.state` property assignment
   - Sub-components emit CustomEvents upward
   - State layer in `src/state/app-state.js` and `recompute.js`

4. **Create the domain logic** in `src/domain/<name>.js`
   - Pure functions only — no DOM access
   - Tests must run in Node without a browser

5. **Add constants** to `src/domain/config.js` if needed

6. **Add i18n strings** to all three locale files
   - `src/i18n/en.js`, `es.js`, `ca.js`
   - All three must have identical key structure
   - Use arrow functions for parameterized strings
   - Update `navigation.links` if adding nav entries

7. **Add help modals** (if the lesson has conceptual sections)
   - Add a `help` section to all three locale files with `inputsTitle`, `inputsBody`, `weightsTitle`, etc.
   - Add `data-help-key` buttons next to section headings in the component's `render()`
   - Wire `openHelp(key)` and `closeHelp()` methods in the component
   - Add modal overlay HTML at the end of the page shell

8. **Write tests** in `tests/domain/<name>.test.js`
   - Use `node:test` + `node:assert/strict`
   - Test pure logic functions
   - Descriptive test names

8. **Update docs**
   - `AGENTS.md` — update file listing
   - `ARCHITECTURE.md` — update project structure and component tree
   - `DESIGN.md` — document lesson flow and design decisions
   - `PLAN.md` — add phase with deliverables and test gates

9. **Update navigation** in `src/components/site-nav.js`
   - Add link to `LINKS` array
   - Update i18n `navigation.links` keys

10. **Verify**
    - `npm test` passes
    - `npm run serve` — open in browser, no console errors
    - Switch languages — all text updates
    - Test on mobile viewport

## Checklist

- [ ] HTML entry point created
- [ ] Bootstrap JS created
- [ ] Pattern chosen (B for self-contained, A for centralized)
- [ ] Component JS created with proper event handling and locale support
- [ ] Domain logic implemented as pure functions
- [ ] Constants added to config.js
- [ ] i18n strings added to en.js, es.js, ca.js (identical structure)
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Navigation updated
- [ ] Help icons and modals added (if applicable)
- [ ] `npm test` passes
- [ ] Browser smoke test passes
- [ ] Locale switching works
- [ ] Help modals render correctly in all locales
- [ ] Mobile viewport acceptable
