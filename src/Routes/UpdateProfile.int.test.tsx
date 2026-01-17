import { render } from "vitest-browser-react";
import { describe, it, expect, vi } from "vitest";
import { userEvent, page } from "vitest/browser";
import UpdateProfile from "./UpdateProfile";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContext from "@/Contexts/AuthContext";
import { SnackbarContext } from "@/Contexts/SnackbarContext";
import { api } from "@/utils/apiClient";

vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createWrapper = (mockShowSnackbar: any, mockLogout: any) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const mockAuth = {
    authData: { username: "TestUser", token: "token", isLoggedIn: true },
    logout: mockLogout,
  };
  const mockSnackbar = {
    showSnackbar: mockShowSnackbar,
  };

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={mockAuth as any}>
        <SnackbarContext.Provider value={mockSnackbar as any}>
          <MemoryRouter>{children}</MemoryRouter>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

describe("UpdateProfile Component Integration", () => {
  it("loads current user data", async () => {
    const mockShowSnackbar = vi.fn();
    const mockLogout = vi.fn();
    const Wrapper = createWrapper(mockShowSnackbar, mockLogout);

    // Mock current user fetch
    (api.get as any).mockResolvedValue({
      data: { _id: "123", username: "CurrentUsername" },
    });

    render(<UpdateProfile />, { wrapper: Wrapper });

    // Check if username field is populated (might take a moment for useQuery)
    await expect
      // @ts-ignore
      .poll(() => page.getByLabelText(/^Username/i).element().value)
      .toBe("CurrentUsername");
  });

  it("updates profile successfully", async () => {
    const mockShowSnackbar = vi.fn();
    const mockLogout = vi.fn((cb) => cb && cb());
    const Wrapper = createWrapper(mockShowSnackbar, mockLogout);

    (api.get as any).mockResolvedValue({
      data: { _id: "123", username: "CurrentUsername" },
    });
    (api.put as any).mockResolvedValue({});

    render(<UpdateProfile />, { wrapper: Wrapper });

    // Wait for data load
    await expect
      // @ts-ignore
      .poll(() => page.getByLabelText(/^Username/i).element().value)
      .toBe("CurrentUsername");

    // Change username
    const input = page.getByLabelText(/^Username/i);
    await userEvent.clear(input);
    await userEvent.type(input, "NewUsername");

    await userEvent.click(page.getByRole("button", { name: /Save Changes/i }));

    await expect
      .poll(() => mockShowSnackbar.mock.calls.length)
      .toBeGreaterThan(0);
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Profile updated successfully",
      "success",
    );
    expect(mockLogout).toHaveBeenCalled();
  });
});
