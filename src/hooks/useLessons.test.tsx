import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useLessons, useSections, fetchLessons } from "./useLessons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

// Mock axios
vi.mock("axios");

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
    login: vi.fn(),
    logout: vi.fn(),
  };

  it("fetchLessons calls axios with correct headers", async () => {
    (axios.get as Mock).mockResolvedValueOnce({ data: [] });

    await fetchLessons("mock-token");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/lessons/all"),
      {
        headers: { Authorization: "Bearer mock-token" },
      }
    );
  });

  it("useLessons returns data on success", async () => {
    const mockData = [{ _id: "1", title: "Lesson 1" }];
    (axios.get as Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useLessons(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("useLessons handles errors", async () => {
    (axios.get as Mock).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useLessons(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("useSections fetches sections correctly", async () => {
    const mockSections = [{ _id: "s1", name: "Section 1" }];
    (axios.get as Mock).mockResolvedValueOnce({ data: mockSections });

    const { result } = renderHook(() => useSections(mockAuthData as any), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockSections);
  });
});

