import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import NavBar from "./NavBar";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import OfflineContext from "../Contexts/OfflineContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Mock StreakCounter to avoid extra data fetching/issues
vi.mock("./StreakCounter", () => ({
  default: ({ streak }: any) => <div data-testid="streak-counter">Streak: {streak}</div>
}));

const theme = createTheme();

const createWrapper = (isLoggedIn: boolean = false) => {
  // We can't easily mock useMediaQuery implementation inside the component logic via wrapper
  // but vitest-browser uses a real browser so we can set viewport size!

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: {
      username: isLoggedIn ? "TestUser" : "",
      token: isLoggedIn ? "token" : "",
      isLoggedIn: isLoggedIn,
      isAdmin: false
    },
    authIsLoading: false,
    logout: vi.fn(),
  };

  const mockOffline = {
    isOnline: true,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <OfflineContext.Provider value={mockOffline as any}>
          <ThemeProvider theme={theme}>
            <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </OfflineContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("NavBar Component Integration", () => {
  it("renders login/signup when logged out on desktop", async () => {
    await page.viewport(1024, 768); // Desktop

    const Wrapper = createWrapper(false);
    render(<NavBar />, { wrapper: Wrapper });

    await expect.element(page.getByText("LinguaTile")).toBeVisible();
    await expect.element(page.getByText("Login")).toBeVisible();
    await expect.element(page.getByText("Sign Up")).toBeVisible();
    // Menu toggle
    await expect.element(page.getByLabelText("menu")).toBeVisible();
  });

  it("renders avatar and logout when logged in on desktop", async () => {
    await page.viewport(1024, 768); // Desktop

    const Wrapper = createWrapper(true);
    render(<NavBar />, { wrapper: Wrapper });

    await expect.element(page.getByLabelText("avatar")).toBeVisible();
    // Profile menu needs click to open
  });

  it("opens profile menu on click", async () => {
    await page.viewport(1024, 768); // Desktop
    const Wrapper = createWrapper(true);
    render(<NavBar />, { wrapper: Wrapper });

    // Click Avatar by robust label
    await userEvent.click(page.getByLabelText("avatar"));

    await expect.element(page.getByText("My Profile")).toBeVisible();
    await expect.element(page.getByText("Settings")).toBeVisible();
    await expect.element(page.getByText("Logout")).toBeVisible();
  });

  it("toggles mobile menu", async () => {
    await page.viewport(375, 667); // Mobile
    const Wrapper = createWrapper(false);
    render(<NavBar />, { wrapper: Wrapper });

    // Click menu icon
    await userEvent.click(page.getByLabelText("menu"));

    // Drawer content should be visible
    // Base pages: Home, About, Lessons...
    await expect.element(page.getByText("Home")).toBeVisible();
    await expect.element(page.getByText("About")).toBeVisible();

    // Since mobile + logged out: Login/Signup in menu
    await expect.element(page.getByText("Login")).toBeVisible();
  });
});
