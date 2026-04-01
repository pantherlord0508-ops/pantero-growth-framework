/**
 * Shared test utilities for React component tests.
 *
 * Provides render wrappers with common providers and mock factories.
 *
 * @module test/utils
 */

import React from "react";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Custom render function that wraps components with necessary providers.
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export { customRender as render };

/**
 * Creates a mock Supabase query builder.
 */
export function createMockSupabaseQuery<T>(data: T | null, error: Error | null = null) {
  const query = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data, error }),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    then: undefined, // Not a thenable
    [Symbol.for("jest.retryTimes")]: undefined,
  };

  // Make it thenable for awaiting
  Object.defineProperty(query, "then", {
    value: undefined,
    configurable: true,
  });

  return query;
}

/**
 * Creates a mock fetch response.
 */
export function mockFetch<T>(data: T, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

// Re-export testing library
export * from "@testing-library/react";
export { vi } from "vitest";
