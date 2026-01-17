import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import Dashboard from "./Dashboard";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "@/Contexts/AuthContext";
import { SnackbarContext } from "@/Contexts/SnackbarContext";

// Mock dependencies
vi.mock("@/hooks/usePushSubscription", () => ({
  usePushSubscription: () => ({
    isSubscribed: false,
    isLoading: false,
    subscribe: vi.fn(),
  }),
}));

// Mock charts to avoid complex rendering in tests
vi.mock("@/Components/charts/PastWeekReviewsChart", () => ({
  PastWeekReviewsChart: () => (
    <div data-testid="past-week-chart">Past Week Chart</div>
  ),
}));
vi.mock("@/Components/charts/ProjectedReviewsChart", () => ({
  ProjectedReviewsChart: () => (
    <div data-testid="projected-chart">Projected Chart</div>
  ),
}));
vi.mock("@/Components/charts/LessonProgressChart", () => ({
  LessonProgressChart: () => (
    <div data-testid="lesson-progress-chart">Lesson Progress Chart</div>
  ),
}));

// Mock axios for useQuery hooks used in Dashboard (useReviews, useReviewHistory, etc.)
// We need to mock the hooks themselves if possible, or mock axios responses.
// Since Dashboard uses custom hooks useReviews and useReviewHistory which likely use axios,
// let's mock the hooks from "@/hooks/useLessons".
vi.mock("@/hooks/useLessons", () => ({
  useReviews: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
  useReviewHistory: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi
      .fn()
      .mockResolvedValue({ data: { username: "TestUser", timezone: "UTC" } }),
    post: vi.fn(),
    put: vi.fn().mockResolvedValue({}),
    delete: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockAuth = {
    authData: { username: "TestUser", token: "token", isLoggedIn: true },
    logout: vi.fn(),
  };
  const mockSnackbar = {
    showSnackbar: vi.fn(),
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <SnackbarContext.Provider value={mockSnackbar as any}>
          <MemoryRouter>{children}</MemoryRouter>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Dashboard Component Integration", () => {
  it("renders welcome message with username", async () => {
    const Wrapper = createWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await expect
      .element(page.getByText(/Welcome back, TestUser!/i))
      .toBeVisible();
  });

  it("renders all charts", async () => {
    const Wrapper = createWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await expect.element(page.getByTestId("past-week-chart")).toBeVisible();
    await expect.element(page.getByTestId("projected-chart")).toBeVisible();
    await expect
      .element(page.getByTestId("lesson-progress-chart"))
      .toBeVisible();
  });

  it("renders go to lessons button", async () => {
    const Wrapper = createWrapper();
    render(<Dashboard />, { wrapper: Wrapper });

    await expect
      .element(page.getByRole("button", { name: /Go To Lessons/i }))
      .toBeVisible();
  });
});
