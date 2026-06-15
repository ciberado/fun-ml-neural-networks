import { getMessages } from "../i18n/index.js";

export function formatDecimal(value, locale = "en", fractionDigits = 3) {
  if (value == null || !Number.isFinite(value)) {
    return getMessages(locale).common.unknown;
  }

  return new Intl.NumberFormat(getMessages(locale).meta.intlLocale, {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

export function formatInteger(value, locale = "en") {
  if (value == null || !Number.isFinite(value)) {
    return getMessages(locale).common.unknown;
  }

  return new Intl.NumberFormat(getMessages(locale).meta.intlLocale, {
    style: "decimal",
    maximumFractionDigits: 0
  }).format(value);
}
