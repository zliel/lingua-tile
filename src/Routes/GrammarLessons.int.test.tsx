import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { page } from "vitest/browser";
import GrammarLesson from "./GrammarLesson";
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

vi.mock("mui-markdown", () => ({
  MuiMarkdown: ({ children }: any) => (
    <div data-testid="markdown-content">{children}</div>
  ),
  getOverrides: () => ({}),
}));

vi.mock("../Components/ReviewModal", () => ({
  default: () => <div data-testid="review-modal">ReviewModal (Mock)</div>,
}));

const createWrapper = (isLoggedIn: boolean = true) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: { isLoggedIn, token: "test-token" },
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

describe("GrammarLesson Component Integration", () => {
  it("renders lesson content when loaded", async () => {
    (api.get as any).mockResolvedValue({
      data: {
        title: "Grammar Lesson",
        content: "# Markdown Header\nSome content",
      },
    });

    const Wrapper = createWrapper(true);
    render(<GrammarLesson />, { wrapper: Wrapper });

    // Check for markdown content rendered by mock
    await expect.element(page.getByText("# Markdown Header")).toBeVisible();
    await expect.element(page.getByText("Some content")).toBeVisible();

    // Button should be enabled for logged in user
    const finishBtn = page.getByRole("button", { name: "Finish Lesson" });
    await expect.element(finishBtn).toBeVisible();
    await expect.element(finishBtn).toBeEnabled();
  });

  it("handles loading state", async () => {
    (api.get as any).mockImplementation(() => new Promise(() => {}));

    const Wrapper = createWrapper(true);
    render(<GrammarLesson />, { wrapper: Wrapper });

    await expect
      .element(page.getByTestId("markdown-content"))
      .not.toBeInTheDocument();
  });
});
