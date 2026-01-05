import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import Login from "./Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { SnackbarContext } from "@/Contexts/SnackbarContext";
import AuthContext from "@/Contexts/AuthContext";
import OfflineContext from "@/Contexts/OfflineContext";
import axios from "axios";

// Mock axios
vi.mock("axios");

const createWrapper = (mockShowSnackbar: any, mockLogin: any, mockClearQueue: any) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ login: mockLogin } as any}>
        <OfflineContext.Provider value={{ clearQueue: mockClearQueue } as any}>
          <SnackbarContext.Provider value={{ showSnackbar: mockShowSnackbar } as any}>
            <MemoryRouter>{children}</MemoryRouter>
          </SnackbarContext.Provider>
        </OfflineContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("Login Component Integration", () => {
  it("handles successful login", async () => {
    const mockShowSnackbar = vi.fn();
    const mockLogin = vi.fn((data, callback) => callback());
    const mockClearQueue = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar, mockLogin, mockClearQueue);

    // Mock axios response
    (axios.post as any).mockResolvedValue({ data: { token: "fake-token" } });

    render(<Login />, { wrapper: Wrapper });

    // Fill in form
    await userEvent.type(page.getByLabelText(/Username/i), "testuser");
    await userEvent.type(page.getByLabelText(/Password/i), "password123");

    // Click login
    await userEvent.click(page.getByRole("button", { name: /Sign In/i }));

    // Verify success
    await expect.poll(() => mockShowSnackbar.mock.calls.length).toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith("Login successful", "success");
    expect(mockLogin).toHaveBeenCalled();
  });

  it("handles login failure", async () => {
    const mockShowSnackbar = vi.fn();
    const mockLogin = vi.fn();
    const mockClearQueue = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar, mockLogin, mockClearQueue);

    // Mock axios error
    const errorResponse = {
      response: {
        data: { message: "Invalid credentials" }
      },
      isAxiosError: true
    };
    (axios.post as any).mockRejectedValue(errorResponse);
    (axios.isAxiosError as any).mockReturnValue(true);


    render(<Login />, { wrapper: Wrapper });

    await userEvent.type(page.getByLabelText(/Username/i), "testuser");
    await userEvent.type(page.getByLabelText(/Password/i), "wrongpass");
    await userEvent.click(page.getByRole("button", { name: /Sign In/i }));

    await expect.poll(() => mockShowSnackbar.mock.calls.length).toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith(expect.stringContaining("Login failed"), "error");
  });
});

