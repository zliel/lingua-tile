import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import Home from "./Home";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

// Mock AnimatedLogo to avoid canvas issues in test environment or complex rendering
vi.mock("@/Components/home/AnimatedLogo", () => ({
  default: () => <div data-testid="animated-logo">Logo</div>,
}));

const createWrapper = (isLoggedIn: boolean = false) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: {
      username: isLoggedIn ? "TestUser" : "",
      token: isLoggedIn ? "token" : "",
      isLoggedIn: isLoggedIn,
      isAdmin: false,
    },
    authIsLoading: false,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{children}</MemoryRouter>
        </ThemeProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Home Component Integration", () => {
  it("renders hero, info, and CTA sections when logged out", async () => {
    const Wrapper = createWrapper(false);
    render(<Home />, { wrapper: Wrapper });

    // Hero Section
    await expect
      .element(page.getByText("Master Japanese with LinguaTile"))
      .toBeVisible();
    await expect.element(page.getByText("Start Learning Now")).toBeVisible();

    // Info Section
    await expect
      .element(page.getByText("Why Choose LinguaTile?"))
      .toBeVisible();
    await expect.element(page.getByText("Structured Lessons")).toBeVisible();

    // CTA Section
    await expect
      .element(page.getByText("Ready to start your journey?"))
      .toBeVisible();
    await expect.element(page.getByText("Create Free Account")).toBeVisible();
  });

  it("renders correct CTA when logged in", async () => {
    const Wrapper = createWrapper(true);
    render(<Home />, { wrapper: Wrapper });

    await expect
      .element(page.getByText("Master Japanese with LinguaTile"))
      .toBeVisible();
    // CTA button text changes when logged in
    await expect.element(page.getByText("View Lessons")).toBeVisible();
  });
});
