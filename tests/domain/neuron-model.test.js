import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  computeWeightedSum,
  sigmoid,
  stepActivation,
  computeNeuron
} from "../../src/domain/neuron-model.js";

describe("computeWeightedSum", () => {
  it("returns the weighted sum of two inputs plus bias", () => {
    // z = 0.5 * 1.0 + (-0.3) * 2.0 + 0.1 = 0.5 - 0.6 + 0.1 = 0.0
    const z = computeWeightedSum(1.0, 2.0, 0.5, -0.3, 0.1);
    assert.ok(Math.abs(z) < 1e-10, `Expected ~0, got ${z}`);
  });

  it("handles zero weights and zero bias", () => {
    const z = computeWeightedSum(3.0, 4.0, 0.0, 0.0, 0.0);
    assert.strictEqual(z, 0.0);
  });

  it("handles negative inputs", () => {
    const z = computeWeightedSum(-1.0, -2.0, 1.0, 1.0, 0.0);
    assert.strictEqual(z, -3.0);
  });

  it("handles large inputs and weights", () => {
    const z = computeWeightedSum(100.0, 50.0, 2.0, -1.0, 10.0);
    assert.strictEqual(z, 200 - 50 + 10);
  });
});

describe("sigmoid", () => {
  it("returns 0.5 for z = 0", () => {
    assert.strictEqual(sigmoid(0), 0.5);
  });

  it("approaches 1 for large positive z", () => {
    const result = sigmoid(10);
    assert.ok(result > 0.999);
    assert.ok(result < 1.0);
  });

  it("approaches 0 for large negative z", () => {
    const result = sigmoid(-10);
    assert.ok(result < 0.001);
    assert.ok(result > 0.0);
  });

  it("is strictly between 0 and 1 for typical z values", () => {
    for (const z of [-5, -2, -1, 0, 1, 2, 5]) {
      const s = sigmoid(z);
      assert.ok(s > 0, `sigmoid(${z}) = ${s} should be > 0`);
      assert.ok(s < 1, `sigmoid(${z}) = ${s} should be < 1`);
    }
  });

  it("is monotonic (larger z → larger output)", () => {
    const s1 = sigmoid(-2);
    const s2 = sigmoid(0);
    const s3 = sigmoid(2);
    assert.ok(s1 < s2);
    assert.ok(s2 < s3);
  });
});

describe("stepActivation", () => {
  it("returns 1 when z >= threshold (default 0.5)", () => {
    assert.strictEqual(stepActivation(0.5), 1);
    assert.strictEqual(stepActivation(1.0), 1);
    assert.strictEqual(stepActivation(100), 1);
  });

  it("returns 0 when z < threshold (default 0.5)", () => {
    assert.strictEqual(stepActivation(0.49), 0);
    assert.strictEqual(stepActivation(0), 0);
    assert.strictEqual(stepActivation(-10), 0);
  });

  it("respects a custom threshold", () => {
    assert.strictEqual(stepActivation(2.0, 2.0), 1);
    assert.strictEqual(stepActivation(1.9, 2.0), 0);
    assert.strictEqual(stepActivation(0.0, -1.0), 1);
  });
});

describe("computeNeuron", () => {
  it("returns z and activationOutput with sigmoid", () => {
    const state = { inputA: 1.0, inputB: 2.0, weightA: 0.5, weightB: -0.3, bias: 0.1, activation: "sigmoid" };
    const result = computeNeuron(state);

    assert.ok(Math.abs(result.z) < 1e-10, `Expected z ~0, got ${result.z}`);
    assert.strictEqual(result.activationOutput, 0.5);
    assert.strictEqual(result.activationType, "sigmoid");
  });

  it("returns z and activationOutput with step", () => {
    const state = { inputA: 1.0, inputB: 2.0, weightA: 0.5, weightB: -0.3, bias: 0.1, activation: "step" };
    const result = computeNeuron(state);

    assert.ok(Math.abs(result.z) < 1e-10, `Expected z ~0, got ${result.z}`);
    assert.strictEqual(result.activationOutput, 0); // z ~ 0 < 0.5
    assert.strictEqual(result.activationType, "step");
  });

  it("step returns 1 when z passes threshold", () => {
    const state = { inputA: 2.0, inputB: 1.0, weightA: 1.0, weightB: 0.0, bias: 0.0, activation: "step" };
    const result = computeNeuron(state);

    assert.strictEqual(result.z, 2.0);
    assert.strictEqual(result.activationOutput, 1); // z=2 >= 0.5
  });

  it("produces a proper sigmoid curve through different inputs", () => {
    // With weightA=1, weightB=0, bias=0: z = inputA
    const makeState = (a) => ({ inputA: a, inputB: 0, weightA: 1.0, weightB: 0.0, bias: 0.0, activation: "sigmoid" });

    const r1 = computeNeuron(makeState(-5));
    const r2 = computeNeuron(makeState(0));
    const r3 = computeNeuron(makeState(5));

    assert.ok(r1.activationOutput < r2.activationOutput);
    assert.ok(r2.activationOutput < r3.activationOutput);
    assert.ok(r1.activationOutput < 0.01);
    assert.ok(r3.activationOutput > 0.99);
  });
});
