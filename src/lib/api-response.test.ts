/**
 * Unit tests for src/lib/api-response.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiError, apiSuccess, handleZodError, withErrorHandling } from "./api-response";
import { ZodError, z } from "zod";

describe("apiError", () => {
  it("returns a JSON response with error structure", async () => {
    const response = apiError("TEST_ERROR", "Something failed", 400);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: {
        code: "TEST_ERROR",
        message: "Something failed",
      },
    });
  });

  it("includes details when provided", async () => {
    const response = apiError("VALIDATION_ERROR", "Invalid input", 400, { field: "email" });
    const body = await response.json();

    expect(body.error.details).toEqual({ field: "email" });
  });

  it("defaults to 500 status", async () => {
    const response = apiError("INTERNAL_ERROR", "Server error");
    expect(response.status).toBe(500);
  });
});

describe("apiSuccess", () => {
  it("returns a JSON response with data structure", async () => {
    const response = apiSuccess({ id: "123", name: "test" });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { id: "123", name: "test" } });
  });

  it("supports custom status codes", async () => {
    const response = apiSuccess({ created: true }, 201);
    expect(response.status).toBe(201);
  });
});

describe("handleZodError", () => {
  it("converts ZodError to a 400 response with field details", async () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(2),
    });

    let zodError: ZodError;
    try {
      schema.parse({ email: "invalid", name: "a" });
      throw new Error("Should have thrown");
    } catch (e) {
      zodError = e as ZodError;
    }

    const response = handleZodError(zodError!);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details).toBeInstanceOf(Array);
    expect(body.error.details.length).toBeGreaterThan(0);
  });
});

describe("withErrorHandling", () => {
  it("returns the handler result on success", async () => {
    const handler = async () => apiSuccess({ ok: true });
    const response = await withErrorHandling(handler);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.ok).toBe(true);
  });

  it("catches errors and returns 500", async () => {
    const handler = async () => {
      throw new Error("Something broke");
    };
    const response = await withErrorHandling(handler);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });

  it("catches non-Error thrown values", async () => {
    const handler = async () => {
      throw "string error";
    };
    const response = await withErrorHandling(handler);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe("INTERNAL_ERROR");
  });
});
