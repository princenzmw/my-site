export class AppError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 400, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function handleHttpError(err: unknown): Response {
  if (err instanceof AppError) {
    return jsonResponse(
      {
        error: err.message,
        code: err.code ?? "APP_ERROR",
        details: err.details ?? null,
      },
      err.status,
    );
  }
  console.error(err);
  return jsonResponse(
    {
      error: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    },
    500,
  );
}
