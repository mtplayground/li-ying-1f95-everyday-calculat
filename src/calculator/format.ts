const DISPLAY_PRECISION = 12;
const MAX_STANDARD_LENGTH = 14;
const MIN_EXPONENTIAL_MAGNITUDE = 1e-9;
const MAX_STANDARD_MAGNITUDE = 1e12;

export function roundForDisplay(value: number): number {
  if (!Number.isFinite(value) || Object.is(value, -0)) {
    return Object.is(value, -0) ? 0 : value;
  }

  const scale = 10 ** DISPLAY_PRECISION;
  return Math.round((value + Math.sign(value) * Number.EPSILON) * scale) / scale;
}

export function formatNumber(value: number): string {
  const rounded = roundForDisplay(value);

  if (!Number.isFinite(rounded)) {
    return String(rounded);
  }

  const absolute = Math.abs(rounded);
  const shouldUseExponential =
    absolute >= MAX_STANDARD_MAGNITUDE || (absolute > 0 && absolute < MIN_EXPONENTIAL_MAGNITUDE);

  if (shouldUseExponential) {
    return trimExponent(rounded.toExponential(8));
  }

  const standard = trimTrailingZeroes(rounded.toFixed(DISPLAY_PRECISION));

  if (standard.length <= MAX_STANDARD_LENGTH) {
    return standard;
  }

  return trimExponent(rounded.toExponential(8));
}

function trimTrailingZeroes(value: string): string {
  return value.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}

function trimExponent(value: string): string {
  return value.replace(/(\.\d*?)0+e/, '$1e').replace(/\.e/, 'e');
}
