import { computeNeuron } from "../domain/neuron-model.js";

/**
 * Placeholder recompute pipeline for Lesson 2 (Neural Network).
 * For now, recomputes the neuron output from state.
 */
export function recomputeDerivedState(state) {
  const neuronResult = computeNeuron(state.neuron);

  return {
    ...state,
    neuron: {
      ...state.neuron,
      result: neuronResult
    }
  };
}
