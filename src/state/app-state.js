import { DEFAULT_NEURON_STATE } from "../domain/config.js";
import { detectInitialLocale, resolveLocale } from "../i18n/index.js";

/**
 * Placeholder state layer for Lesson 2 (Neural Network).
 * Lesson 1 uses Pattern B (self-contained state in the component).
 * This module will be used when Lesson 2 grows beyond a single component.
 */

export function createInitialState() {
  const neuron = { ...DEFAULT_NEURON_STATE };

  return {
    neuron,
    ui: {
      locale: detectInitialLocale()
    }
  };
}

export function setLocale(state, locale) {
  return {
    ...state,
    ui: {
      ...state.ui,
      locale: resolveLocale(locale)
    }
  };
}
