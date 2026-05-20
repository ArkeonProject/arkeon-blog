import test from "node:test";
import assert from "node:assert/strict";

import routes from "../../routes";
import { loader as chapterLegacyLoader } from "../guia-junior-chapter-redirect";
import { loader as arkeonixLegacyLoader } from "../arkeonix-redirect";
import { loader as arkeonixThanksLegacyLoader } from "../arkeonix-thanks-redirect";
import { loader as saasBoilerplateLegacyLoader } from "../saas-boilerplate-redirect";
import { loader as guiaJuniorLegacyLoader } from "../guia-junior-redirect";
import { loader as guiaJuniorThanksLegacyLoader } from "../guia-junior-thanks-redirect";
import { loader as guiaJuniorDashboardLegacyLoader } from "../guia-junior-dashboard-redirect";
import { action as boilerplateCheckoutAction } from "../api.boilerplate-checkout";
import { action as guiaCheckoutAction } from "../api.guia-checkout";

const originalEnv = {
  PAYMENTS_ENABLED: process.env.PAYMENTS_ENABLED,
  BOILERPLATE_PAYMENTS_ENABLED: process.env.BOILERPLATE_PAYMENTS_ENABLED,
  STRIPE_PRICE_GUIA_MONTHLY: process.env.STRIPE_PRICE_GUIA_MONTHLY,
  STRIPE_PRICE_GUIA_ANNUAL: process.env.STRIPE_PRICE_GUIA_ANNUAL,
  STRIPE_PRICE_GUIA_LIFETIME: process.env.STRIPE_PRICE_GUIA_LIFETIME,
  STRIPE_PRICE_GUIA_LIFETIME_NORMAL: process.env.STRIPE_PRICE_GUIA_LIFETIME_NORMAL,
  STRIPE_PRICE_GUIA_B2B_ANNUAL: process.env.STRIPE_PRICE_GUIA_B2B_ANNUAL,
  STRIPE_PRICE_GUIA_B2B_LIFETIME: process.env.STRIPE_PRICE_GUIA_B2B_LIFETIME,
};

test.afterEach(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

test("legacy chapter redirect sanitizes slug and uses permanent redirect", async () => {
  const response = await chapterLegacyLoader({
    params: { slug: "../../evil?x=1" },
    request: new Request("https://arkeonixlabs.com/guia-junior/capitulo/../../evil?x=1"),
    context: {},
  } as never);

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "/recursos/guia-junior/capitulo/antes-de-empezar");
});

test("legacy chapter redirect preserves valid slug", async () => {
  const response = await chapterLegacyLoader({
    params: { slug: "puestos-existentes" },
    request: new Request("https://arkeonixlabs.com/guia-junior/capitulo/puestos-existentes"),
    context: {},
  } as never);

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "/recursos/guia-junior/capitulo/puestos-existentes");
});

test("legacy arkeonix redirect is permanent and points to recursos namespace", async () => {
  const response = await arkeonixLegacyLoader();

  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "/recursos/saas-boilerplate");
});

test("legacy resource redirects are permanent", async () => {
  const cases = [
    { loader: arkeonixThanksLegacyLoader, location: "/recursos/saas-boilerplate" },
    { loader: saasBoilerplateLegacyLoader, location: "/recursos/saas-boilerplate" },
    { loader: guiaJuniorLegacyLoader, location: "/recursos/guia-junior" },
    { loader: guiaJuniorThanksLegacyLoader, location: "/recursos/guia-junior/gracias" },
    { loader: guiaJuniorDashboardLegacyLoader, location: "/recursos/guia-junior/dashboard" },
  ];

  for (const { loader, location } of cases) {
    const response = await loader();
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), location);
  }
});

test("route config protects recursos guia dashboard page", () => {
  const dashboardRoute = routes.find((routeItem) => routeItem.path === "recursos/guia-junior/dashboard");
  assert.ok(dashboardRoute);
  assert.equal(dashboardRoute?.file, "pages/guia-junior/DashboardProtectedPage.tsx");
});

test("route config serves academia thanks before category catch-all", () => {
  const thanksRouteIndex = routes.findIndex((routeItem) => routeItem.path === "academia/gracias");
  const categoryRouteIndex = routes.findIndex((routeItem) => routeItem.path === "academia/:category");

  assert.notEqual(thanksRouteIndex, -1);
  assert.notEqual(categoryRouteIndex, -1);
  assert.ok(thanksRouteIndex < categoryRouteIndex);
  assert.equal(routes[thanksRouteIndex]?.file, "pages/academia/ThanksPage.tsx");
});

test("boilerplate checkout is disabled when dedicated flag is not true", async () => {
  process.env.PAYMENTS_ENABLED = "true";
  process.env.BOILERPLATE_PAYMENTS_ENABLED = "false";

  const response = await boilerplateCheckoutAction({
    request: new Request("https://arkeonixlabs.com/api/boilerplate-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_123" }),
    }),
    params: {},
    context: {},
  } as never);

  assert.equal(response.status, 410);
});

test("boilerplate checkout proceeds past payment flag checks when both flags are true", async () => {
  process.env.PAYMENTS_ENABLED = "true";
  process.env.BOILERPLATE_PAYMENTS_ENABLED = "true";

  const response = await boilerplateCheckoutAction({
    request: new Request("https://arkeonixlabs.com/api/boilerplate-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_123" }),
    }),
    params: {},
    context: {},
  } as never);

  assert.equal(response.status, 401);
});

test("guia checkout rejects prices outside the server allowlist", async () => {
  process.env.PAYMENTS_ENABLED = "true";
  process.env.STRIPE_PRICE_GUIA_MONTHLY = "price_allowed";
  delete process.env.STRIPE_PRICE_GUIA_ANNUAL;
  delete process.env.STRIPE_PRICE_GUIA_LIFETIME;
  delete process.env.STRIPE_PRICE_GUIA_LIFETIME_NORMAL;
  delete process.env.STRIPE_PRICE_GUIA_B2B_ANNUAL;
  delete process.env.STRIPE_PRICE_GUIA_B2B_LIFETIME;

  const response = await guiaCheckoutAction({
    request: new Request("https://arkeonixlabs.com/api/guia-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: "price_untrusted" }),
    }),
    params: {},
    context: {},
  } as never);

  assert.equal(response.status, 400);
});
