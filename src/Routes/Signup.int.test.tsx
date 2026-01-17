import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import Signup from "./Signup";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import SnackbarContext from "../Contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { api } from "@/utils/apiClient";
import axios from "axios";

const theme = createTheme();

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: { isLoggedIn: false },
    authIsLoading: false,
  };

  const mockSnackbar = {
    showSnackbar: vi.fn(),
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <SnackbarContext.Provider value={mockSnackbar}>
          <ThemeProvider theme={theme}>
            <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Signup Component Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page content and signup form", async () => {
    const Wrapper = createWrapper();
    render(<Signup />, { wrapper: Wrapper });

    // Check for static text from Signup page
    await expect.element(page.getByText("Take the First Step!")).toBeVisible();

    // Check for content from SignupForm (Header)
    await expect.element(page.getByText("Sign Up").first()).toBeVisible();
    // Check for form fields
    await expect.element(page.getByLabelText("Username")).toBeVisible();
  });
  it("handles successful signup", async () => {
    (api.post as any).mockResolvedValue({});

    const Wrapper = createWrapper();
    render(<Signup />, { wrapper: Wrapper });

    await userEvent.fill(page.getByLabelText("Username"), "NewUser");
    await userEvent.fill(
      page.getByRole("textbox", { name: "Password", exact: true }),
      "Password1!",
    );
    await userEvent.fill(
      page.getByRole("textbox", { name: "Confirm Password", exact: true }),
      "Password1!",
    );

    // Email
    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );

    // Expect API call
    expect(api.post).toHaveBeenCalledWith(
      "/api/users/signup",
      { username: "NewUser", password: "Password1!", email: "test@test.com" },
    );
  });

  it("validates password mismatch", async () => {
    const Wrapper = createWrapper();
    render(<Signup />, { wrapper: Wrapper });

    await userEvent.fill(page.getByLabelText("Username"), "NewUser");
    await userEvent.fill(
      page.getByRole("textbox", { name: "Password", exact: true }),
      "Password1!",
    );
    await userEvent.fill(
      page.getByRole("textbox", { name: "Confirm Password", exact: true }),
      "mismatch",
    );

    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );
    // Check for validation error - Zod or manual check usually shows helper text
    await expect
      .element(page.getByText("Passwords do not match"))
      .toBeVisible();

    // Ensure API was NOT called
    expect(api.post).not.toHaveBeenCalled();
  });

  it("handles existing username error", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 400, data: { detail: "Username already exists" } },
    };
    (api.post as any).mockRejectedValue(axiosError);
    // Mock isAxiosError for the error handling
    vi.spyOn(axios, "isAxiosError").mockImplementation(
      (payload: any) => payload?.isAxiosError === true
    );

    const Wrapper = createWrapper();
    render(<Signup />, { wrapper: Wrapper });

    await userEvent.fill(page.getByLabelText("Username"), "ExistingUser");
    await userEvent.fill(
      page.getByRole("textbox", { name: "Password", exact: true }),
      "Password1!",
    );
    await userEvent.fill(
      page.getByRole("textbox", { name: "Confirm Password", exact: true }),
      "Password1!",
    );

    await userEvent.fill(
      page.getByRole("textbox", { name: "Email", exact: true }),
      "test@test.com",
    );

    await userEvent.click(
      page.getByRole("button", { name: "Sign Up", exact: true }),
    );

    // Should call API
    expect(api.post).toHaveBeenCalled();
  });
});
