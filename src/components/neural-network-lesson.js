import {
  detectInitialLocale,
  getMessages,
  resolveLocale
} from "../i18n/index.js";
import { formatDecimal } from "../utils/formatters.js";

// ============================================================
// Data: 12×12 pixel grid of digit "4"
// ============================================================
const DIGIT_4 = [
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,0,0,1,0,1,0,0,0,0],
  [0,0,0,0,1,0,0,1,0,0,0,0],
  [0,0,0,1,0,0,0,1,0,0,0,0],
  [0,0,1,0,0,0,0,1,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0]
];

// 9 subsection vectors (row-major, each 4×4 = 16 elements)
const SUB_VECTORS = [
  // (0,0) rows 0-3, cols 0-3
  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  // (0,1) rows 0-3, cols 4-7
  [0,0,0,1, 0,0,1,1, 0,1,0,1, 1,0,0,1],
  // (0,2) rows 0-3, cols 8-11
  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  // (1,0) rows 4-7, cols 0-3
  [0,0,0,1, 0,0,1,0, 0,0,1,1, 0,0,0,0],
  // (1,1) rows 4-7, cols 4-7
  [0,0,0,1, 0,0,0,1, 1,1,1,1, 0,0,0,1],
  // (1,2) rows 4-7, cols 8-11
  [0,0,0,0, 0,0,0,0, 1,1,0,0, 0,0,0,0],
  // (2,0) rows 8-11, cols 0-3
  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  // (2,1) rows 8-11, cols 4-7
  [0,0,0,1, 0,0,0,1, 0,0,0,1, 0,0,0,1],
  // (2,2) rows 8-11, cols 8-11
  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
];

// Input activation = count of 1s in each vector / 16
const INPUT_ACTIVATIONS = SUB_VECTORS.map(v => v.reduce((s, x) => s + x, 0) / 16);

// Hardcoded activation values for the narrative
const PRE_H1 = [0.22, 0.18, 0.35, 0.15, 0.12, 0.08];
const PRE_H2 = [0.18, 0.12, 0.42, 0.28, 0.08, 0.05];
const PRE_OUT = [0.12, 0.08, 0.15, 0.35, 0.10, 0.20, 0.72, 0.14, 0.05];

const POST_H1 = [0.38, 0.42, 0.65, 0.52, 0.18, 0.10];
const POST_H2 = [0.45, 0.38, 0.72, 0.58, 0.22, 0.12];
const POST_OUT = [0.08, 0.05, 0.12, 0.88, 0.07, 0.15, 0.30, 0.10, 0.03];

// Step 5: which hidden neurons show activation (looks like signal processing)
const STEP5_H1 = [false, true, false, true, false, false];
const STEP5_H2 = [false, true, true, false, false, false];

// Step 8: different mixture after training
const STEP8_H1 = [true, true, false, true, false, false];
const STEP8_H2 = [false, true, true, false, true, false];

// SVG geometry
const L = { vw: 580, vh: 440 };
const INPUT_X = 60, H1_X = 190, H2_X = 320, OUT_X = 460;
function inputY(i) { return 68 + i * 38; }
function hiddenY(i) { return 90 + i * 52; }
function outY(i) { return 68 + i * 38; }

// Generate SVG path data for all connections between two layers
function connPaths(x1, ys1, x2, ys2) {
  return ys1.map(y1 => ys2.map(y2 => `M${x1},${y1} L${x2},${y2}`)).flat().join(' ');
}

// ============================================================
// Component
// ============================================================
class NeuralNetworkLesson extends HTMLElement {
  constructor() {
    super();
    this.locale = detectInitialLocale();
    this.step = 0;
    this.trained = false;
    this.animating = false;
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.addEventListener("click", this.handleClick);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener("app-locale-change", this.handleLocaleChange);
    this.removeEventListener("click", this.handleClick);
  }

  handleLocaleChange(e) {
    this.locale = resolveLocale(e.detail?.locale);
    this.render();
  }

  handleClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "next") this.goNext();
    if (action === "prev") this.goPrev();
    if (action === "pretrain") this.animateTraining();
  }

  // ==========================================================
  // Step navigation
  // ==========================================================
  goNext() {
    if (this.animating || this.step >= 8) return;
    this.step++;
    this.render();
    // Trigger step-specific animations after render
    if (this.step === 3) this.animateVectors();
    if (this.step === 4) this.animateFeedInputs();
    if (this.step === 5) this.animateStep5();
    if (this.step === 6) this.animateForward(false);
    if (this.step === 8 && this.trained) this.animateForward(true);
  }

  goPrev() {
    if (this.animating || this.step <= 0) return;
    this.step--;
    this.trained = false;
    this.render();
  }

  // ==========================================================
  // Render
  // ==========================================================
  render() {
    const m = getMessages(this.locale);
    const nn = m.neuralNetwork;

    document.documentElement.lang = this.locale;

    this.innerHTML = `
      <div class="page-shell">
        <header class="hero">
          <p class="eyebrow">${nn.eyebrow}</p>
          <h1>${nn.title}</h1>
          <p class="hero-copy">${nn.copy}</p>
        </header>

        <div class="nn-layout">
          <div class="nn-left-panel">
            ${this.renderLeftPanel()}
          </div>
          <div class="nn-right-panel">
            ${this.renderRightPanel()}
          </div>
        </div>

        <div class="nn-bottom-bar">
          ${this.renderBottomBar()}
        </div>
      </div>
    `;
  }

  // ==========================================================
  // Left panel: digit + grid + vectors
  // ==========================================================
  renderLeftPanel() {
    const s = this.step;
    const showGrid = s >= 2;
    const showPixelNums = s >= 3 && s <= 4;  // 0/1 text inside cells
    const showVecRows = s >= 3 && s <= 4;     // vector rows below the grid
    const showSubBorders = s >= 3;            // subsection highlight borders
    const initHidden = s === 3;               // only step 3 starts with hidden items
    const cell = 22;
    const gridW = 12 * cell;
    const padding = 30;

    const vecAreaH = showVecRows ? (14 + 9 * 18 + 16) : 0;
    const svgW = padding * 2 + gridW;
    const svgH = padding * 2 + gridW + vecAreaH;

    let html = `<svg viewBox="0 0 ${svgW} ${svgH}" style="width:100%;height:auto;display:block;">`;

    // === PIXEL GRID ===
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        const on = DIGIT_4[r][c];
        const subIdx = Math.floor(r / 4) * 3 + Math.floor(c / 4);
        const px = padding + c * cell;
        const py = padding + r * cell;
        html += `<rect x="${px}" y="${py}" width="${cell}" height="${cell}" class="${on ? 'nn-pixel-on' : 'nn-pixel-off'}" />`;
        // 0/1 text inside cells (steps 3-4 only)
        if (showPixelNums) {
          const pStyle = (initHidden && subIdx > 0) ? 'opacity:0;' : '';
          html += `<text x="${px + cell / 2}" y="${py + cell - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="${on ? '#e8f0e8' : '#5a6a5a'}" data-pix="${subIdx}" style="${pStyle}">${on}</text>`;
        }
      }
    }

    // 3×3 grid overlay (steps 2+)
    if (showGrid) {
      for (let i = 1; i <= 2; i++) {
        const pos = padding + i * 4 * cell;
        html += `<line x1="${pos}" y1="${padding}" x2="${pos}" y2="${padding + gridW}" class="nn-grid-line" />`;
        html += `<line x1="${padding}" y1="${pos}" x2="${padding + gridW}" y2="${pos}" class="nn-grid-line" />`;
      }
    }

    // Subsection highlight borders (steps 3+)
    if (showSubBorders) {
      for (let si = 0; si < 9; si++) {
        const sr = Math.floor(si / 3);
        const sc = si % 3;
        const bx = padding + sc * 4 * cell;
        const by = padding + sr * 4 * cell;
        const sStyle = (initHidden && si > 0) ? 'opacity:0;' : '';
        html += `<rect x="${bx - 1.5}" y="${by - 1.5}" width="${4 * cell + 3}" height="${4 * cell + 3}" fill="none" class="nn-sub-highlight" data-sub="${si}" style="${sStyle}" />`;
      }
    }

    // Caption for step 0 only
    if (s === 0) {
      html += `<text x="${padding + gridW / 2}" y="${svgH - 10}" text-anchor="middle" font-size="15" fill="#5f6f78" font-weight="700">= 4</text>`;
    }

    // === VECTOR ROWS BELOW THE GRID (steps 3-4 only) ===
    if (showVecRows) {
      const vCell = 12;
      const vGap = 1;
      const rowH = vCell + 6;
      const labelW = 85;
      const rowY0 = padding + gridW + 14;

      for (let si = 0; si < 9; si++) {
        const sr = Math.floor(si / 3);
        const sc = si % 3;
        const vec = SUB_VECTORS[si];
        const rowY = rowY0 + si * rowH;
        const vStyle = (initHidden && si > 0) ? 'opacity:0;' : '';

        html += `<text x="${padding}" y="${rowY + vCell - 2}" font-size="12" fill="#444" font-weight="700" font-family="monospace" data-vec-row="${si}" style="${vStyle}">S(${sr},${sc}) = </text>`;

        for (let vi = 0; vi < 16; vi++) {
          const on = vec[vi];
          const cx = padding + labelW + vi * (vCell + vGap);
          const cy = rowY;
          html += `<rect x="${cx}" y="${cy}" width="${vCell}" height="${vCell}" class="${on ? 'nn-vec-on' : 'nn-vec-off'}" data-vec-row="${si}" style="${vStyle}" />`;
          html += `<text x="${cx + vCell / 2}" y="${cy + vCell - 3}" text-anchor="middle" font-size="10" font-weight="700" fill="${on ? '#fff' : '#888'}" data-vec-row="${si}" style="${vStyle}">${on}</text>`;
        }
      }
    }

    html += `</svg>`;
    return html;
  }

  // ==========================================================
  // Right panel: neural network SVG
  // ==========================================================
  renderRightPanel() {
    const m = getMessages(this.locale);
    const nn = m.neuralNetwork;
    const s = this.step;
    if (s === 0) {
      return `<svg viewBox="0 0 ${L.vw} ${L.vh}" style="max-width:100%;display:block;">
        <text x="${L.vw / 2}" y="${L.vh / 2}" class="nn-placeholder">${nn.step0Placeholder}</text>
      </svg>`;
    }

    const showInput = s >= 1;
    const showOutput = s >= 1;
    const showH1 = s >= 5;
    const showH2 = s >= 5;
    const showConnIO = s >= 5;
    const showConnH1 = s >= 5;
    const showConnH2 = s >= 5;

    const activated = s === 5 || s === 6 || s === 8;
    const trained = this.trained;

    // Which activation layer set to use
    const h1vals = trained ? POST_H1 : PRE_H1;
    const h2vals = trained ? POST_H2 : PRE_H2;
    const outVals = trained ? POST_OUT : PRE_OUT;

    const s5 = s === 5;
    const hideS5 = s5 ? 'opacity:0;' : '';

    let svg = `<svg viewBox="0 0 ${L.vw} ${L.vh}" style="max-width:100%;display:block;">`;

    // --- Connection paths ---
    const iYs = Array.from({ length: 9 }, (_, i) => inputY(i));
    const hYs = Array.from({ length: 6 }, (_, i) => hiddenY(i));
    const oYs = Array.from({ length: 9 }, (_, i) => outY(i));

    // Input → H1
    if (showConnIO && showH1) {
      const d = connPaths(INPUT_X, iYs, H1_X, hYs);
      svg += `<path d="${d}" class="nn-connection" data-conn="ih1" style="${hideS5}" />`;
    }
    // H1 → H2
    if (showConnH1 && showH2) {
      const d = connPaths(H1_X, hYs, H2_X, hYs);
      svg += `<path d="${d}" class="nn-connection" data-conn="h1h2" style="${hideS5}" />`;
    }
    // H2 → Output
    if (showConnH2) {
      const d = connPaths(H2_X, hYs, OUT_X, oYs);
      svg += `<path d="${d}" class="nn-connection" data-conn="h2o" style="${hideS5}" />`;
    }

    // --- Layer labels ---
    const labelY = 30;
    svg += `<text x="${INPUT_X}" y="${labelY}" class="nn-layer-label">${this.msg('inputLayer')}</text>`;
    if (showH1) svg += `<text x="${H1_X}" y="${labelY}" class="nn-layer-label" data-layer="h1" style="${hideS5}">${this.msg('hiddenLayer1')}</text>`;
    if (showH2) svg += `<text x="${H2_X}" y="${labelY}" class="nn-layer-label" data-layer="h2" style="${hideS5}">${this.msg('hiddenLayer2')}</text>`;
    svg += `<text x="${OUT_X}" y="${labelY}" class="nn-layer-label">${this.msg('outputLayer')}</text>`;

    // --- Input neurons ---
    if (showInput) {
      for (let i = 0; i < 9; i++) {
        const cy = inputY(i);
        const active = activated && INPUT_ACTIVATIONS[i] > 0.1;
        svg += `<circle cx="${INPUT_X}" cy="${cy}" r="14" class="${active ? 'nn-neuron-active' : 'nn-neuron'}" />`;
        svg += `<text x="${INPUT_X}" y="${cy + 3}" text-anchor="middle" font-size="7" fill="#666" font-weight="700">${i}</text>`;
      }
    }

    // --- Hidden 1 (base on 5, STEP5 pattern on 6, dim on 8→animation activates) ---
    if (showH1) {
      for (let i = 0; i < 6; i++) {
        const cy = hiddenY(i);
        const h1Active = s !== 5 && s !== 8 && activated && (s !== 6 || STEP5_H1[i]);
        svg += `<circle cx="${H1_X}" cy="${cy}" r="14" class="${h1Active ? 'nn-neuron-active' : 'nn-neuron'}" data-h1="${i}" style="${hideS5}" />`;
        svg += `<text x="${H1_X}" y="${cy + 3}" text-anchor="middle" font-size="7" fill="#666" font-weight="700" style="${hideS5}">H${i + 1}</text>`;
      }
    }

    // --- Hidden 2 (same pattern as H1) ---
    if (showH2) {
      for (let i = 0; i < 6; i++) {
        const cy = hiddenY(i);
        const h2Active = s !== 5 && s !== 8 && activated && (s !== 6 || STEP5_H2[i]);
        svg += `<circle cx="${H2_X}" cy="${cy}" r="14" class="${h2Active ? 'nn-neuron-active' : 'nn-neuron'}" data-h2="${i}" style="${hideS5}" />`;
        svg += `<text x="${H2_X}" y="${cy + 3}" text-anchor="middle" font-size="7" fill="#666" font-weight="700" style="${hideS5}">H${i + 1}</text>`;
      }
    }

    // --- Output neurons ---
    if (showOutput) {
      const outActive = activated && s !== 5 && s !== 6 && s !== 8; // output via animation on 6 & 8
      for (let i = 0; i < 9; i++) {
        const cy = outY(i);
        const digit = i + 1;
        let cls = 'nn-neuron';
        if (outActive) {
          if (trained && digit === 4) cls = 'nn-neuron-correct';
          else if (!trained && digit === 7) cls = 'nn-neuron-wrong';
          else cls = 'nn-neuron-active';
        }
        svg += `<circle cx="${OUT_X}" cy="${cy}" r="14" class="${cls}" data-out="${i}" />`;
        // Digit label — centered inside the circle
        svg += `<text x="${OUT_X}" y="${cy + 4}" text-anchor="middle" font-size="10" font-weight="700" fill="${outActive ? '#fff' : '#4a5a5a'}">${digit}</text>`;
        // Activation value (not shown on step 5)
        if (outActive) {
          const val = outVals[i];
          const isActive = (trained && digit === 4) || (!trained && digit === 7);
          svg += `<text x="${OUT_X + 34}" y="${cy + 3}" class="nn-out-value ${isActive ? 'nn-out-value-active' : ''}" text-anchor="start">${formatDecimal(val, this.locale, 2)}</text>`;
        }
      }
    }

    svg += `</svg>`;
    return svg;
  }

  // ==========================================================
  // Bottom bar: step text + navigation
  // ==========================================================
  renderBottomBar() {
    const m = getMessages(this.locale);
    const nn = m.neuralNetwork;
    const s = this.step;

    const stepKey = `step${s}`;
    const stepTitle = nn[`${stepKey}Title`] || "";
    const stepCopy = nn[`${stepKey}Copy`] || "";

    const showPretrain = s === 7 && !this.animating && !this.trained;
    const showTrained = s === 7 && this.trained && !this.animating;
    const disablePrev = s === 0 || this.animating;
    const disableNext = s === 8 || this.animating;

    return `
      <div class="nn-step-text">
        <h3>${stepTitle}</h3>
        <p>${stepCopy}</p>
      </div>
      <div class="nn-controls">
        <button class="nn-btn" data-action="prev" ${disablePrev ? 'disabled' : ''}>${nn.prev}</button>
        <span class="nn-step-count">${nn.stepCounter(s, 8)}</span>
        <button class="nn-btn" data-action="next" ${disableNext ? 'disabled' : ''}>${nn.next}</button>
        ${showPretrain ? `<button class="nn-btn nn-btn-pretrain" data-action="pretrain">${nn.pretrain}</button>` : ''}
        ${showTrained ? `<button class="nn-btn" disabled style="background:var(--success);color:#fff;border-color:var(--success);cursor:default;">✓ ${this.msg('trainingComplete')}</button>` : ''}
      </div>
    `;
  }

  msg(key) {
    return getMessages(this.locale).neuralNetwork[key] || key;
  }

  // ==========================================================
  // Animations
  // ==========================================================

  // Step 3: reveal vectors one by one
  animateVectors() {
    this.animating = true;
    for (let si = 0; si < 9; si++) {
      const delay = 200 + si * 400;
      setTimeout(() => {
        // Show pixel values for this subsection
        this.querySelectorAll(`[data-pix="${si}"]`).forEach(el => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 0.3s ease';
        });
        // Show highlight border for this subsection
        this.querySelectorAll(`[data-sub="${si}"]`).forEach(el => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 0.3s ease';
        });
        // Show the vector row for this subsection
        this.querySelectorAll(`[data-vec-row="${si}"]`).forEach(el => {
          el.style.opacity = '1';
          el.style.transition = 'opacity 0.3s ease';
        });
        if (si === 8) {
          this.animating = false;
        }
      }, delay);
    }
  }

  // Step 4: feed each subsection's vector into its input neuron
  animateFeedInputs() {
    this.animating = true;
    const inputCircles = this.querySelectorAll('.nn-right-panel circle:not([data-h1]):not([data-h2]):not([data-out])');

    for (let si = 0; si < 9; si++) {
      const delay = 200 + si * 400;
      setTimeout(() => {
        // Light up the corresponding input neuron on the right
        if (inputCircles[si]) {
          inputCircles[si].classList.add('nn-neuron-active');
          inputCircles[si].style.transition = 'fill 0.3s ease, filter 0.3s ease, stroke 0.3s ease';
        }
        if (si === 8) {
          this.animating = false;
        }
      }, delay);
    }
  }

  // Step 5: reveal hidden layers one by one, then connections, then activations
  animateStep5() {
    this.animating = true;

    const fadeIn = (el) => {
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '1';
    };
    const activate = (el) => {
      el.style.transition = 'fill 0.5s ease, filter 0.5s ease, stroke 0.5s ease';
      el.classList.add('nn-neuron-active');
    };

    // Phase 1 (300ms): Hidden Layer 1 appears
    setTimeout(() => {
      this.querySelectorAll('[data-h1], [data-layer="h1"]').forEach(fadeIn);

      // Phase 2 (1100ms): Hidden Layer 2 appears
      setTimeout(() => {
        this.querySelectorAll('[data-h2], [data-layer="h2"]').forEach(fadeIn);

        // Phase 3 (2100ms): Input → H1 connections draw
        setTimeout(() => {
          this.querySelectorAll('[data-conn="ih1"]').forEach(fadeIn);

          // Phase 4 (3100ms): H1 → H2 connections draw
          setTimeout(() => {
            this.querySelectorAll('[data-conn="h1h2"]').forEach(fadeIn);

            // Phase 5 (4100ms): H2 → Output connections draw
            setTimeout(() => {
              this.querySelectorAll('[data-conn="h2o"]').forEach(fadeIn);

              // Phase 6 (5100ms): Input neurons activate
              setTimeout(() => {
                const inputCircles = this.querySelectorAll('.nn-right-panel circle:not([data-h1]):not([data-h2]):not([data-out])');
                inputCircles.forEach(activate);

                // Phase 7 (5900ms): Selected H1 neurons activate
                setTimeout(() => {
                  this.querySelectorAll('[data-h1]').forEach((el, i) => {
                    if (STEP5_H1[i]) activate(el);
                  });

                  // Phase 8 (6700ms): Selected H2 neurons activate
                  setTimeout(() => {
                    this.querySelectorAll('[data-h2]').forEach((el, i) => {
                      if (STEP5_H2[i]) activate(el);
                    });

                    this.animating = false;
                  }, 800);
                }, 800);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 800);
    }, 300);
  }

  // Step 6 & 8: forward propagation — signal flows through the network
  animateForward(trained) {
    this.animating = true;
    this.trained = trained;
    const outVals = trained ? POST_OUT : PRE_OUT;
    const h1Pat = trained ? STEP8_H1 : null;
    const h2Pat = trained ? STEP8_H2 : null;

    const outValues = () => {
      this.querySelectorAll('[data-out]').forEach((el, i) => {
        const d = i + 1;
        const isCorrect = trained && d === 4;
        const isWrong = !trained && d === 7;
        el.style.transition = 'fill 0.4s ease, filter 0.4s ease, stroke 0.4s ease';
        if (isCorrect) el.classList.add('nn-neuron-correct');
        else if (isWrong) el.classList.add('nn-neuron-wrong');
        else if (outVals[i] > 0.3) el.classList.add('nn-neuron-active');
      });
      this.querySelectorAll('[data-out]').forEach((el, i) => {
        const val = outVals[i];
        const d = i + 1;
        const isActive = (trained && d === 4) || (!trained && d === 7);
        const svg = el.closest('svg');
        if (!svg.querySelector(`.out-val-${i}`)) {
          const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          txt.setAttribute('x', String(OUT_X + 34));
          txt.setAttribute('y', String(parseFloat(el.getAttribute('cy')) + 3));
          txt.setAttribute('text-anchor', 'start');
          txt.classList.add('nn-out-value', `out-val-${i}`);
          if (isActive) txt.classList.add('nn-out-value-active');
          txt.textContent = formatDecimal(val, this.locale, 2);
          el.parentNode.insertBefore(txt, el.nextSibling);
        }
      });
    };

    let d = 300;

    // Step 8 only: activate H1 then H2 with trained mixture
    if (trained) {
      setTimeout(() => {
        this.querySelectorAll('[data-h1]').forEach((el, i) => {
          if (h1Pat[i]) {
            el.style.transition = 'fill 0.5s ease, filter 0.5s ease, stroke 0.5s ease';
            el.classList.add('nn-neuron-active');
          }
        });
      }, d);
      d += 800;

      setTimeout(() => {
        this.querySelectorAll('[data-h2]').forEach((el, i) => {
          if (h2Pat[i]) {
            el.style.transition = 'fill 0.5s ease, filter 0.5s ease, stroke 0.5s ease';
            el.classList.add('nn-neuron-active');
          }
        });
      }, d);
      d += 800;
    }

    // Both steps: connections brighten
    setTimeout(() => {
      this.querySelectorAll('.nn-connection').forEach(el => el.classList.add('nn-connection-active'));
    }, d);
    d += 800;

    // Both steps: output lights up with values
    setTimeout(() => {
      outValues();
      this.animating = false;
    }, d);
  }

  // Step 7: training wave (backpropagation visualization)
  animateTraining() {
    this.animating = true;
    const layers = ['out', 'h2', 'h1', 'input'];
    const neurons = {
      'out': Array.from({ length: 9 }, (_, i) => ({ selector: `[data-out="${i}"]`, cls: 'nn-neuron-training' })),
      'h2': Array.from({ length: 6 }, (_, i) => ({ selector: `[data-h2="${i}"]`, cls: 'nn-neuron-training' })),
      'h1': Array.from({ length: 6 }, (_, i) => ({ selector: `[data-h1="${i}"]`, cls: 'nn-neuron-training' })),
      'input': Array.from({ length: 9 }, (_, i) => {
        const circles = this.querySelectorAll('.nn-right-panel circle:not([data-h1]):not([data-h2]):not([data-out])');
        return { el: circles[i] || null, cls: 'nn-neuron-training' };
      })
    };

    // Reset all connections and neurons
    this.querySelectorAll('.nn-connection').forEach(el => el.classList.remove('nn-connection-training'));
    this.querySelectorAll('circle').forEach(el => {
      el.classList.remove('nn-neuron-training', 'nn-neuron-active', 'nn-neuron-correct', 'nn-neuron-wrong');
    });

    let waveCount = 0;
    const maxWaves = 3;

    const runWave = () => {
      if (waveCount >= maxWaves) {
        this.trained = true;
        this.animating = false;
        // Re-render step 7 to show "Training complete" button
        this.render();
        return;
      }

      waveCount++;

      // Sweep right to left
      let cumDelay = 0;
      const layerDelays = [0, 400, 800, 1200];

      layers.forEach((layer, li) => {
        setTimeout(() => {
          // Activate connections
          if (li > 0) {
            this.querySelectorAll('.nn-connection').forEach(el => el.classList.add('nn-connection-training'));
          }

          // Activate neurons in this layer
          if (layer === 'input') {
            this.querySelectorAll('.nn-right-panel circle:not([data-h1]):not([data-h2]):not([data-out])').forEach(el => {
              if (el) el.classList.add('nn-neuron-training');
            });
          } else {
            this.querySelectorAll(`[data-${layer}], circle[data-${layer}]`).forEach(el => {
              el.classList.add('nn-neuron-training');
            });
          }
        }, cumDelay + layerDelays[li]);
      });

      // After the wave completes, clear for next wave
      const waveDuration = 1400;
      setTimeout(() => {
        this.querySelectorAll('.nn-connection').forEach(el => el.classList.remove('nn-connection-training'));
        this.querySelectorAll('circle').forEach(el => el.classList.remove('nn-neuron-training'));
        runWave();
      }, waveDuration);
    };

    runWave();
  }
}

customElements.define("neural-network-lesson", NeuralNetworkLesson);
