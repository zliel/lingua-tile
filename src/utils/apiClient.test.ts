/**
 * @vitest-environment jsdom
 * 
 * Unit tests for the apiClient module.
 * Tests focus on verifying the wrapper functions delegate correctly to axios.
 */
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import axios, { AxiosHeaders } from "axios";

// Create a mock localStorage implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

// Mock localStorage globally before any imports
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// We need to mock axios BEFORE importing apiClient
vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();

  // Initialize the callback store in the mock factory
  (globalThis as any).__test_interceptorCallbacks =
    (globalThis as any).__test_interceptorCallbacks || {};

  // Create a mock axios instance with interceptors that capture callbacks
  const mockInterceptors = {
    request: {
      use: vi.fn((onFulfilled, onRejected) => {
        (globalThis as any).__test_interceptorCallbacks.requestFulfilled = onFulfilled;
        (globalThis as any).__test_interceptorCallbacks.requestRejected = onRejected;
        return 0; // Return interceptor ID
      }),
      eject: vi.fn(),
      clear: vi.fn(),
    },
    response: {
      use: vi.fn((onFulfilled, onRejected) => {
        (globalThis as any).__test_interceptorCallbacks.responseFulfilled = onFulfilled;
        (globalThis as any).__test_interceptorCallbacks.responseRejected = onRejected;
        return 0;
      }),
      eject: vi.fn(),
      clear: vi.fn(),
    },
  };

  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: mockInterceptors,
    defaults: {
      headers: {
        common: {},
      },
    },
  };

  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => mockInstance),
    },
  };
});

// Import after mocking - this triggers the module initialization
import { api } from "./apiClient";

// Get access to the mock instance
const mockAxiosInstance = (axios.create as Mock).mock.results[0]?.value as {
  get: Mock;
  post: Mock;
  put: Mock;
  delete: Mock;
};

// Helper to get interceptor callbacks
const getInterceptorCallbacks = () => (globalThis as any).__test_interceptorCallbacks as {
  requestFulfilled?: (config: any) => any;
  requestRejected?: (error: any) => any;
  responseFulfilled?: (response: any) => any;
  responseRejected?: (error: any) => any;
};

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    // Reset mock implementations for wrapper function tests
    if (mockAxiosInstance) {
      mockAxiosInstance.get.mockResolvedValue({ data: { test: true } });
      mockAxiosInstance.post.mockResolvedValue({ data: { created: true } });
      mockAxiosInstance.put.mockResolvedValue({ data: { updated: true } });
      mockAxiosInstance.delete.mockResolvedValue({ data: { deleted: true } });
    }
  });

  describe("axios.create configuration", () => {
    it("creates an axios instance with interceptors configured", () => {
      // The module was loaded which means axios.create was called
      // We can verify this by checking that interceptor callbacks were captured
      const callbacks = getInterceptorCallbacks();

      // If interceptors were set up, axios.create must have been called
      expect(callbacks.requestFulfilled).toBeDefined();
      expect(callbacks.responseFulfilled).toBeDefined();
      expect(callbacks.responseRejected).toBeDefined();
    });

    it("configures request and response interceptors correctly", () => {
      // Verify the interceptor callbacks are functions
      const callbacks = getInterceptorCallbacks();
      expect(callbacks.requestFulfilled).toBeInstanceOf(Function);
      expect(callbacks.responseRejected).toBeInstanceOf(Function);
    });
  });

  describe("request interceptor - token injection", () => {
    it("injects Authorization header when token exists in localStorage", () => {
      const callbacks = getInterceptorCallbacks();
      const onFulfilled = callbacks.requestFulfilled;
      expect(onFulfilled).toBeDefined();

      // Set up token in localStorage
      localStorageMock.setItem("token", "test-jwt-token");

      // Create a mock config object
      const mockConfig = {
        headers: new AxiosHeaders(),
        url: "/api/test",
      };

      // Call the interceptor
      const result = onFulfilled!(mockConfig);

      expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
    });

    it("does not inject Authorization header when no token exists", () => {
      const callbacks = getInterceptorCallbacks();
      const onFulfilled = callbacks.requestFulfilled;
      expect(onFulfilled).toBeDefined();

      // Ensure no token in localStorage (cleared in beforeEach)
      const mockConfig = {
        headers: new AxiosHeaders(),
        url: "/api/test",
      };

      const result = onFulfilled!(mockConfig);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor - 401 handling", () => {
    it("handles network errors (no response)", async () => {
      const callbacks = getInterceptorCallbacks();
      const onRejected = callbacks.responseRejected;
      expect(onRejected).toBeDefined();

      const networkError = {
        message: "Network Error",
        // No response property - simulates network failure
      };

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => { });

      await expect(onRejected!(networkError)).rejects.toEqual(networkError);

      expect(consoleSpy).toHaveBeenCalledWith("Network error:", "Network Error");
      consoleSpy.mockRestore();
    });
  });

  describe("api wrapper functions", () => {
    it("api.get calls apiClient.get with correct arguments", async () => {
      await api.get("/api/test");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/test", undefined);
    });

    it("api.get passes config options", async () => {
      const config = { params: { id: 123 } };
      await api.get("/api/test", config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/test", config);
    });

    it("api.post calls apiClient.post with correct arguments", async () => {
      const data = { name: "test" };
      await api.post("/api/test", data);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/api/test", data, undefined);
    });

    it("api.post passes config options", async () => {
      const data = { name: "test" };
      const config = { headers: { "X-Custom": "value" } };
      await api.post("/api/test", data, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith("/api/test", data, config);
    });

    it("api.put calls apiClient.put with correct arguments", async () => {
      const data = { name: "updated" };
      await api.put("/api/test/1", data);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith("/api/test/1", data, undefined);
    });

    it("api.delete calls apiClient.delete with correct arguments", async () => {
      await api.delete("/api/test/1");

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/api/test/1", undefined);
    });

    it("api.delete passes config options", async () => {
      const config = { params: { force: true } };
      await api.delete("/api/test/1", config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/api/test/1", config);
    });
  });

  describe("type safety", () => {
    it("api.get returns typed response data", async () => {
      interface TestData {
        id: number;
        name: string;
      }

      mockAxiosInstance.get.mockResolvedValue({
        data: { id: 1, name: "Test" },
        status: 200,
      });

      const response = await api.get<TestData>("/api/test");

      // TypeScript should infer the correct type
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe("Test");
    });
  });
});
