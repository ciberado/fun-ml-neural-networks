export const ACTIVATION_THRESHOLD = 0.5;

export const WEIGHT_MIN = -2;
export const WEIGHT_MAX = 2;
export const WEIGHT_STEP = 0.1;

export const BIAS_MIN = -2;
export const BIAS_MAX = 2;
export const BIAS_STEP = 0.1;

export const INPUT_STEP = 0.1;

export const ACTIVATION_TYPES = {
  SIGMOID: "sigmoid",
  STEP: "step"
};

export const DEFAULT_NEURON_STATE = {
  inputA: 1.0,
  inputB: 2.0,
  weightA: 0.5,
  weightB: -0.3,
  bias: 0.1,
  activation: ACTIVATION_TYPES.SIGMOID
};
