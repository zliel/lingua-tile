import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { useOfflineData } from "./useOfflineData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/utils/apiClient";
import * as SnackbarContext from "@/Contexts/SnackbarContext";
import * as AuthContext from "@/Contexts/AuthContext";

// Mock the apiClient module
vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockShowSnackbar = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useOfflineData Hook", () => {
  const mockAuthData = {
    token: "mock-token",
    isLoggedIn: true,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(SnackbarContext, "useSnackbar").mockReturnValue({
      showSnackbar: mockShowSnackbar,
    });
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      authData: mockAuthData,
    } as any);
    // Mock Navigator onLine
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
    });
  });

  it("downloadSection fetches data and caches it", async () => {
    const mockLesson = { _id: "l1", title: "Lesson 1", category: "flashcards" };
    const mockCards = [{ _id: "c1", lesson_ids: ["l1"], front: "A" }];

    (api.get as Mock).mockResolvedValueOnce({
      data: {
        lessons: [mockLesson],
        cards: mockCards,
      },
    });

    const { result } = renderHook(() => useOfflineData(), {
      wrapper: createWrapper(),
    });

    await result.current.downloadSection("section-1");

    await waitFor(() =>
      expect(result.current.downloadingSections["section-1"]).toBe(false),
    );
    expect(api.get).toHaveBeenCalledWith("/api/sections/section-1/download");
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Downloaded 1 lessons for offline use.",
      "success",
    );
  });

  it("fails gracefully if network error", async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useOfflineData(), {
      wrapper: createWrapper(),
    });

    await result.current.downloadSection("section-1");

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Failed to download lessons.",
      "error",
    );
    await waitFor(() =>
      expect(result.current.downloadingSections["section-1"]).toBe(false),
    );
  });

  it("warns if offline when trying to download", async () => {
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
    });

    const { result } = renderHook(() => useOfflineData(), {
      wrapper: createWrapper(),
    });

    await result.current.downloadSection("section-1");

    expect(api.get).not.toHaveBeenCalled();
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "You must be online to download lessons.",
      "error",
    );
  });
});
