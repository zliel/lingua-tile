import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import FlashcardLesson from "./FlashcardLesson";
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

// Mock child component
vi.mock("../Components/FlashcardList", () => ({
  default: () => <div data-testid="flashcard-list">FlashcardsList (Mock)</div>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: { isLoggedIn: true, token: "test-token" }, // Needs to be logged in for useQuery enabled check
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

describe("FlashcardLesson Component Integration", () => {
  it("renders lesson title and flashcard list", async () => {
    (api.get as any).mockResolvedValue({
      data: { title: "Test Lesson", cards: [] },
    });

    const Wrapper = createWrapper();
    render(<FlashcardLesson />, { wrapper: Wrapper });

    // Wait for loading to finish and content to appear
    await expect.element(page.getByText("Test Lesson")).toBeVisible();
    await expect.element(page.getByText("FlashcardsList (Mock)")).toBeVisible();
  });

  it("handles loading state", async () => {
    // Delay response to show loading state
    (api.get as any).mockImplementation(() => new Promise(() => { }));

    const Wrapper = createWrapper();
    render(<FlashcardLesson />, { wrapper: Wrapper });

    await expect.element(page.getByText("Loading lesson...")).toBeVisible();
  });
});
