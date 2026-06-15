import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatDecimal, formatInteger } from "../../src/utils/formatters.js";

describe("formatDecimal", () => {
  it("formats a number with default 3 fraction digits (en)", () => {
    assert.strictEqual(formatDecimal(1.5, "en"), "1.500");
  });

  it("formats with specified fraction digits", () => {
    assert.strictEqual(formatDecimal(1.5, "en", 1), "1.5");
    assert.strictEqual(formatDecimal(1.5, "en", 4), "1.5000");
  });

  it("returns unknown symbol for null", () => {
    assert.strictEqual(formatDecimal(null, "en"), "?");
  });

  it("returns unknown symbol for NaN", () => {
    assert.strictEqual(formatDecimal(NaN, "en"), "?");
  });

  it("returns unknown symbol for Infinity", () => {
    assert.strictEqual(formatDecimal(Infinity, "en"), "?");
  });

  it("formats negative numbers", () => {
    assert.strictEqual(formatDecimal(-0.3, "en", 1), "-0.3");
  });
});

describe("formatInteger", () => {
  it("formats an integer (en)", () => {
    assert.strictEqual(formatInteger(42, "en"), "42");
  });

  it("rounds a float to integer", () => {
    assert.strictEqual(formatInteger(3.7, "en"), "4");
  });

  it("returns unknown symbol for null", () => {
    assert.strictEqual(formatInteger(null, "en"), "?");
  });

  it("returns unknown symbol for NaN", () => {
    assert.strictEqual(formatInteger(NaN, "en"), "?");
  });
});
