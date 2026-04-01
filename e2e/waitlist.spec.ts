/**
 * E2E tests for the Waitlist signup flow.
 *
 * Covers: form rendering, client-side validation, successful submission,
 * duplicate email handling, and network failure graceful degradation.
 */

import { test, expect } from "@playwright/test";

test.describe("Waitlist Signup Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/join");
  });

  test("renders the signup form with all fields", async ({ page }) => {
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/whatsapp/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /join/i })).toBeVisible();
  });

  test("shows validation error for empty name", async ({ page }) => {
    await page.getByRole("button", { name: /join/i }).click();
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    await page.getByLabel(/full name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("not-an-email");
    await page.getByLabel(/whatsapp/i).fill("+1234567890");
    await page.getByRole("button", { name: /join/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("shows validation error for short whatsapp number", async ({ page }) => {
    await page.getByLabel(/full name/i).fill("Test User");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/whatsapp/i).fill("123");
    await page.getByRole("button", { name: /join/i }).click();
    await expect(page.getByText(/at least 7 characters/i)).toBeVisible();
  });

  test("successfully submits the signup form", async ({ page }) => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    await page.getByLabel(/full name/i).fill("E2E Test User");
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/whatsapp/i).fill("+1234567890");

    // Intercept the API call
    const responsePromise = page.waitForResponse(
      (resp) => resp.url().includes("/api/signup") && resp.request().method() === "POST"
    );

    await page.getByRole("button", { name: /join/i }).click();

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user.referral_code).toBeTruthy();
    expect(body.user.position).toBeGreaterThan(0);
  });

  test("handles duplicate email gracefully", async ({ page }) => {
    // First, create a user
    const email = `duplicate-${Date.now()}@example.com`;

    await page.getByLabel(/full name/i).fill("First User");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/whatsapp/i).fill("+1234567890");

    const firstResponse = page.waitForResponse(
      (resp) => resp.url().includes("/api/signup") && resp.request().method() === "POST"
    );
    await page.getByRole("button", { name: /join/i }).click();
    await firstResponse;

    // Try to submit again with same email
    await page.goto("/join");
    await page.getByLabel(/full name/i).fill("Second User");
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/whatsapp/i).fill("+9876543210");

    const secondResponse = page.waitForResponse(
      (resp) => resp.url().includes("/api/signup") && resp.request().method() === "POST"
    );
    await page.getByRole("button", { name: /join/i }).click();

    const response = await secondResponse;
    expect(response.status()).toBe(409);
  });

  test("handles network failure gracefully", async ({ page }) => {
    // Simulate network failure
    await page.route("**/api/signup", (route) => route.abort());

    await page.getByLabel(/full name/i).fill("Network Test");
    await page.getByLabel(/email/i).fill(`network-${Date.now()}@example.com`);
    await page.getByLabel(/whatsapp/i).fill("+1234567890");
    await page.getByRole("button", { name: /join/i }).click();

    // Form should not crash, button should be re-enabled
    await expect(page.getByRole("button", { name: /join/i })).toBeVisible();
  });
});

test.describe("Landing Page", () => {
  test("loads the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Own Your Identity")).toBeVisible();
  });

  test("navigates to join page via CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /join the waitlist/i }).first().click();
    await expect(page).toHaveURL(/\/join/);
  });
});

test.describe("Health Check", () => {
  test("returns ok status", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeTruthy();
  });
});
