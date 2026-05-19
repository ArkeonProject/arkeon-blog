export function logRouteError(context: string, error: unknown): void {
  if (!error || typeof error !== "object") {
    console.error(context, { type: "unknown" });
    return;
  }

  const routeError = error as {
    type?: unknown;
    code?: unknown;
    statusCode?: unknown;
    requestId?: unknown;
  };

  console.error(context, {
    type: typeof routeError.type === "string" ? routeError.type : undefined,
    code: typeof routeError.code === "string" ? routeError.code : undefined,
    statusCode: typeof routeError.statusCode === "number" ? routeError.statusCode : undefined,
    requestId: typeof routeError.requestId === "string" ? routeError.requestId : undefined,
  });
}
