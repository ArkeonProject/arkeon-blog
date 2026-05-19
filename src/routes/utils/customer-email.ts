const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeOptionalCustomerEmail(value: unknown): string | null | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim();
  if (!email) {
    return undefined;
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return null;
  }

  return email;
}
