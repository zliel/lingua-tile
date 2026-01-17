import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page } from "vitest/browser";
import AdminSectionTable from "./AdminSectionTable";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "../Contexts/AuthContext";
import SnackbarContext from "../Contexts/SnackbarContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { api } from "@/utils/apiClient";

// Mock the apiClient module
vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const theme = createTheme();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const mockAuth = {
    authData: {
      isLoggedIn: true,
      token: "mock-token",
      user: { id: "1", username: "admin" },
    },
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

const mockLessons = [{ _id: "l1", title: "Lesson 1", section_id: "s1" }];
const mockSections = [
  { _id: "s1", name: "Section 1", order_index: 0, lesson_ids: [] },
  { _id: "s2", name: "Section 2", order_index: 1, lesson_ids: [] },
];

describe("AdminSectionTable Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    (api.get as any).mockImplementation(() => new Promise(() => { }));
    const Wrapper = createWrapper();
    render(<AdminSectionTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Loading...")).toBeVisible();
  });

  it("renders sections and form", async () => {
    (api.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/lessons/all"))
        return Promise.resolve({ data: mockLessons });
      if (url.includes("/api/sections/all"))
        return Promise.resolve({ data: mockSections });
      return Promise.resolve({ data: [] });
    });

    const Wrapper = createWrapper();
    render(<AdminSectionTable />, { wrapper: Wrapper });

    await expect.element(page.getByText("Section 1")).toBeVisible();
    await expect.element(page.getByText("Section 2")).toBeVisible();
    // Check for Add Section form/button
    await expect
      .element(page.getByRole("button", { name: "Add Section" }))
      .toBeVisible();
  });

  it("handles error state", async () => {
    (api.get as any).mockRejectedValue(new Error("Failed"));
    const Wrapper = createWrapper();
    render(<AdminSectionTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Failed to fetch data")).toBeVisible();
  });
});
