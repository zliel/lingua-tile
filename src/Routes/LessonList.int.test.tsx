import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import LessonList from "../Routes/LessonList";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import OfflineContext from "../Contexts/OfflineContext";
import { SnackbarContext } from "../Contexts/SnackbarContext";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/theme";

vi.mock("@/Components/LessonListItem", () => ({
  LessonListItem: ({ lesson }: any) => (
    <div data-testid={`lesson-item-${lesson._id}`}>
      {lesson.title} - {lesson.category || "flashcards"}
    </div>
  ),
}));

// Mock hooks to control data
const mockUseLessons = vi.fn();
const mockUseSections = vi.fn();
const mockUseReviews = vi.fn();

vi.mock("@/hooks/useLessons", () => ({
  useLessons: () => mockUseLessons(),
  useSections: () => mockUseSections(),
  useReviews: () => mockUseReviews(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockAuth = {
    authData: { username: "TestUser", token: "token", isLoggedIn: true },
    authIsLoading: false,
  };
  const mockOffline = {
    downloadSection: vi.fn(),
    downloadingSections: {},
    prefetchActiveSection: vi.fn(),
  };
  const mockSnackbar = {
    showSnackbar: vi.fn(),
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <OfflineContext.Provider value={mockOffline as any}>
          <SnackbarContext.Provider value={mockSnackbar as any}>
            <ThemeProvider theme={theme}>
              <MemoryRouter>{children}</MemoryRouter>
            </ThemeProvider>
          </SnackbarContext.Provider>
        </OfflineContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("LessonList Component Integration", () => {
  it("renders loading skeleton initially", async () => {
    mockUseLessons.mockReturnValue({ isLoading: true });
    mockUseSections.mockReturnValue({ isLoading: true });
    mockUseReviews.mockReturnValue({ isLoading: true });

    const Wrapper = createWrapper();
    render(<LessonList />, { wrapper: Wrapper });

    await expect.element(page.getByText("Loading Lessons")).toBeVisible();
  });

  it("renders lessons ordered by section", async () => {
    // Setup data
    const sections = [
      { _id: "s1", name: "Section 1", order_index: 0 },
      { _id: "s2", name: "Section 2", order_index: 1 },
    ];

    const lessons = [
      {
        _id: "l1",
        title: "Lesson 1",
        section_id: "s1",
        order_index: 0,
        category: "flashcards",
      },
      {
        _id: "l2",
        title: "Lesson 2",
        section_id: "s1",
        order_index: 1,
        category: "flashcards",
      },
      {
        _id: "l3",
        title: "Lesson 3",
        section_id: "s2",
        order_index: 0,
        category: "grammar",
      },
    ];

    mockUseLessons.mockReturnValue({ isLoading: false, data: lessons });
    mockUseSections.mockReturnValue({ isLoading: false, data: sections });
    mockUseReviews.mockReturnValue({ isLoading: false, data: [] });

    const Wrapper = createWrapper();
    render(<LessonList />, { wrapper: Wrapper });

    // Check Sections
    await expect.element(page.getByText("Section 1")).toBeVisible();
    await expect.element(page.getByText("Section 2")).toBeVisible();

    // Check Lessons
    await expect.element(page.getByTestId("lesson-item-l1")).toBeVisible();
    await expect.element(page.getByText("Lesson 1")).toBeVisible();
    await expect.element(page.getByText("Lesson 3")).toBeVisible();
  });

  it("renders error state", async () => {
    mockUseLessons.mockReturnValue({ isLoading: false, isError: true });
    mockUseSections.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });
    mockUseReviews.mockReturnValue({ isLoading: false, data: [] });

    const Wrapper = createWrapper();
    render(<LessonList />, { wrapper: Wrapper });

    await expect
      .element(page.getByText("Error loading lessons."))
      .toBeVisible();
  });
});
