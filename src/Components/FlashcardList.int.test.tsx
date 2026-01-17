import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import FlashcardList from "./FlashcardList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/theme";
import { api } from "@/utils/apiClient";
import AuthContext from "../Contexts/AuthContext";
import { SnackbarContext } from "../Contexts/SnackbarContext";

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock ReviewModal to avoid its complexity
vi.mock("./ReviewModal", () => ({
  default: ({ open, setOpen }: any) =>
    open ? (
      <div data-testid="review-modal">
        ReviewModal Open <button onClick={() => setOpen(false)}>Close</button>
      </div>
    ) : null,
}));

// Mock Flashcard to simplify interaction
vi.mock("./Flashcard", () => ({
  default: ({ frontText, backText, onNextCard, onPreviousCard }: any) => (
    <div data-testid="flashcard">
      <p>Front: {frontText}</p>
      <p>Back: {backText}</p>
      <button onClick={onNextCard}>Next</button>
      <button onClick={onPreviousCard}>Prev</button>
    </div>
  ),
}));

const mockLesson = {
  _id: "l1",
  title: "Lesson 1",
  section_id: "sec1",
  order_index: 0,
  card_ids: ["c1", "c2"],
  sentences: [],
};

const mockCards = [
  { id: "c1", front_text: "Hello", back_text: "Hola" },
  { id: "c2", front_text: "World", back_text: "Mundo" },
];

describe("FlashcardList Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const createWrapper =
    (isLoggedIn = true) =>
      ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthContext.Provider
              value={{
                authData: {
                  isLoggedIn,
                  token: "token",
                  username: "user",
                  isAdmin: false,
                },
                login: vi.fn(),
                logout: vi.fn(),
                authIsLoading: false,
                checkAdmin: vi.fn(),
              }}
            >
              <SnackbarContext.Provider value={{ showSnackbar: vi.fn() }}>
                {children}
              </SnackbarContext.Provider>
            </AuthContext.Provider>
          </QueryClientProvider>
        </ThemeProvider>
      );

  it("renders flashcards and navigates through them", async () => {
    (api.post as any).mockResolvedValue({ data: mockCards });
    (api.get as any).mockResolvedValue({ data: null }); // Review status

    const Wrapper = createWrapper();
    render(<FlashcardList lessonId="lesson1" lesson={mockLesson} />, {
      wrapper: Wrapper,
    });

    // Wait for loading to finish
    await expect.element(page.getByText("Front: Hello")).toBeVisible();
    await expect.element(page.getByText("1/2")).toBeVisible();

    // Click next
    await userEvent.click(page.getByRole("button", { name: "Next" }).first());

    // Should show second card
    await expect.element(page.getByText("Front: World")).toBeVisible();
    await expect.element(page.getByText("2/2")).toBeVisible();
  });

  it("opens ReviewModal when finished (last card + next)", async () => {
    (api.post as any).mockResolvedValue({ data: mockCards });
    (api.get as any).mockResolvedValue({ data: null });

    const Wrapper = createWrapper();
    render(<FlashcardList lessonId="lesson1" lesson={mockLesson} />, {
      wrapper: Wrapper,
    });

    // Card 1
    await expect.element(page.getByText("Front: Hello")).toBeVisible();
    await userEvent.click(page.getByRole("button", { name: "Next" }).first());

    // Card 2
    await expect.element(page.getByText("Front: World")).toBeVisible();
    await userEvent.click(page.getByRole("button", { name: "Next" }).first());

    // Should open ReviewModal
    await expect.element(page.getByTestId("review-modal")).toBeVisible();
  });
});
