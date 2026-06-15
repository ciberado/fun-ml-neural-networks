# Neural Network Lessons Teaching App Design

## Summary
Build a small web application in vanilla JavaScript with Web Components that teaches how an artificial neuron works. The app should feel like a classroom exercise: visual, concrete, easy to manipulate, and easy to understand without advanced math background.

The lessons progress from a single artificial neuron toward a small multi-layer network. Lesson 1 focuses on the building block: one neuron with adjustable inputs, weights, bias, and activation. Lesson 2 (to be defined in detail later) will connect multiple neurons into a small feedforward network.

## Problem Statement
Neural networks are often introduced with complex math and abstract diagrams before learners see a concrete, interactive example they can reason about.

This project reverses that order:
- show a single neuron as a simple calculator
- make inputs, weights, and bias adjustable with sliders and inputs
- show the weighted sum step by step
- show the activation function output in real time
- let learners see how changing weights changes the output

## Product Goals
- Introduce the neuron as the fundamental building block of neural networks.
- Make weighted sum, bias, and activation functions understandable in minutes.
- Make the effect of each adjustment immediately visible.
- Let users freely adjust inputs, weights, and bias.
- Teach the neuron's computation before introducing multi-layer networks.
- Keep the implementation simple, modular, and framework-free.
- Let learners switch the interface between English, Spanish, and Catalan.

## Non-Goals
- Dataset-based classification or accuracy metrics.
- Explaining backpropagation or gradient descent in depth.
- Turning the app into a generic neural network tool.
- Persisting complex user work across sessions in MVP.

## Intended Audience
- Young learners with no advanced math background.
- Teachers who want a lightweight classroom demo.
- Beginners who need to see the math before the abstraction.

## Success Criteria
The design is successful if a first-time user can:
- identify the inputs, weights, and bias as the neuron's configurable parts
- explain what a weight does (amplifies or dampens an input)
- explain what the bias does (shifts the result up or down)
- understand the weighted sum calculation (z = w₁·x₁ + w₂·x₂ + b)
- understand what a sigmoid activation does (squashes to 0-1)
- understand what a step activation does (hard yes/no)
- see how weight changes affect the output value

## Lesson 1: Single Neuron

### Goal
Teach that an artificial neuron is a simple computation: weighted sum + bias + activation → output.

### Lesson Flow
1. The app shows the neuron with two input fields (Feature A, Feature B).
2. Three sliders control weight A, weight B, and bias.
3. The weighted sum formula is shown with live values: `z = wA × inputA + wB × inputB + bias`.
4. The activation output is shown — a float 0-1 for sigmoid, 0 or 1 for step.
5. An activation toggle switches between sigmoid and step.
6. All outputs update immediately on any slider or input change — the formula and result panel update incrementally without replacing the full DOM, so slider drags remain smooth.

### Help Modals
Each section heading in the controls panel (Inputs, Weights, Bias, Activation) has a small (i) icon. Clicking it opens a modal with an "explain like I'm five" description of that concept. Modals close via the ✕ button, clicking the backdrop, or pressing Escape. The (i) icons pulse with a green glow on page load to call attention.

### Interaction Principles
- Every input/weight/bias change must produce immediate visible feedback.
- The calculation must stay readable step by step.
- The formula should show actual numbers substituted, not just variable names.
- Help modals provide quick conceptual explanations without leaving the lesson.

## Lesson 2: Neural Network (TBD)

The second lesson will introduce a small multi-layer feedforward network. Detailed design will be defined later.

### Tentative Scope
- Connect 2-3 neurons in one hidden layer
- Show forward propagation through the network
- Introduce the concept of non-linear separability

## Design Decisions

### Core Product Shape
- The app is a sequence of lesson pages with shared navigation.
- Lesson 1 introduces one artificial neuron as the fundamental unit.
- No dataset — the neuron is self-contained with user-adjustable inputs.
- Lesson 2 connects multiple neurons into a small network.
- The app shares visual style and i18n infrastructure with the sibling `fun-ml-decision-trees` project.

### Neuron Constraints
- Two inputs (Feature A, Feature B) to keep the math visible.
- Input values adjustable via number fields (unbounded, step 0.1).
- Weights constrained to range [-2, 2] via sliders with step 0.1.
- Bias constrained to range [-2, 2] with step 0.1.
- Two activation options: sigmoid (smooth) and step (hard threshold at 0.5).

### Explanation Strategy
- The calculation panel favors a compact formula-like display over verbose prose.
- The formula shows: `z = wA × A + wB × B + b = result`.
- Short contextual text is allowed, but the UI should not narrate every step in sentence form.
- Each controls section has a (i) icon that opens a modal with an ELI5 explanation of the concept (inputs, weights, bias, activation).
- The (i) icons pulse on page load to draw attention to the available explanations.

### Styling Direction
- Same visual tone as the sibling decision-tree project: classroom-like, playful, approachable.
- Reuse the CSS custom properties and overall visual system.

### Persistence
- MVP is stateless across refreshes.
- No saved sessions required.
- Selected UI language does not persist across refreshes in MVP.
