import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import { SignupForm } from "./SignupForm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { SnackbarContext } from "@/Contexts/SnackbarContext";
import axios from "axios";

// Mock axios
vi.mock("axios");

const createWrapper = (mockShowSnackbar: any) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SnackbarContext.Provider
        value={{ showSnackbar: mockShowSnackbar } as any}
      >
        <MemoryRouter>{children}</MemoryRouter>
      </SnackbarContext.Provider>
    </QueryClientProvider>
  );
};

describe("SignupForm Component Integration", () => {
  it("handles successful signup", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    (axios.post as any).mockResolvedValue({ data: { success: true } });

    render(<SignupForm />, { wrapper: Wrapper });

    await userEvent.type(page.getByLabelText(/^Username/i), "newuser");
    // Need to be specific because confirm password also has "Password" in label potentially or placeholder
    // In SignupForm.tsx: label={"Password"} and label={"Confirm Password"}
    await userEvent.type(page.getByLabelText(/^Password/i), "Password123!");
    await userEvent.type(
      page.getByLabelText(/Confirm Password/i),
      "Password123!",
    );

    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );

    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Account created successfully",
      "success",
    );
  });

  it("validates password mismatch", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    render(<SignupForm />, { wrapper: Wrapper });

    await userEvent.type(page.getByLabelText(/^Username/i), "newuser");
    await userEvent.type(page.getByLabelText(/^Password/i), "Password123!");
    await userEvent.type(page.getByLabelText(/Confirm Password/i), "mismatch");
    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );

    await expect
      .element(page.getByText(/Passwords do not match/i))
      .toBeVisible();
    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it("handles existing username error", async () => {
    const mockShowSnackbar = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar);

    const errorResponse = {
      response: {
        status: 400,
        data: { detail: "Username already exists" },
      },
      isAxiosError: true,
    };
    (axios.post as any).mockRejectedValue(errorResponse);
    (axios.isAxiosError as any).mockReturnValue(true);

    render(<SignupForm />, { wrapper: Wrapper });

    await userEvent.type(page.getByLabelText(/^Username/i), "existinguser");
    await userEvent.type(page.getByLabelText(/^Password/i), "Password123!");
    await userEvent.type(
      page.getByLabelText(/Confirm Password/i),
      "Password123!",
    );

    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );

    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Username already exists",
      "error",
    );
  });
});
