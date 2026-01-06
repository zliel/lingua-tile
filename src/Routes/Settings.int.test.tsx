import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import Settings from "./Settings";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme();

vi.mock("@/hooks/usePushSubscription", () => ({
  usePushSubscription: () => ({
    isSubscribed: false,
    isLoading: false,
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  }),
}));

vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    isAxiosError: () => false,
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: {
      username: "TestUser",
      token: "token",
      isLoggedIn: true,
      isAdmin: false,
    },
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

describe("Settings Component Integration", () => {
  it("renders settings options", async () => {
    (axios.get as any).mockResolvedValue({
      data: { _id: "u1", learning_mode: "list" },
    });

    const Wrapper = createWrapper();
    render(<Settings />, { wrapper: Wrapper });

    await expect.element(page.getByText("Journey Map View")).toBeVisible();
    await expect.element(page.getByText("Push Notifications")).toBeVisible();
  });

  it("toggles learning mode", async () => {
    (axios.get as any).mockResolvedValue({
      data: { _id: "u1", learning_mode: "list" },
    });
    (axios.put as any).mockResolvedValue({});

    const Wrapper = createWrapper();
    render(<Settings />, { wrapper: Wrapper });

    // Wait for data load
    await expect.element(page.getByText("Journey Map View")).toBeVisible();

    // Find the switch input
    const switches = page.getByRole("switch");
    await expect.poll(() => switches.elements().length).toBeGreaterThan(0);

    const modeSwitch = switches.all()[0];
    await userEvent.click(modeSwitch);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining("/api/users/update/u1"),
      { learning_mode: "map" },
      expect.anything(),
    );
  });
});
