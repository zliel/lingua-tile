import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page, userEvent } from "vitest/browser";
import AdminCardTable from "./AdminCardTable";
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
    put: vi.fn(), // If needed later
    delete: vi.fn(), // If needed later
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
  { _id: "l1", title: "Lesson 1", section_id: "s1" },
  { _id: "l2", title: "Lesson 2", section_id: "s1" },
];
const mockSections = [
  { _id: "s1", name: "Section 1" },
];
const mockCards = [
  { _id: "c1", front_text: "Hello", back_text: "Hola", lesson_ids: ["l1"] },
  { _id: "c2", front_text: "Cat", back_text: "Gato", lesson_ids: ["l2"] },
];

describe("AdminCardTable Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    // Delay resolution to show loading
    (axios.get as any).mockImplementation(() => new Promise(() => { }));

    const Wrapper = createWrapper();
    render(<AdminCardTable />, { wrapper: Wrapper });

    await expect.element(page.getByText("Cards Table")).toBeVisible();
  });

  it("renders cards and form after loading", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/cards/all")) return Promise.resolve({ data: mockCards });
      if (url.includes("/api/lessons/all")) return Promise.resolve({ data: mockLessons });
      if (url.includes("/api/sections/all")) return Promise.resolve({ data: mockSections });
      return Promise.resolve({ data: [] });
    });

    const Wrapper = createWrapper();
    render(<AdminCardTable />, { wrapper: Wrapper });

    // Check for card content
    await expect.element(page.getByText("Hello")).toBeVisible();
    await expect.element(page.getByText("Hola")).toBeVisible();
    await expect.element(page.getByText("Cat")).toBeVisible();

    // Check for form elements
    await expect.element(page.getByLabelText("Front Text")).toBeVisible();
    await expect.element(page.getByLabelText("Back Text")).toBeVisible();
  });

  it("handles error state", async () => {
    (axios.get as any).mockRejectedValue(new Error("Network Error"));

    const Wrapper = createWrapper();
    render(<AdminCardTable />, { wrapper: Wrapper });

    await expect.element(page.getByText("Error loading data")).toBeVisible();
  });

  it("allows adding a new card", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/cards/all")) return Promise.resolve({ data: [] }); // Start empty
      if (url.includes("/api/lessons/all")) return Promise.resolve({ data: mockLessons });
      if (url.includes("/api/sections/all")) return Promise.resolve({ data: mockSections });
      return Promise.resolve({ data: [] });
    });

    (axios.post as any).mockResolvedValue({ data: { _id: "c3", front_text: "New", back_text: "Nuevo", lesson_ids: [] } });

    const Wrapper = createWrapper();
    render(<AdminCardTable />, { wrapper: Wrapper });

    // Wait for load
    await expect.element(page.getByLabelText("Front Text")).toBeVisible();

    // Fill form
    await userEvent.fill(page.getByLabelText("Front Text"), "New");
    await userEvent.fill(page.getByLabelText("Back Text"), "Nuevo");

    // Click Add
    await userEvent.click(page.getByRole("button", { name: "Add Card" }));

    // Verify API call
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/api/cards/create"),
      expect.objectContaining({
        front_text: "New",
        back_text: "Nuevo",
      }),
      expect.any(Object)
    );
  });
});

