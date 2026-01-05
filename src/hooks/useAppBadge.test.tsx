import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from "vitest";
import { useAppBadge } from "./useAppBadge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import * as AuthContext from "@/Contexts/AuthContext";

// Mock dependencies
vi.mock("axios");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAppBadge Hook", () => {
  const mockAuthData = {
    token: "mock-token",
    isLoggedIn: true,
  };

  const mockSetAppBadge = vi.fn();
  const mockClearAppBadge = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      authData: mockAuthData,
    } as any);

    // Mock Navigator
    Object.defineProperty(navigator, "setAppBadge", {
      value: mockSetAppBadge,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "clearAppBadge", {
      value: mockClearAppBadge,
      writable: true,
      configurable: true,
    });

    // Mock global console error to keep output clean during expected errors
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    // @ts-ignore
    delete navigator.setAppBadge;
    // @ts-ignore
    delete navigator.clearAppBadge;
  });


  it("sets app badge with overdue count", async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mockReviews = [
      { next_review: yesterday.toISOString() }, // Overdue
      { next_review: yesterday.toISOString() }, // Overdue
      { next_review: tomorrow.toISOString() },  // Not overdue
    ];

    (axios.get as Mock).mockResolvedValueOnce({ data: mockReviews });

    renderHook(() => useAppBadge(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockSetAppBadge).toHaveBeenCalledWith(2));
  });

  it("clears app badge if no reviews", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: [] });

    renderHook(() => useAppBadge(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(mockClearAppBadge).toHaveBeenCalled());
  });

  it("does nothing if navigator.setAppBadge is missing", async () => {
    // @ts-ignore
    navigator.setAppBadge = undefined;

    const mockReviews = [{ next_review: new Date().toISOString() }];
    (axios.get as Mock).mockResolvedValueOnce({ data: mockReviews });

    renderHook(() => useAppBadge(), {
      wrapper: createWrapper(),
    });

    // Should not throw and should not call axios (enabled check handles this in hook actually)
    // But if enabled check failed, logic inside useEffect handles it too. 
    // Hook actually disables query if setAppBadge is missing.

    // Wait a tick
    await waitFor(() => { });

    expect(mockSetAppBadge).not.toHaveBeenCalled();
  });
});
