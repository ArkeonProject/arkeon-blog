import test from "node:test";
import assert from "node:assert/strict";

import { getBaseUrl } from "./base-url";

const originalEnv = {
  BASE_URL: process.env.BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  VERCEL_URL: process.env.VERCEL_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
};
const originalConsoleError = console.error;

test.beforeEach(() => {
  console.error = () => {};
});

test.afterEach(() => {
  console.error = originalConsoleError;
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("getBaseUrl removes trailing paths and slashes", () => {
  process.env.BASE_URL = "https://arkeonixlabs.com/";
  assert.equal(getBaseUrl(), "https://arkeonixlabs.com");

  process.env.BASE_URL = "https://arkeonixlabs.com/some/path";
  assert.equal(getBaseUrl(), "https://arkeonixlabs.com");

  process.env.BASE_URL = "arkeonixlabs.com";
  assert.equal(getBaseUrl(), "https://arkeonixlabs.com");
});

test("getBaseUrl rejects unsupported protocols", () => {
  process.env.BASE_URL = "javascript:alert(1)";
  assert.equal(getBaseUrl(), "http://localhost:5173");

  process.env.BASE_URL = "ftp://arkeonixlabs.com";
  assert.equal(getBaseUrl(), "http://localhost:5173");
});

test("getBaseUrl falls back for missing or malformed values", () => {
  delete process.env.BASE_URL;
  assert.equal(getBaseUrl(), "http://localhost:5173");

  process.env.BASE_URL = "not a url";
  assert.equal(getBaseUrl(), "http://localhost:5173");

  process.env.BASE_URL = "https://evil.example.com";
  assert.equal(getBaseUrl(), "http://localhost:5173");
});

test("getBaseUrl uses Vercel URLs instead of localhost in hosted runtimes", () => {
  delete process.env.BASE_URL;
  process.env.VERCEL = "1";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "arkeonixlabs.com";
  process.env.VERCEL_URL = "arkeonix-blog-git-main.vercel.app";

  assert.equal(getBaseUrl(), "https://arkeonixlabs.com");
});

test("getBaseUrl fails closed when production runtime has no valid public URL", () => {
  delete process.env.BASE_URL;
  delete process.env.VERCEL_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  process.env.NODE_ENV = "production";

  assert.throws(() => getBaseUrl(), /Missing BASE_URL/);
});

test("getBaseUrl fails closed when hosted runtime only has untrusted URLs", () => {
  delete process.env.BASE_URL;
  process.env.VERCEL = "1";
  process.env.VERCEL_PROJECT_PRODUCTION_URL = "evil.example.com";
  process.env.VERCEL_URL = "also-evil.example.com";

  assert.throws(() => getBaseUrl(), /Missing BASE_URL/);
});
