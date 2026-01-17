import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import PracticeLesson from "./PracticeLesson";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import SnackbarContext from "../Contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { api } from "@/utils/apiClient";

const theme = createTheme();

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock child components
vi.mock("../Components/TranslationQuestion", () => ({
  default: () => (
    <div data-testid="translation-question">TranslationQuestion (Mock)</div>
  ),
}));

vi.mock("../Components/ReviewModal", () => ({
  default: () => <div data-testid="review-modal">ReviewModal (Mock)</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: { isLoggedIn: true, token: "test-token" },
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
            <MemoryRouter initialEntries={["/lessons/123"]}>
              <Routes>
                <Route path="/lessons/:lessonId" element={children} />
              </Routes>
            </MemoryRouter>
          </ThemeProvider>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("PracticeLesson Component Integration", () => {
  it("renders lesson title and question", async () => {
    (api.get as any).mockResolvedValue({
      data: {
        title: "Practice Lesson",
        sentences: [{ id: 1, original: "test", trans: "translated" }],
      },
    });

    const Wrapper = createWrapper();
    render(<PracticeLesson />, { wrapper: Wrapper });

    await expect.element(page.getByText("Practice Lesson")).toBeVisible();
    await expect
      .element(page.getByText("TranslationQuestion (Mock)"))
      .toBeVisible();
  });

  it("handles loading state", async () => {
    (api.get as any).mockImplementation(() => new Promise(() => { }));

    const Wrapper = createWrapper();
    render(<PracticeLesson />, { wrapper: Wrapper });

    await expect
      .element(page.getByText("Practice Lesson"))
      .not.toBeInTheDocument();
  });
});
