# Architecture

This project follows the architecture described in the parent `ARCHITECTURE.md`.

Key points:
- **Static, framework-free**: HTML + CSS + vanilla JS Web Components
- **Domain logic**: Pure functions in `src/domain/`, testable without a browser
- **Components**: Custom Elements with `innerHTML` re-render pattern
- **State**: Pattern B (self-contained) for Lesson 1; Pattern A (centralized) for Lesson 2 (planned)

## Component Tree

```
index.html
└── home-page
    └── site-nav

lesson-single-neuron.html
├── site-nav
└── single-neuron-lesson
    ├── input fields (Feature A, Feature B)
    ├── weight sliders (Weight A, Weight B)
    ├── bias slider
    ├── activation toggle (sigmoid / step)
    ├── calculation panel (formula + result)
    ├── (i) help icons per section (inputs, weights, bias, activation)
    └── help modal overlay (hidden until triggered)

lesson-neural-network.html
├── site-nav
└── neural-network-lesson (placeholder)
```

## Domain Modules

- `neuron-model.js`: `computeWeightedSum`, `sigmoid`, `stepActivation`, `computeNeuron`
- `config.js`: Constants for weight/bias ranges, activation types, defaults

## Rendering Strategy

The lesson uses two rendering paths:
- **`render()`** — full `innerHTML` replacement. Used on first load, locale change, and reset. Structural changes need a fresh DOM.
- **`updateDisplay()`** — incremental updates via `querySelector` + `textContent`. Used during slider drags. Updates only the formula text, activation output value, slider readouts, and toggle state without replacing the DOM, preserving the active slider element.

## Help Modals

Each section heading in the controls panel has a `data-help-key` button (ⓘ). Clicking it triggers `openHelp(key)` which looks up the matching title and body from the i18n `help` section, sets them on the modal overlay elements, and removes `hidden`. Three close paths: ✕ button (`data-action="close-help"`), backdrop click (click on overlay but outside dialog), and Escape key (`handleKeyDown`).

## i18n

Three catalogs (`en`, `es`, `ca`) with identical key structure. The `i18n/index.js` module provides `getMessages()`, `detectInitialLocale()`, `resolveLocale()`, `storeLocale()`, and `LOCALE_OPTIONS`.

Locale changes dispatch `window` `app-locale-change` event. All components listen for this event and re-render.
