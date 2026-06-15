/**
 * Compute the weighted sum (z) of a single neuron.
 * z = wA * a + wB * b + bias
 *
 * @param {number} inputA
 * @param {number} inputB
 * @param {number} weightA
 * @param {number} weightB
 * @param {number} bias
 * @returns {number}
 */
export function computeWeightedSum(inputA, inputB, weightA, weightB, bias) {
  return weightA * inputA + weightB * inputB + bias;
}

/**
 * Sigmoid activation function.
 * S(z) = 1 / (1 + e^(-z))
 * Output is always in (0, 1).
 *
 * @param {number} z
 * @returns {number}
 */
export function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Step activation function (perceptron-style hard threshold).
 * Returns 1 if z >= threshold, 0 otherwise.
 *
 * @param {number} z
 * @param {number} threshold - defaults to 0.5
 * @returns {number} - 0 or 1
 */
export function stepActivation(z, threshold = 0.5) {
  return z >= threshold ? 1 : 0;
}

/**
 * Run the full neuron computation: weighted sum → activation.
 *
 * @param {object} state - { inputA, inputB, weightA, weightB, bias, activation }
 * @returns {object} - { z, activationOutput, activationType }
 */
export function computeNeuron(state) {
  const { inputA, inputB, weightA, weightB, bias, activation } = state;

  const z = computeWeightedSum(inputA, inputB, weightA, weightB, bias);

  let activationOutput;
  if (activation === "step") {
    activationOutput = stepActivation(z);
  } else {
    activationOutput = sigmoid(z);
  }

  return {
    z,
    activationOutput,
    activationType: activation
  };
}
