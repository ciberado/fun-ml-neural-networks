# Lesson 2: Neural Network Step-Through Visualization

## Objective

Create a **guided, animated, step-through lesson** that explains how a neural
network recognizes a handwritten digit. The lesson is a narrative — not an
interactive sandbox like Lesson 1. The user progresses through steps via
"Next" / "Previous" buttons, watching the network form, process data, make
errors, train, and improve.

**Target audience**: People with no prior ML knowledge. Accuracy is
sacrificed for intuitive visual understanding.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  [Site Nav]                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐   ┌────────────────────────────┐     │
│  │                    │   │  Input    Hidden1  Hidden2 │     │
│  │   DIGIT FRAME      │   │  Layer    Layer    Layer   │     │
│  │                    │   │                            │     │
│  │    ┌─┬─┬─┐         │   │  ○─────────○─────────○     │     │
│  │    │ │ │ │         │   │  ○───○───○───○───○───○     │     │
│  │    │ │█│ │   =4    │   │  ○   │   ○   │   ○───○     │     │
│  │    │ │ │ │         │   │  ○───○───○───○───○───○     │     │
│  │    └─┴─┴─┘         │   │  ○   │   ○   │   ○───○     │     │
│  │                    │   │  ○───○───○───○───○───○     │     │
│  │                    │   │  ○   │   ○   │   ○───○     │     │
│  │                    │   │  ○───○───○───○───○───○     │     │
│  │                    │   │  ○─────────○─────────○     │     │
│  │                    │   │                    OUTPUT  │     
│  │                    │   │                    LAYER   │     
│  │                    │   │          1 2 3 4 5 6 7 8 9 │
│  └────────────────────┘   └────────────────────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Step explanation text                               │    │
│  │                                                      │    │
│  │    [◀ Previous]  Step 3 of 8  [Next ▶]               │    │
│  │                                       [Pretrain]     │    │
│  └──────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Split

| Region | Width | Content |
|--------|-------|---------|
| Left panel | ~35% | Digit image frame, grid overlay, vector representation |
| Right panel | ~65% | Neural network SVG visualization (layers + connections) |
| Bottom bar | 100% | Step explanation text + navigation buttons |

---

## Digit & Pixel Grid Design

### Full Image: 12×12 binary pixels

The digit "4" drawn on a grid (`·` = 0, `#` = 1):

````
· · · · · · · # · · · ·
· · · · · · # # · · · ·
· · · · · # · # · · · ·
· · · · # · · # · · · ·
· · · # · · · # · · · ·
· · # · · · · # · · · ·
· · # # # # # # # # · ·
· · · · · · · # · · · ·
· · · · · · · # · · · ·
· · · · · · · # · · · ·
· · · · · · · # · · · ·
· · · · · · · # · · · ·
```

### 3×3 Subsection Grid (9 subsections)

Each subsection is 4×4 = 16 pixels. The 9 subsections map to the 9 input
neurons.

```
+---------+---------+---------+
| · · · · | · · · # | · · · · |
| · · · · | · · # # | · · · · |
| · · · · | · # · # | · · · · |
| · · · · | # · · # | · · · · |
+---------+---------+---------+
| · · · # | · · · # | · · · · |
| · · # · | · · · # | · · · · |
| · · # # | # # # # | # # · · |
| · · · · | · · · # | · · · · |
+---------+---------+---------+
| · · · · | · · · # | · · · · |
| · · · · | · · · # | · · · · |
| · · · · | · · · # | · · · · |
| · · · · | · · · # | · · · · |
+---------+---------+---------+
```

### Subsection Vectors (binary, 16 elements each)

Each subsection's 16 pixels are read row-by-row into a vector of 0s and 1s:

+-------------+------------------------------------------------+
| Subgrid     | Vector (row-major, # = 1, · = 0)               |
+-------------+------------------------------------------------+
| (0,0)       | 0 0 0 0  0 0 0 0  0 0 0 0  0 0 0 0             |
| (0,1)       | 0 0 0 1  0 0 1 1  0 1 0 1  1 0 0 1             |
| (0,2)       | 0 0 0 0  0 0 0 0  0 0 0 0  0 0 0 0             |
+-------------+------------------------------------------------+
| (1,0)       | 0 0 0 1  0 0 1 0  0 1 0 0  1 1 0 0             |
| (1,1)       | 0 0 0 1  0 0 0 1  0 0 0 1  1 1 1 1             |
| (1,2)       | 0 0 0 0  0 0 0 0  0 0 0 0  1 1 1 1             |
+-------------+------------------------------------------------+
| (2,0)       | 0 0 0 0  0 0 0 0  0 0 0 0  0 0 0 0             |
| (2,1)       | 0 0 0 1  0 0 0 1  0 0 0 1  0 0 0 1             |
| (2,2)       | 0 0 0 0  0 0 0 0  0 0 0 0  0 0 0 0             |
+-------------+------------------------------------------------+

### Vector Display

In Step 3, each subsection animates with a **vector visualization** next to it
— a small column of squares (white=0, dark=1) — revealing the pixel
values.

---

## Network Architecture

| Layer | Neurons | Description |
|-------|---------|-------------|
| **Input** | 9 (I0–I8) | One per subsection, receives the 16-element binary vector |
| **Hidden 1** | 6 (H1A–H1F) | Detects simple straight lines (vertical, horizontal, diagonal) |
| **Hidden 2** | 6 (H2A–H2F) | Detects crosses, angles, T-shapes, corners |
| **Output** | 9 (O1–O9) | One per digit class (1–9). Output is activation value 0.00–1.00 |

### Connection Topology

- **Input → Hidden 1**: Fully connected (9 × 6 = 54 connections)
- **Hidden 1 → Hidden 2**: Fully connected (6 × 6 = 36 connections)
- **Hidden 2 → Output**: Fully connected (6 × 9 = 54 connections)

**Visual**: Connections drawn as thin, semi-transparent SVG paths forming
bundles between layers. Not all 144 lines individually visible — drawn as
translucent ribbon bands that brighten during activation flow.

---

## The 10 Steps

### Step 0 — "The Digit"

**Left panel**: A clean 12×12 SVG pixel grid showing the digit "4" in dark
ink on a light background. A caption reads "This is a handwritten '4'."

**Right panel**: Blank (or a simple "?" icon with text "How does a computer
see this?")

**Bottom text**: "A computer doesn't see shapes — it sees numbers. Let's
build a neural network that learns to recognize this digit."

---

### Step 1 — "The Network Structure"

**Left panel**: Digit "4" still visible, no grid yet.

**Right panel**: Two vertical stacks of circles fade in.
- **Input layer** (9 circles, left side of right panel), labeled "Input
  Layer — One neuron per subsection"
- **Output layer** (9 circles, right side of right panel), labeled "Output
  Layer — One neuron per digit 1–9"

Each circle is a neuron. Output neurons are labeled "1" through "9".

**Bottom text**: "A neural network has layers of connected neurons. The
input layer receives the image. The output layer gives the answer —
which digit it thinks it sees."

---

### Step 2 — "Divide the Image"

**Left panel**: A 3×3 grid overlay appears on the digit, dividing it into
9 subsections. Each subsection subtly pulses in sequence to call attention.

**Right panel**: Remains (networks visible).

**Bottom text**: "We divide the image into 9 regions. Each region will be
examined separately."

---

### Step 3 — "From Pixels to Vectors"

**Left panel**: Subsections highlight one by one (staggered 300ms each).
When a subsection highlights, its **vector visualization** appears next to
it — a small column of 16 squares (white = 0, dark = 1), plus the text
representation `[0,0,0,1,0,0,1,1,0,1,0,1,1,0,0,1]` etc.

**Right panel**: Each input neuron gets labeled with its subsection's
vector summary (e.g., "3 ones", "5 ones", "0 ones").

**Bottom text**: "Each region is made of tiny pixels. Every pixel is
either ink (1) or paper (0). Each region becomes a vector of numbers."

---

### Step 4 — "Input Flows to Neurons"

**Left panel**: Subsection vectors still visible.

**Right panel**: Animated connection lines (9 lines) draw from each grid
subsection → its corresponding input neuron. Dashed stroke-dashoffset
animation.

**Bottom text**: "Each vector — each region — is sent to one input neuron.
The neuron receives the pixel values and gets activated."

---

### Step 5 — "Hidden Layers Appear"

**Right panel**:
- **Hidden Layer 1** (6 neurons) fades in between input and output.
  Label: "Hidden Layer 1 — Detects lines"
- Connection bundles draw from Input → Hidden 1.
- **Hidden Layer 2** (6 neurons) fades in to the right of Hidden 1.
  Label: "Hidden Layer 2 — Detects angles & crosses"
- Connection bundles draw from Hidden 1 → Hidden 2 → Output.

**Bottom text**: "Hidden layers sit between input and output. Layer 1
looks for simple lines — vertical, horizontal, diagonal. Layer 2 combines
those lines to find corners, crosses, and angles. This is how the network
'sees' patterns, step by step."

---

### Step 6 — "Forward Propagation (First Try)"

**Right panel**: Activations flow left to right through the network:
1. Input neurons light up (green glow) based on their subsection values.
2. Connection lines brighten in sequence as the signal propagates.
3. Hidden layer 1 neurons glow with moderate intensity.
4. Hidden layer 2 neurons glow.
5. Output layer neurons show activation values 0.00–1.00.

**Output values (pretrained, wrong)**:

| Neuron | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|--------|---|---|---|---|---|---|---|---|---|
| Value | 0.12 | 0.08 | 0.15 | 0.35 | 0.10 | 0.20 | **0.72** | 0.14 | 0.05 |

- Neuron **7** has the highest activation (0.72) — it pulses brightest
  with a pulsing ring animation.
- Neuron 4 (the correct answer) has only 0.35 — it glows dimly.

**Bottom text**: "The network processes the image through all layers ...
and predicts 7! That's wrong — the image is a 4. The network is
untrained. It needs to learn."

---

### Step 7 — "Training (Backpropagation)"

A **"Pretrain the model"** button appears below the explanation text.

When the user clicks it:

1. **Wave animation**: A golden/amber pulse starts from the **output
   layer**, sweeps left through Hidden Layer 2 → Hidden Layer 1 → Input
   Layer.
2. **Duration**: The wave travels right-to-left, repeating 3 times over
   ~3.5 seconds.
3. **Visual effect**: Each neuron lights up with a warm amber glow as the
   wave passes through it. Connection lines briefly flash bright gold.
4. **Sound metaphor**: Represent weight adjustments — "the network is
   learning from its mistake."

After the animation completes, auto-advance to Step 8.

**Bottom text** (during animation): "The network adjusts its connections
— from output back to input — learning to make better predictions."

---

### Step 8 — "The Correct Prediction"

Same as Step 6's animation (forward propagation), but now:

**Output values (trained, correct)**:

| Neuron | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|--------|---|---|---|---|---|---|---|---|---|
| Value | 0.08 | 0.05 | 0.12 | **0.88** | 0.07 | 0.15 | 0.30 | 0.10 | 0.03 |

- Neuron **4** has the highest value (0.88) — brightest glow, pulsing ring.
- Neuron 7 is now low (0.30).

**Bottom text**: "After training, the network correctly identifies the
digit 4! The connections have been adjusted so the right neuron fires."

---

## Neuron Activation Values (Hardcoded Lookup)

These are hardcoded for the pedagogical narrative. No real neural network
runs in the browser.

### Pre-training activation values

| Layer | Values |
|-------|--------|
| Input | From subsection vectors (0 or 1 per input neuron) |
| H1 | [0.22, 0.18, 0.35, 0.15, 0.12, 0.08] |
| H2 | [0.18, 0.12, 0.42, 0.28, 0.08, 0.05] |
| Output | [0.12, 0.08, 0.15, 0.35, 0.10, 0.20, 0.72, 0.14, 0.05] |

### Post-training activation values

| Layer | Values |
|-------|--------|
| Input | Same as pre-training (image hasn't changed) |
| H1 | [0.38, 0.42, 0.65, 0.52, 0.18, 0.10] |
| H2 | [0.45, 0.38, 0.72, 0.58, 0.22, 0.12] |
| Output | [0.08, 0.05, 0.12, 0.88, 0.07, 0.15, 0.30, 0.10, 0.03] |

---

## SVG Visualization Design

### Neuron circle (SVG `<circle>`)

```svg
<circle r="20" class="neuron" data-neuron="layer-idx" />
```

CSS classes for states:
- `.neuron` — base style (fill: light, stroke: muted)
- `.neuron-active` — lit up with green glow
- `.neuron-correct` — brightest green, pulsing ring (correct prediction)
- `.neuron-wrong` — red-orange glow (wrong prediction)
- `.neuron-training` — amber/gold pulse (during backprop)

### Connection paths

```svg
<path class="connection" d="M x1 y1 Q cx cy, x2 y2" />
```

- `.connection` — thin, semi-transparent
- `.connection-active` — thicker, brighter, with flow animation
- `.connection-training` — golden flash (backprop)

### Layer labels

SVG `<text>` elements positioned above each layer column.

### Output value labels

SVG `<text>` elements below each output neuron showing `0.88` etc.

### Digit image

SVG `<rect>` grid, 12×12, each cell 14px × 14px:
- `rect.fill = "#fff"` for 0 (paper)
- `rect.fill = "#20303c"` for 1 (ink)

### Grid overlay

SVG `<line>` strokes drawing the 3×3 grid boundaries over the pixel grid.

### Subsection vector

Small SVG column of 16 squares (6px × 6px each) positioned next to each
subsection, arranged as a vertical strip:
- White = 0, dark = 1

---

## Animation Specifications

| Step | Animation | CSS/JS | Duration |
|------|-----------|--------|----------|
| 1 | Layers fade in | CSS opacity transition | 600ms |
| 2 | Grid lines draw | stroke-dashoffset | 400ms |
| 3 | Subsections highlight in sequence | JS setTimeout + CSS class | 300ms each, 2.7s total |
| 3 | Vector reveal | CSS opacity | 200ms each |
| 4 | Connection lines draw | stroke-dashoffset animation | 1.5s |
| 5 | Hidden layers fade in + connections draw | CSS + stroke-dashoffset | 1s per layer |
| 6 | Activation pulse left→right | CSS animation chained via JS | 3s total |
| 6 | Output values appear | CSS fade-in | 200ms each |
| 6 | Wrong neuron pulses | CSS pulsing animation | continuous |
| 7 | Right→left training wave | JS animation loop, CSS classes | 3.5s (3 waves) |
| 8 | Same as Step 6 but correct neuron | Same animations | 3s |

### CSS Keyframe Animations

```css
@keyframes neuron-pulse {
  0%, 100% { filter: drop-shadow(0 0 4px var(--selected)); }
  50% { filter: drop-shadow(0 0 16px var(--selected)); }
}

@keyframes neuron-wrong {
  0%, 100% { filter: drop-shadow(0 0 4px var(--target)); }
  50% { filter: drop-shadow(0 0 20px var(--target)); }
}

@keyframes neuron-training {
  0%, 100% { filter: drop-shadow(0 0 4px var(--warning)); }
  50% { filter: drop-shadow(0 0 18px var(--warning)); }
}

@keyframes connection-flow {
  to { stroke-dashoffset: 0; }
}

@keyframes connection-training {
  0%, 100% { stroke: var(--line); }
  50% { stroke: var(--warning); stroke-width: 2.5; }
}
```

---

## Navigation & UI

### Element | Description
**"◀ Previous" button** | Goes back one step. Disabled at step 0.
**"Next ▶" button** | Advances one step. Disabled at step 8. Triggers step animation.
**Step counter** | "Step 3 of 8" displayed between buttons.
**"Pretrain the model" button** | Only visible at step 7. Triggers the backprop animation then auto-advances to step 8. Disabled during animation.
**"Restart" link** | Optional — resets to step 0.

### Button states:
- **Step 0**: [Previous disabled] Step 0 of 8 [Next ▶]
- **Step 7**: [◀ Previous] Step 7 of 8 [Next ▶] [Pretrain the model]
- **During training**: [all disabled while animation plays]
- **Step 8**: [◀ Previous] Step 8 of 8 [Next disabled]

---

## Files to Create / Modify

| File | Action | Description |
|------|--------|-------------|
| `lesson-neural-network.html` | — | Already exists, no changes needed |
| `src/neural-network-main.js` | — | Already imports component, no changes |
| `src/components/neural-network-lesson.js` | **Rewrite** | Full step-through lesson component (~600 lines) |
| `src/i18n/en.js` | **Update** | Add `neuralNetwork.steps[0-8]`, labels, button text |
| `src/i18n/es.js` | **Update** | Spanish translations for all new keys |
| `src/i18n/ca.js` | **Update** | Catalan translations for all new keys |
| `styles.css` | **Update** | Add neuron/connection/grid/layout CSS |
| `docs/lesson-2-plan.md` | **New** | This document |

---

## Component Architecture

### Pattern: B (Self-Contained)

The lesson component owns a simple state machine:

```js
this.state = {
  step: 0,       // 0-8
  locale: "en",
  animating: false,  // true during CSS/JS animations
  trained: false     // true after step 7 completes
};
```

### Key methods

| Method | Purpose |
|--------|---------|
| `render()` | Full re-render based on `this.state`. Called on locale change and step change. |
| `goToStep(n)` | Set step, trigger `render()`, then run step-specific animations (setTimeout chain). |
| `goNext()` / `goPrev()` | Bound to buttons, adjust step and re-render. |
| `animateStep6()` | JS animation chain: activate input → wait → activate H1 → wait → activate H2 → wait → activate output with wrong value. |
| `animateStep7()` | Run training wave (right→left) 3 times over 3.5s, then set `trained: true` and `goToStep(8)`. |
| `animateStep8()` | Same flow as step 6, but with post-training values and correct neuron highlighted. |
| `renderLeftPanel(step)` | Returns HTML for the left panel (digit, grid, vectors). |
| `renderRightPanel(step)` | Returns SVG for the network visualization. |
| `renderBottomBar(step)` | Returns HTML for explanation text + navigation + pretrain button. |
| `buildNetworkSvg(step)` | Constructs the SVG string with neurons, connections, labels, and activation classes. |

### Event handling

```js
handleClick(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "next") this.goNext();
  if (action === "prev") this.goPrev();
  if (action === "pretrain") this.animateStep7();
}
```

---

## i18n Key Structure

All new keys added under `neuralNetwork`:

```js
neuralNetwork: {
  eyebrow: "Lesson 2",
  title: "Connect neurons into a network",
  copy: "...",

  // Step-by-step content
  step0Title: "The Digit",
  step0Copy: "Here is a handwritten '4'. ...",

  step1Title: "The Network Structure",
  step1Copy: "Layers of connected neurons receive the image ...",

  // ... through step8

  // UI labels
  prev: "◀ Previous",
  next: "Next ▶",
  stepCounter: (current, total) => `Step ${current} of ${total}`,
  pretrain: "Pretrain the model",
  restart: "Restart",

  // Layer labels
  inputLayer: "Input Layer (9)",
  hiddenLayer1: "Hidden Layer 1 — Lines",
  hiddenLayer2: "Hidden Layer 2 — Angles & Crosses",
  outputLayer: "Output Layer",

  // Neuron labels
  outputNeuronLabel: (digit) => `${digit}`,

  // Help text (values and panels)
  inputNeuronHelp: "Each input neuron receives the 0s and 1s from one image region.",
  hiddenNeuronHelp: "Hidden neurons detect patterns ...",
  outputNeuronHelp: "Output neurons represent possible digits ...",
}
```

---

## Accessibility & Responsive

- **Reduced motion**: Respect `prefers-reduced-motion`. Skip complex
  animations; use instant state changes instead.
- **Keyboard navigation**: All buttons focusable and activatable via
  Enter/Space.
- **Screen readers**: `aria-label` on buttons, `aria-live="polite"` on
  step counter.
- **Responsive**: At ≤780px width, the layout switches to single column:
  digit frame on top, network visualization below.

---

## Implementation Order

1. Update i18n files (en, es, ca) with all new keys
2. Add CSS for the lesson (neuron, connection, grid, layout)
3. Rewrite `neural-network-lesson.js` with:
   - State machine and navigation
   - Left panel rendering (digit + grid + vectors)
   - Right panel rendering (SVG network)
   - Bottom bar with text and buttons
   - Step 6 activation animation
   - Step 7 training wave animation
   - Step 8 corrected inference animation
   - Help icon modal support (optional)
4. Test manually in browser via `npm run serve`
5. Verify locale switching

---

## Key Design Decisions

1. **No real neural computation**: All neuron values are hardcoded.
   The lesson explains the *concept*, not the math.

2. **SVG over Canvas**: Easier to animate via CSS and style consistently
   with the existing design system.

3. **Pattern B (self-contained)**: The state is simple (step + locale).
   Pattern A would be over-engineering for a guided narrative.

4. **12×12 pixel grid → 3×3 subsections**: Coarse enough to count manually,
   detailed enough to show a recognizable "4".

5. **Wrong answer = 7**: Visually similar to 4 (vertical + horizontal
   strokes), so it's a plausible mistake for an untrained network.

6. **Training = golden wave right→left**: Not mathematically accurate
   backpropagation, but conveys "learning = adjusting connections from
   output back to input" in a memorable visual.
