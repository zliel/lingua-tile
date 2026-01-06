import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import { ErrorFallback } from "./ErrorFallback";

describe("ErrorFallback Component", () => {
  const mockError = new Error("Test error message");
  const mockResetErrorBoundary = vi.fn();
  it("renders the error message", async () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />,
    );
    await expect.element(page.getByText("Something went wrong")).toBeVisible();
    await expect
      .element(page.getByText(/We encountered an unexpected error/i))
      .toBeVisible();
  });
  it("calls resetErrorBoundary when Try Again is clicked", async () => {
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />,
    );
    await userEvent.click(page.getByRole("button", { name: /try again/i }));
    expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1);
  });
  it("displays error details in development mode", async () => {
    vi.stubEnv("VITE_DEV", "true");
    render(
      <ErrorFallback
        error={mockError}
        resetErrorBoundary={mockResetErrorBoundary}
      />,
    );
    if (import.meta.env.VITE_DEV) {
      await expect.element(page.getByText("Test error message")).toBeVisible();
    }
    vi.unstubAllEnvs();
  });
});
