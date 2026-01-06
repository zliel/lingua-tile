import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import AdminLessonTable from "./AdminLessonTable";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import SnackbarContext from "../Contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    isAxiosError: () => false,
  },
}));

const theme = createTheme();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: { isLoggedIn: true, token: "mock-token", user: { id: "1", username: "admin" } },
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
            <MemoryRouter>{children}</MemoryRouter>
          </ThemeProvider>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

const mockLessons = [
  { _id: "l1", title: "Intro to Japanese", category: "flashcards", section_id: "s1", sentences: [], card_ids: [] },
  { _id: "l2", title: "Hiragana Basics", category: "practice", section_id: "s1", sentences: [], card_ids: [] },
];
const mockSections = [
  { _id: "s1", name: "Section 1" },
];
const mockCards = [
  { _id: "c1", front_text: "A", back_text: "Ah", lesson_ids: ["l1"] },
];

describe("AdminLessonTable Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    (axios.get as any).mockImplementation(() => new Promise(() => { }));
    const Wrapper = createWrapper();
    render(<AdminLessonTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Loading...")).toBeVisible();
  });

  it("renders lessons and form", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/lessons/all")) return Promise.resolve({ data: mockLessons });
      if (url.includes("/api/sections/all")) return Promise.resolve({ data: mockSections });
      if (url.includes("/api/cards/all")) return Promise.resolve({ data: mockCards });
      return Promise.resolve({ data: [] });
    });

    const Wrapper = createWrapper();
    render(<AdminLessonTable />, { wrapper: Wrapper });

    await expect.element(page.getByText("Intro to Japanese")).toBeVisible();
    await expect.element(page.getByText("Hiragana Basics")).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Add Lesson" })).toBeVisible();
  });

  it("handles error state", async () => {
    (axios.get as any).mockRejectedValue(new Error("Failed"));
    const Wrapper = createWrapper();
    render(<AdminLessonTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Failed to fetch data")).toBeVisible();
  });

  it("allows adding a new lesson", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/lessons/all")) return Promise.resolve({ data: [] });
      if (url.includes("/api/sections/all")) return Promise.resolve({ data: mockSections });
      if (url.includes("/api/cards/all")) return Promise.resolve({ data: mockCards });
      return Promise.resolve({ data: [] });
    });

    (axios.post as any).mockResolvedValue({ data: { _id: "l3", title: "New Lesson" } });

    const Wrapper = createWrapper();
    render(<AdminLessonTable />, { wrapper: Wrapper });

    await userEvent.fill(page.getByLabelText("Title *"), "New Lesson");

    await userEvent.click(page.getByRole("button", { name: "Add Lesson" }));

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/lessons/create"),
      expect.objectContaining({ title: "New Lesson" }),
      expect.any(Object)
    );
  });
});
