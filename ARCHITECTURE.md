# Architecture

## Overview
This application is a client-side educational web app. It should run entirely in the browser, use no frontend framework, and keep the logic simple enough to inspect and maintain.

The app contains a static home page plus multiple static lesson pages that share styles, localization catalog, navigation, and pure domain helpers. It teaches neural network concepts starting from a single neuron.

## Required Technology

### Runtime
- HTML5
- CSS3
- modern browser with ES modules support
- JavaScript

### UI Model
- Web Components
- Custom Elements
- Shadow DOM only where encapsulation helps more than it hurts

### Application Style
- vanilla JavaScript
- zero runtime dependencies for MVP
- no framework
- no server required for MVP beyond a static file host or local static server

## Architectural Principles
- Keep the neuron model logic pure.
- Keep UI components dumb where possible.
- Treat inputs, weights, bias, and activation as explicit state, not implicit DOM state.
- Recompute from source state after edits instead of patching many derived values manually.
- Prefer clear data flow over clever abstractions.

## High-Level Architecture

### 1. Domain Layer
Pure logic for:
- computing weighted sum (z = w₁·x₁ + w₂·x₂ + ... + bias)
- applying sigmoid activation
- applying step-function activation (perceptron)

This layer should have no DOM access.

### 2. State Layer
The single-neuron lesson uses Pattern B (self-contained state). Its source state is:
- input A and input B values (user-adjustable)
- weight A, weight B, and bias values
- current activation function choice (sigmoid or step)
- current UI language

The neural-network lesson (Lesson 2) will use Pattern A with a centralized state layer in `src/state/`.

### 3. Presentation Layer
Web Components render the current state into:
- home page
- site navigation
- single-neuron lesson
- input fields for Feature A and Feature B
- weight/bias controls (sliders)
- calculation panel (weighted sum formula, activation result)

### 4. Interaction Layer
UI events mutate source state only. After any valid mutation:
1. recompute derived state
2. re-render affected components

## Project Structure

```text
/
  index.html
  lesson-single-neuron.html
  lesson-neural-network.html
  styles.css
  src/
    home-main.js
    single-neuron-main.js
    neural-network-main.js
    state/
      app-state.js
      recompute.js
    i18n/
      en.js
      es.js
      ca.js
      index.js
    domain/
      config.js
      neuron-model.js
    components/
      home-page.js
      site-nav.js
      single-neuron-lesson.js
      neural-network-lesson.js
    utils/
      ids.js
      formatters.js
```

## Data Model

### Neuron Model
A single artificial neuron is defined by:

```js
{
  inputA: 1.0,       // user-adjustable input
  inputB: 2.0,       // user-adjustable input
  weightA: 0.5,
  weightB: -0.3,
  bias: 0.1,
  activation: "sigmoid"   // or "step"
}
```

The neuron computes:
1. `z = weightA * inputA + weightB * inputB + bias`
2. `output = activationFunction(z)`

## Component Patterns

### Pattern B — Self-Contained (Lesson 1)

`single-neuron-lesson.js` owns its own `this.state` object:
```js
this.state = {
  locale: "en",
  inputA: 1.0,
  inputB: 2.0,
  weightA: 0.5,
  weightB: -0.3,
  bias: 0.1,
  activation: "sigmoid"
};
```

It calls domain functions directly, computes derived values inline, and re-renders via `this.innerHTML`.

### Pattern A — Centralized (Lesson 2 — planned)

`app-root` owns all state, sub-components receive state via property assignment and emit CustomEvents upward. State layer in `src/state/`.

## Testing Strategy

- Test pure domain logic with `node:test` + `node:assert/strict`
- Unit tests for `neuron-model.js`: weighted sum, sigmoid, step activation
- Integration tests for state recomputation (when Lesson 2 is added)
- Manual verification tests for UI rendering and locale switching
