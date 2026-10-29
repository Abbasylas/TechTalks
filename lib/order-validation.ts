// Check that an incoming JSON value is a plain object shape we can validate.
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Accept finite nonnegative dollar amounts that have no more than two decimals.
export function isValidPrice(value: unknown): value is number {
  return typeof value === "number"
    && Number.isFinite(value)
    && value >= 0
    && Number(value.toFixed(2)) === value;
}
