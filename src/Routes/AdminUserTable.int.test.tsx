import { render } from "vitest-browser-react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { page } from "vitest/browser";
import AdminUserTable from "./AdminUserTable";
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

const mockUsers = [
  { _id: "u1", username: "user1", email: "user1@example.com", role: "user" },
  { _id: "u2", username: "admin", email: "admin@example.com", role: "admin" },
];

describe("AdminUserTable Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", async () => {
    (axios.get as any).mockImplementation(() => new Promise(() => { }));
    const Wrapper = createWrapper();
    render(<AdminUserTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Loading...")).toBeVisible();
  });

  it("renders users", async () => {
    (axios.get as any).mockImplementation((url: string) => {
      if (url.includes("/api/users/admin/all")) return Promise.resolve({ data: mockUsers });
      return Promise.resolve({ data: [] });
    });

    const Wrapper = createWrapper();
    render(<AdminUserTable />, { wrapper: Wrapper });

    await expect.element(page.getByText("user1")).toBeVisible();
    await expect.element(page.getByText("admin")).toBeVisible();
    await expect.element(page.getByText("Users Table")).toBeVisible();
  });

  it("handles error state", async () => {
    (axios.get as any).mockRejectedValue(new Error("Failed"));
    const Wrapper = createWrapper();
    render(<AdminUserTable />, { wrapper: Wrapper });
    await expect.element(page.getByText("Error loading users.")).toBeVisible();
  });
});

