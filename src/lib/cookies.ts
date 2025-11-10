export const COOKIE_CONSENT_NAME = "arkeonConsent";

export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function hasConsent() {
  return getCookie(COOKIE_CONSENT_NAME) === "true";
}
