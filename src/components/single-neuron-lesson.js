import {
  detectInitialLocale,
  getMessages,
  resolveLocale
} from "../i18n/index.js";
import { computeNeuron } from "../domain/neuron-model.js";
import {
  DEFAULT_NEURON_STATE,
  WEIGHT_VALUE_COUNT,
  BIAS_MIN,
  BIAS_MAX,
  BIAS_STEP,
  INPUT_STEP,
  ACTIVATION_TYPES
} from "../domain/config.js";
import {
  indexToWeight,
  weightToIndex,
  weightPrecision
} from "../utils/weight-scale.js";
import { formatDecimal } from "../utils/formatters.js";

class SingleNeuronLesson extends HTMLElement {
  constructor() {
    super();
    this.locale = detectInitialLocale();
    this.state = { ...DEFAULT_NEURON_STATE };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.activeTab = "text";
  }

  connectedCallback() {
    this.addEventListener("input", this.handleInput);
    this.addEventListener("change", this.handleInput);
    this.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("app-locale-change", this.handleLocaleChange);
    this.render();
  }

  disconnectedCallback() {
    this.removeEventListener("input", this.handleInput);
    this.removeEventListener("change", this.handleInput);
    this.removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("app-locale-change", this.handleLocaleChange);
  }

  handleInput(event) {
    const el = event.target;
    const key = el.dataset.neuronParam;

    if (!key) {
      return;
    }

    let value;
    if (key === "activation") {
      value = el.value;
    } else if (key === "weightA" || key === "weightB") {
      // Slider stores an index (0 … WEIGHT_VALUE_COUNT-1) — convert to actual weight
      value = indexToWeight(Number(el.value));
    } else {
      value = Number(el.value);
    }

    this.state = {
      ...this.state,
      [key]: value
    };

    // During slider drag, update only display values — don't replace the DOM
    this.updateDisplay();
  }

  handleClick(event) {
    // Help icon click — open modal
    const helpBtn = event.target.closest("[data-help-key]");

    if (helpBtn) {
      this.openHelp(helpBtn.dataset.helpKey);
      return;
    }

    // Close modal via X button
    if (event.target.closest("[data-action='close-help']")) {
      this.closeHelp();
      return;
    }

    // Close modal via backdrop click (click outside the dialog)
    if (event.target.closest("[data-help-modal-overlay]") && !event.target.closest(".help-modal-dialog")) {
      this.closeHelp();
      return;
    }

    // Tab switch
    const tabBtn = event.target.closest("[data-tab]");
    if (tabBtn) {
      this.activeTab = tabBtn.dataset.tab;
      this.render();
      return;
    }

    // Action buttons
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    if (action === "reset-neuron") {
      this.state = { ...DEFAULT_NEURON_STATE };
      this.render();
    }
  }

  handleKeyDown(event) {
    if (event.key === "Escape") {
      this.closeHelp();
    }
  }

  openHelp(key) {
    const messages = getMessages(this.locale);
    const h = messages.help;

    const titles = {
      inputs: h.inputsTitle,
      weights: h.weightsTitle,
      bias: h.biasTitle,
      activation: h.activationTitle
    };

    const bodies = {
      inputs: h.inputsBody,
      weights: h.weightsBody,
      bias: h.biasBody,
      activation: h.activationBody
    };

    const overlay = this.querySelector("[data-help-modal-overlay]");
    if (!overlay) {
      return;
    }

    const titleEl = overlay.querySelector(".help-modal-title");
    const bodyEl = overlay.querySelector(".help-modal-body");

    if (titleEl) {
      titleEl.textContent = titles[key] ?? "";
    }

    if (bodyEl) {
      bodyEl.textContent = bodies[key] ?? "";
    }

    overlay.hidden = false;
  }

  closeHelp() {
    const overlay = this.querySelector("[data-help-modal-overlay]");

    if (overlay) {
      overlay.hidden = true;
    }
  }

  /**
   * Update only the computed display values without replacing the DOM.
   * Called on every slider drag — avoids killing the active input element.
   */
  updateDisplay() {
    const messages = getMessages(this.locale);
    const sn = messages.singleNeuron;
    const result = computeNeuron(this.state);
    const isSigmoid = this.state.activation === ACTIVATION_TYPES.SIGMOID;

    // Update slider value readouts
    for (const key of ["weightA", "weightB", "bias"]) {
      const readout = this.querySelector(`[data-neuron-value="${key}"]`);
      if (readout) {
        const precision = key === "bias" ? 1 : weightPrecision(this.state[key]);
        readout.textContent = formatDecimal(this.state[key], this.locale, precision);
      }
    }

    // Update formula
    const formulaEl = this.querySelector("[data-neuron-formula]");
    if (formulaEl) {
      formulaEl.textContent = sn.weightedSumFormula(
        formatDecimal(this.state.weightA, this.locale, weightPrecision(this.state.weightA)),
        formatDecimal(this.state.inputA, this.locale, 1),
        formatDecimal(this.state.weightB, this.locale, weightPrecision(this.state.weightB)),
        formatDecimal(this.state.inputB, this.locale, 1),
        formatDecimal(this.state.bias, this.locale, 1),
        formatDecimal(result.z, this.locale, 3)
      );
    }

    // Update activation output
    const outputEl = this.querySelector("[data-neuron-output]");
    if (outputEl) {
      outputEl.textContent = isSigmoid
        ? formatDecimal(result.activationOutput, this.locale, 4)
        : String(result.activationOutput);
    }

    // Update activation description
    const descEl = this.querySelector("[data-neuron-desc]");
    if (descEl) {
      descEl.textContent = isSigmoid ? sn.sigmoidDescription : sn.stepDescription;
    }

    // Update activation toggle active state
    const toggleLabels = this.querySelectorAll(".neuron-toggle-option");
    if (toggleLabels.length === 2) {
      toggleLabels[0].classList.toggle("is-active", isSigmoid);
      toggleLabels[1].classList.toggle("is-active", !isSigmoid);
    }

    // Update hidden radio button checked state
    const radios = this.querySelectorAll("[data-neuron-param='activation']");
    if (radios.length === 2) {
      radios[0].checked = isSigmoid;
      radios[1].checked = !isSigmoid;
    }

    // Update diagram tab elements if visible
    if (this.activeTab === "diagram") {
      const svg = this.querySelector(".neuron-diagram");
      if (!svg) return;

      this.setSvgText(svg, '[data-diagram="inputA"]', `A: ${formatDecimal(this.state.inputA, this.locale, 1)}`);
      this.setSvgText(svg, '[data-diagram="inputB"]', `B: ${formatDecimal(this.state.inputB, this.locale, 1)}`);

      const wA = Math.abs(this.state.weightA);
      const wB = Math.abs(this.state.weightB);
      const wAWidth = Math.max(1.5, wA * 1.8);
      const wBWidth = Math.max(1.5, wB * 1.8);
      const wAColor = this.state.weightA >= 0 ? "var(--selected)" : "var(--target)";
      const wBColor = this.state.weightB >= 0 ? "var(--selected)" : "var(--target)";

      const lineA = svg.querySelector('[data-diagram="weightLineA"]');
      if (lineA) {
        lineA.setAttribute("stroke", wAColor);
        lineA.setAttribute("stroke-width", wAWidth);
      }
      const lineB = svg.querySelector('[data-diagram="weightLineB"]');
      if (lineB) {
        lineB.setAttribute("stroke", wBColor);
        lineB.setAttribute("stroke-width", wBWidth);
      }

      this.setSvgText(svg, '[data-diagram="weightA"]', `w₁=${formatDecimal(this.state.weightA, this.locale, weightPrecision(this.state.weightA))}`);
      this.setSvgText(svg, '[data-diagram="weightB"]', `w₂=${formatDecimal(this.state.weightB, this.locale, weightPrecision(this.state.weightB))}`);
      this.setSvgText(svg, '[data-diagram="bias"]', `b=${formatDecimal(this.state.bias, this.locale, 1)}`);
      this.setSvgText(svg, '[data-diagram="z"]', `z=${formatDecimal(result.z, this.locale, 3)}`);
      this.setSvgText(svg, '[data-diagram="activation"]', isSigmoid ? "σ(z)" : "step(z)");
      this.setSvgText(svg, '[data-diagram="output"]', isSigmoid
        ? formatDecimal(result.activationOutput, this.locale, 4)
        : String(result.activationOutput));

      const neuronBody = svg.querySelector(".neuron-body");
      if (neuronBody) {
        const isActivated = isSigmoid ? result.activationOutput > 0.7 : result.activationOutput === 1;
        neuronBody.classList.toggle("is-activated", isActivated);
      }
    }
  }

  handleLocaleChange(event) {
    this.locale = resolveLocale(event.detail?.locale);
    this.render();
  }

  render() {
    const messages = getMessages(this.locale);
    const sn = messages.singleNeuron;

    const result = computeNeuron(this.state);

    const isSigmoid = this.state.activation === ACTIVATION_TYPES.SIGMOID;

    document.documentElement.lang = this.locale;

    this.innerHTML = `
      <div class="page-shell">
        <header class="hero">
          <p class="eyebrow">${sn.eyebrow}</p>
          <h1>${sn.title}</h1>
          <p class="hero-copy">${sn.copy}</p>
        </header>

        <div class="neuron-layout">
          <section class="neuron-controls panel">
            <h2 class="panel-heading">
              ${sn.inputsLabel}
              <button class="help-icon" data-help-key="inputs" aria-label="Explain inputs" type="button">ⓘ</button>
            </h2>
            <div class="neuron-input-group">
              <label class="neuron-label">
                <span>${sn.inputA}</span>
                <input
                  class="neuron-number-input"
                  type="number"
                  data-neuron-param="inputA"
                  value="${this.state.inputA}"
                  step="${INPUT_STEP}"
                >
              </label>
              <label class="neuron-label">
                <span>${sn.inputB}</span>
                <input
                  class="neuron-number-input"
                  type="number"
                  data-neuron-param="inputB"
                  value="${this.state.inputB}"
                  step="${INPUT_STEP}"
                >
              </label>
            </div>

            <h2 class="panel-heading">
              ${sn.weightsLabel}
              <button class="help-icon" data-help-key="weights" aria-label="Explain weights" type="button">ⓘ</button>
            </h2>
            <div class="neuron-slider-group">
              <label class="neuron-label">
                <span>${sn.weightA}</span>
                <div class="neuron-slider-row">
                  <input
                    class="neuron-range"
                    type="range"
                    data-neuron-param="weightA"
                    min="0"
                    max="${WEIGHT_VALUE_COUNT - 1}"
                    step="1"
                    value="${weightToIndex(this.state.weightA)}"
                  >
                   <span class="neuron-slider-value" data-neuron-value="weightA">${formatDecimal(this.state.weightA, this.locale, weightPrecision(this.state.weightA))}</span>
                </div>
              </label>
              <label class="neuron-label">
                <span>${sn.weightB}</span>
                <div class="neuron-slider-row">
                  <input
                    class="neuron-range"
                    type="range"
                    data-neuron-param="weightB"
                    min="0"
                    max="${WEIGHT_VALUE_COUNT - 1}"
                    step="1"
                    value="${weightToIndex(this.state.weightB)}"
                  >
                  <span class="neuron-slider-value" data-neuron-value="weightB">${formatDecimal(this.state.weightB, this.locale, weightPrecision(this.state.weightB))}</span>
                </div>
              </label>
            </div>

            <h2 class="panel-heading">
              ${sn.biasLabel}
              <button class="help-icon" data-help-key="bias" aria-label="Explain bias" type="button">ⓘ</button>
            </h2>
            <div class="neuron-slider-group">
              <label class="neuron-label">
                <span>${sn.biasLabel}</span>
                <div class="neuron-slider-row">
                  <input
                    class="neuron-range"
                    type="range"
                    data-neuron-param="bias"
                    min="${BIAS_MIN}"
                    max="${BIAS_MAX}"
                    step="${BIAS_STEP}"
                    value="${this.state.bias}"
                  >
                   <span class="neuron-slider-value" data-neuron-value="bias">${formatDecimal(this.state.bias, this.locale, 1)}</span>
                </div>
              </label>
            </div>

            <h2 class="panel-heading">
              ${sn.activationLabel}
              <button class="help-icon" data-help-key="activation" aria-label="Explain activation" type="button">ⓘ</button>
            </h2>
            <div class="neuron-activation-toggle">
              <label class="neuron-toggle-option ${isSigmoid ? "is-active" : ""}">
                <input
                  type="radio"
                  name="activation"
                  data-neuron-param="activation"
                  value="${ACTIVATION_TYPES.SIGMOID}"
                  ${isSigmoid ? "checked" : ""}
                  style="display:none"
                >
                <span>${sn.activationSigmoid}</span>
              </label>
              <label class="neuron-toggle-option ${!isSigmoid ? "is-active" : ""}">
                <input
                  type="radio"
                  name="activation"
                  data-neuron-param="activation"
                  value="${ACTIVATION_TYPES.STEP}"
                  ${!isSigmoid ? "checked" : ""}
                  style="display:none"
                >
                <span>${sn.activationStep}</span>
              </label>
            </div>

            <button
              class="button neuron-reset-button"
              data-action="reset-neuron"
            >
              ↺ Reset
            </button>
          </section>

          <section class="neuron-calculation panel">
            <h2 class="panel-heading">${sn.calculationLabel}</h2>
            <div class="tab-bar">
              <button class="tab-button ${this.activeTab === "text" ? "is-active" : ""}" data-tab="text" type="button">${sn.tabLabel.text}</button>
              <button class="tab-button ${this.activeTab === "diagram" ? "is-active" : ""}" data-tab="diagram" type="button">${sn.tabLabel.diagram}</button>
            </div>

            <div class="tab-content" data-tab-content="text" ${this.activeTab !== "text" ? "hidden" : ""}>
              <div class="neuron-formula">
                <div class="neuron-formula-title">${sn.weightedSumLabel}</div>
                <div class="neuron-formula-body" data-neuron-formula>
                  ${sn.weightedSumFormula(
                    formatDecimal(this.state.weightA, this.locale, weightPrecision(this.state.weightA)),
                    formatDecimal(this.state.inputA, this.locale, 1),
                    formatDecimal(this.state.weightB, this.locale, weightPrecision(this.state.weightB)),
                    formatDecimal(this.state.inputB, this.locale, 1),
                    formatDecimal(this.state.bias, this.locale, 1),
                    formatDecimal(result.z, this.locale, 3)
                  )}
                </div>
              </div>

              <div class="neuron-formula">
                <div class="neuron-formula-title">${sn.activationOutputLabel}</div>
                <div class="neuron-formula-body neuron-output-value" data-neuron-output>
                  ${isSigmoid
                    ? formatDecimal(result.activationOutput, this.locale, 4)
                    : String(result.activationOutput)}
                </div>
              </div>

              <div class="neuron-description">
                <p data-neuron-desc>
                  ${isSigmoid ? sn.sigmoidDescription : sn.stepDescription}
                </p>
              </div>
            </div>

            <div class="tab-content" data-tab-content="diagram" ${this.activeTab !== "diagram" ? "hidden" : ""}>
              ${this.renderNeuronDiagram(this.state, result)}
            </div>
          </section>
        </div>

        <section class="neuron-explanation panel" style="margin-top: 18px;">
          <h2 class="panel-heading">${sn.whatIsNeuron}</h2>
          <p class="hero-copy">${sn.neuronExplanation}</p>
        </section>

        <div class="help-modal-overlay" data-help-modal-overlay hidden role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
          <div class="help-modal-dialog">
            <button class="help-modal-close" data-action="close-help" aria-label="${messages.help.modalCloseLabel}" type="button">✕</button>
            <h3 class="help-modal-title" id="help-modal-title"></h3>
            <p class="help-modal-body"></p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Build an inline SVG neuron diagram showing inputs → weights → neuron → activation → output.
   * @param {object} state - current neuron state
   * @param {object} result - computed neuron result (z, activationOutput)
   * @returns {string} SVG markup
   */
  renderNeuronDiagram(state, result) {
    const { inputA, inputB, weightA, weightB, bias, activation } = state;
    const isSigmoid = activation === ACTIVATION_TYPES.SIGMOID;
    const isActivated = isSigmoid ? result.activationOutput > 0.7 : result.activationOutput === 1;

    const wAWidth = Math.max(1.5, Math.abs(weightA) * 1.8);
    const wBWidth = Math.max(1.5, Math.abs(weightB) * 1.8);
    const wAColor = weightA >= 0 ? "var(--selected)" : "var(--target)";
    const wBColor = weightB >= 0 ? "var(--selected)" : "var(--target)";

    return `
    <svg class="neuron-diagram" viewBox="0 0 440 200" role="img" aria-label="Neuron diagram">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill="var(--ink)"/>
        </marker>
      </defs>

      <!-- Input A -->
      <rect x="14" y="32" width="72" height="36" rx="6" class="neuron-input-box"/>
      <text x="50" y="50" class="neuron-input-text" data-diagram="inputA" text-anchor="middle" dominant-baseline="central">A: ${formatDecimal(inputA, this.locale, 1)}</text>

      <!-- Input B -->
      <rect x="14" y="116" width="72" height="36" rx="6" class="neuron-input-box"/>
      <text x="50" y="134" class="neuron-input-text" data-diagram="inputB" text-anchor="middle" dominant-baseline="central">B: ${formatDecimal(inputB, this.locale, 1)}</text>

      <!-- Weight line A -->
      <line x1="86" y1="50" x2="174" y2="80" class="neuron-weight-line" stroke="${wAColor}" stroke-width="${wAWidth}" marker-end="url(#arrow)" data-diagram="weightLineA"/>
      <text x="130" y="60" class="neuron-weight-label" data-diagram="weightA" text-anchor="middle" dominant-baseline="central">w₁=${formatDecimal(weightA, this.locale, weightPrecision(weightA))}</text>

      <!-- Weight line B -->
      <line x1="86" y1="134" x2="174" y2="114" class="neuron-weight-line" stroke="${wBColor}" stroke-width="${wBWidth}" marker-end="url(#arrow)" data-diagram="weightLineB"/>
      <text x="130" y="138" class="neuron-weight-label" data-diagram="weightB" text-anchor="middle" dominant-baseline="central">w₂=${formatDecimal(weightB, this.locale, weightPrecision(weightB))}</text>

      <!-- Neuron body -->
      <circle cx="210" cy="97" r="36" class="neuron-body${isActivated ? " is-activated" : ""}"/>
      <text x="210" y="82" class="neuron-body-label" data-diagram="bias" text-anchor="middle" dominant-baseline="central">b=${formatDecimal(bias, this.locale, 1)}</text>
      <text x="210" y="100" class="neuron-body-label neuron-z-label" data-diagram="z" text-anchor="middle" dominant-baseline="central">z=${formatDecimal(result.z, this.locale, 3)}</text>

      <!-- Activation arrow -->
      <line x1="246" y1="97" x2="344" y2="97" class="neuron-act-line" marker-end="url(#arrow)"/>
      <text x="295" y="80" class="neuron-act-label" data-diagram="activation" text-anchor="middle" dominant-baseline="central">${isSigmoid ? "σ(z)" : "step(z)"}</text>

      <!-- Output -->
      <rect x="349" y="79" width="65" height="36" rx="6" class="neuron-output-box"/>
      <text x="381" y="97" class="neuron-output-text" data-diagram="output" text-anchor="middle" dominant-baseline="central">${isSigmoid ? formatDecimal(result.activationOutput, this.locale, 4) : String(result.activationOutput)}</text>
    </svg>`;
  }

  /**
   * Set text content of an SVG element by selector.
   * @param {SVGSVGElement} svg - the SVG root element
   * @param {string} selector - CSS selector
   * @param {string} text - new text content
   */
  setSvgText(svg, selector, text) {
    const el = svg.querySelector(selector);
    if (el) {
      el.textContent = text;
    }
  }
}

customElements.define("single-neuron-lesson", SingleNeuronLesson);
