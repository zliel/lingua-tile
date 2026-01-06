import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import useLessonReview from "./useLessonReview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { BrowserRouter } from "react-router-dom"; // For useNavigate
import * as SnackbarContext from "@/Contexts/SnackbarContext";
import * as AuthContext from "@/Contexts/AuthContext";
import * as OfflineContext from "@/Contexts/OfflineContext";

// Mock external dependencies
vi.mock("axios");

// Manual mocks for contexts
const mockShowSnackbar = vi.fn();
const mockAddToQueue = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("useLessonReview Hook", () => {
  const mockSetModalOpen = vi.fn();
  const mockSetModalLoading = vi.fn();
  const mockAuthData = {
    token: "mock-token",
    username: "testuser",
    isLoggedIn: true,
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock Contexts
    vi.spyOn(SnackbarContext, "useSnackbar").mockReturnValue({
      showSnackbar: mockShowSnackbar,
    });
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      authData: mockAuthData,
    } as any);
  });

  it("submits review successfully when online", async () => {
    // Mock Online Status
    vi.spyOn(OfflineContext, "useOffline").mockReturnValue({
      isOnline: true,
      addToQueue: mockAddToQueue,
    } as any);

    (axios.post as Mock).mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(
      () =>
        useLessonReview("lesson-123", mockSetModalOpen, mockSetModalLoading),
      {
        wrapper: createWrapper(),
      },
    );

    await result.current.handlePerformanceReview(3);

    await waitFor(() => expect(mockSetModalLoading).toHaveBeenCalledWith(true));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    await waitFor(() =>
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        "Lesson marked as complete",
        "success",
      ),
    );
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("queues review when offline (isOnline=false)", async () => {
    // Mock Offline Status
    vi.spyOn(OfflineContext, "useOffline").mockReturnValue({
      isOnline: false,
      addToQueue: mockAddToQueue,
    } as any);

    const { result } = renderHook(
      () =>
        useLessonReview("lesson-123", mockSetModalOpen, mockSetModalLoading),
      {
        wrapper: createWrapper(),
      },
    );

    await result.current.handlePerformanceReview(3);

    // Should NOT call axios
    expect(axios.post).not.toHaveBeenCalled();

    // Should Add to Queue
    expect(mockAddToQueue).toHaveBeenCalledWith(
      expect.objectContaining({
        lesson_id: "lesson-123",
        overall_performance: 3,
        username: "testuser",
      }),
    );
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Saved offline. Will sync when online.",
      "success",
    );
  });

  it("handles network error by queueing as offline", async () => {
    // Mock Online Status (Initially true, but network fails)
    vi.spyOn(OfflineContext, "useOffline").mockReturnValue({
      isOnline: true,
      addToQueue: mockAddToQueue,
    } as any);

    // Simulate Network Error
    const networkError = new Error("Network Error");
    // @ts-ignore
    networkError.code = "ERR_NETWORK";
    (axios.post as Mock).mockRejectedValueOnce(networkError);

    const { result } = renderHook(
      () =>
        useLessonReview("lesson-123", mockSetModalOpen, mockSetModalLoading),
      {
        wrapper: createWrapper(),
      },
    );

    await result.current.handlePerformanceReview(2);

    await waitFor(() => expect(mockAddToQueue).toHaveBeenCalled());
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      "Saved offline. Will sync when online.",
      "success",
    );
  });
});
