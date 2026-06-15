import { getMessages } from "../i18n/index.js";

export function formatDecimal(value, locale = "en", fractionDigits = 3) {
  if (value == null || !Number.isFinite(value)) {
    return getMessages(locale).common.unknown;
  }

  // Always use "." as decimal separator regardless of UI locale
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

export function formatInteger(value, locale = "en") {
  if (value == null || !Number.isFinite(value)) {
    return getMessages(locale).common.unknown;
  }

  // Always use "." as decimal separator regardless of UI locale
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0
  }).format(value);
}
