import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { jsonResponse, handleHttpError, AppError } from "./errors";

const http = httpRouter();

auth.addHttpRoutes(http);

// Add health check with structured JSON and error handling
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    try {
      return jsonResponse({
        ok: true,
        status: "healthy",
        timestamp: Date.now(),
      });
    } catch (err) {
      return handleHttpError(err);
    }
  }),
});

// Add echo endpoint demonstrating request parsing + error handling
http.route({
  path: "/echo",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new AppError("Content-Type must be application/json", 415, "UNSUPPORTED_MEDIA_TYPE");
      }
      const body = await req.json().catch(() => {
        throw new AppError("Invalid JSON body", 400, "INVALID_JSON");
      });
      return jsonResponse({ ok: true, data: body }, 200);
    } catch (err) {
      return handleHttpError(err);
    }
  }),
});

export default http;