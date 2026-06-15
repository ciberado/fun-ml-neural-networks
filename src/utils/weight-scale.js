/**
 * Discrete weight values for the single-neuron weight slider.
 *
 * The array is built with three zones:
 *   Outer (-2 to -1, +1 to +2): linear step 0.1
 *   Inner (-1 to +1): progressively finer steps as you approach zero
 *
 * This gives the student fine-grained control near zero (where the
 * sigmoid is most sensitive) while keeping coarse outer adjustments.
 */

// prettier-ignore
const OUTER_NEG = [
  -2.0, -1.9, -1.8, -1.7, -1.6, -1.5, -1.4, -1.3, -1.2, -1.1, -1.0
];

// prettier-ignore
const INNER_NEG = [
  -0.9, -0.8, -0.7, -0.6, -0.5, -0.4, -0.3, -0.2,
  -0.15, -0.1,
  -0.07, -0.05, -0.03, -0.02, -0.01, -0.005, -0.001,
  0
];

// prettier-ignore
const INNER_POS = [
  0.001, 0.005, 0.01, 0.02, 0.03, 0.05, 0.07,
  0.1, 0.15,
  0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
  1.0
];

// prettier-ignore
const OUTER_POS = [
  1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0
];

/** Ordered array of all 57 selectable weight values from -2 to +2. */
export const WEIGHT_VALUES = OUTER_NEG.concat(INNER_NEG, INNER_POS, OUTER_POS);

/** Number of distinct weight positions (0-indexed). */
export const WEIGHT_VALUE_COUNT = WEIGHT_VALUES.length; // 57

/**
 * Return the nearest slider index for a given weight value.
 * Falls back to index 0 if the value is null/undefined.
 */
export function weightToIndex(value) {
  if (value == null || !Number.isFinite(value)) {
    return 0;
  }
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < WEIGHT_VALUE_COUNT; i++) {
    const dist = Math.abs(WEIGHT_VALUES[i] - value);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/**
 * Return the actual weight value for a given slider index.
 * Clamps index to valid range.
 */
export function indexToWeight(index) {
  const i = Math.max(0, Math.min(WEIGHT_VALUE_COUNT - 1, Math.round(index)));
  return WEIGHT_VALUES[i];
}

/**
 * Return the number of decimal places appropriate for displaying a weight.
 *
 *   |value| ≥ 1   → 1 digit   (outer zone, step 0.1)
 *   0.1 ≤ |v| < 1 → 2 digits  (inner tenths)
 *   |value| < 0.1 → 3 digits  (inner hundredths / thousandths)
 */
export function weightPrecision(value) {
  if (value == null || !Number.isFinite(value)) {
    return 1;
  }
  const abs = Math.abs(value);
  if (abs >= 1) return 1;
  if (abs >= 0.1) return 2;
  return 3;
}
