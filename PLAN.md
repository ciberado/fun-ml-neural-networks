# Delivery Plan

## Overview
This project should be delivered in small phases. Each phase should leave the app in a usable state and reduce uncertainty before the next layer is added.

The plan below assumes the current `DESIGN.md` is the source of truth. The project starts with scaffolding and a single-neuron lesson. The multi-layer network lesson is planned but deferred for detailed design.

## Lesson 1: Single Neuron

### Goal
Teach that an artificial neuron is a simple computation: weighted sum + bias + activation → output.

### Deliverables
- separate static page at `lesson-single-neuron.html`
- input fields for Feature A and Feature B
- weight sliders for Feature A, Feature B, and bias
- activation function selector (sigmoid vs step)
- calculation panel showing weighted sum formula and activation result
- localized English, Spanish, and Catalan copy

### Test Gate
- unit tests for `neuron-model.js`: weighted sum, sigmoid, step
- manual check that sliders and inputs update the calculation in real time
- manual check that activation switch changes output behavior
- manual check that formula displays correct substituted values

## Lesson 2: Neural Network (TBD)

### Goal
Connect multiple neurons into a small feedforward network. Detailed design pending.

### Tentative Scope
- separate static page at `lesson-neural-network.html`
- a small hidden layer of 2-3 neurons
- forward propagation visualization
- comparison of single-neuron vs network outputs

## Phase 0: Foundation

### Goal
Set up the project structure and the static application shell for both lessons.

### Deliverables
- `index.html`
- `lesson-single-neuron.html`
- `lesson-neural-network.html` (placeholder)
- `styles.css` (shared with sibling project style)
- JavaScript module entry points
- initial Web Component registration
- shared navigation with locale picker
- empty neuron lesson layout

### Exit Criteria
- the app loads in a browser without console errors
- the layout is stable
- navigation switches between pages
- locale picker changes interface language

### Test Gate
- smoke-check that the app loads without console errors
- verify navigation links work
- verify locale switching updates visible text

## Phase 1: Core Neuron Logic

### Goal
Implement the pure neuron-model functions before building richer UI.

### Deliverables
- neuron-model functions:
  - `computeWeightedSum(inputA, inputB, weightA, weightB, bias)`
  - `sigmoid(z)`
  - `stepActivation(z, threshold)`
- feature config and constants

### Exit Criteria
- given inputs, weights, and bias, the code computes the weighted sum and activation output
- logic can run without the visual layer

### Test Gate
- unit tests for weighted sum computation
- unit tests for sigmoid (known inputs → expected outputs)
- unit tests for step activation (above/below threshold)
- unit tests for full computation pipeline

## Phase 2: Single Neuron UI

### Goal
Render the neuron with adjustable inputs, weight controls, and calculation panel.

### Deliverables
- input fields (number inputs) for Feature A and Feature B
- weight sliders (range inputs) for weight A, weight B, and bias
- activation function toggle (sigmoid / step)
- calculation panel showing:
  - weighted sum formula with values substituted
  - activation output (float for sigmoid, 0/1 for step)
- inline formula: `z = wA × A + wB × B + b = result`
- help (i) icons next to each section heading with ELI5 explanations in a modal

### Exit Criteria
- all controls render and are interactive
- sliders and number inputs update the state
- the calculation panel updates in real time as controls change — slider drags remain smooth (incremental DOM updates, not full re-render)
- switching activation changes the output
- (i) icons are visible next to each section heading
- clicking an (i) icon opens a modal with an ELI5 explanation
- the modal closes via ✕, backdrop click, or Escape

### Test Gate
- manual check that all controls render
- manual check that slider ranges are [-2, 2] with step 0.1
- manual check that calculation panel formula matches expected output
- manual check that sigmoid output is between 0 and 1
- manual check that step output is exactly 0 or 1

## Phase 3: Polish

### Goal
Add teaching-oriented feedback and visual polish.

### Deliverables
- visual refinement for the classroom style
- (i) icon pulse animation on page load to call attention to help modals
- empty-state and edge-case handling
- reduced-motion handling
- responsive layout polish

### Exit Criteria
- the app is coherent and readable for classroom use

### Test Gate
- keyboard-only manual pass
- visual regression pass with default values
- mobile viewport manual pass
