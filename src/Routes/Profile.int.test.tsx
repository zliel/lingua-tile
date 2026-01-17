import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import Profile from "./Profile";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import { SnackbarContext } from "../Contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { api } from "@/utils/apiClient";

// Mock charts and heavy components
vi.mock("@/Components/charts/PastWeekReviewsChart", () => ({
  PastWeekReviewsChart: () => <div>Past Week Chart</div>,
}));
vi.mock("@/Components/charts/LessonDifficultyChart", () => ({
  LessonDifficultyChart: () => <div>Difficulty Chart</div>,
}));
vi.mock("@/Components/charts/ActivityHeatmap", () => ({
  ActivityHeatmap: () => <div>Activity Heatmap</div>,
}));
vi.mock("@/Components/profile/ProfileHeader", () => ({
  ProfileHeader: ({ user }: any) => <div>Header: {user?.username}</div>,
}));
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, style }: any) => <div style={style}>{children}</div>,
    },
  };
});

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock hooks
vi.mock("@/hooks/useLessons", () => ({
  useReviews: () => ({ data: [], isLoading: false }),
  useReviewHistory: () => ({ data: [], isLoading: false }),
}));

const theme = createTheme();

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
    logout: vi.fn(),
  };

  const mockSnackbar = {
    showSnackbar: vi.fn(),
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <SnackbarContext.Provider value={mockSnackbar as any}>
          <ThemeProvider theme={theme}>
            <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Profile Component Integration", () => {
  it("renders profile data", async () => {
    (api.get as any).mockResolvedValue({
      data: { _id: "u1", username: "TestUser" },
    });

    const Wrapper = createWrapper();
    render(<Profile />, { wrapper: Wrapper });

    await expect.element(page.getByText("Header: TestUser")).toBeVisible();
    await expect.element(page.getByText("Active Lessons")).toBeVisible();
    await expect.element(page.getByText("Danger Zone")).toBeVisible();
  });

  it("opens delete dialog on click", async () => {
    (api.get as any).mockResolvedValue({
      data: { _id: "u1", username: "TestUser" },
    });

    const Wrapper = createWrapper();
    render(<Profile />, { wrapper: Wrapper });

    await userEvent.click(
      page.getByRole("button", { name: /Delete Profile/i }),
    );

    await expect
      .element(page.getByText("Are you sure you want to delete your profile?"))
      .toBeVisible();
  });
});
