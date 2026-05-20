// Client-side open-source flag. Server API handlers use process.env.PAYMENTS_ENABLED directly.
export const OPEN_SOURCE_MODE = true;
export const PAYMENTS_ENABLED = !OPEN_SOURCE_MODE;
