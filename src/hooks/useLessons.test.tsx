import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { useLessons, useSections, fetchLessons } from "./useLessons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "../utils/apiClient";

vi.mock("../utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLessons Hook", () => {
  const mockAuthData = {
    token: "mock-token",
    username: "testuser",
    isLoggedIn: true,
    isAdmin: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchLessons calls api.get with correct endpoint", async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: [] });

    await fetchLessons();

    expect(api.get).toHaveBeenCalledWith("/api/lessons/all");
  });

  it("useLessons returns data on success", async () => {
    const mockData = [{ _id: "1", title: "Lesson 1" }];
    (api.get as Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useLessons(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("useLessons handles errors", async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useLessons(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("useSections fetches sections correctly", async () => {
    const mockSections = [{ _id: "s1", name: "Section 1" }];
    (api.get as Mock).mockResolvedValueOnce({ data: mockSections });

    const { result } = renderHook(() => useSections(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSections);
  });
});
