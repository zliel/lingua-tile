import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import axios, { AxiosHeaders } from "axios";

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

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();

  (globalThis as any).__test_interceptorCallbacks =
    (globalThis as any).__test_interceptorCallbacks || {};

  const mockInterceptors = {
    request: {
      use: vi.fn((onFulfilled, onRejected) => {
        (globalThis as any).__test_interceptorCallbacks.requestFulfilled =
          onFulfilled;
        (globalThis as any).__test_interceptorCallbacks.requestRejected =
          onRejected;
        return 0; // Return interceptor ID
      }),
      eject: vi.fn(),
      clear: vi.fn(),
    },
    response: {
      use: vi.fn((onFulfilled, onRejected) => {
        (globalThis as any).__test_interceptorCallbacks.responseFulfilled =
          onFulfilled;
        (globalThis as any).__test_interceptorCallbacks.responseRejected =
          onRejected;
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

import { api } from "./apiClient";

const mockAxiosInstance = (axios.create as Mock).mock.results[0]?.value as {
  get: Mock;
  post: Mock;
  put: Mock;
  delete: Mock;
};

const getInterceptorCallbacks = () =>
  (globalThis as any).__test_interceptorCallbacks as {
    requestFulfilled?: (config: any) => any;
    requestRejected?: (error: any) => any;
    responseFulfilled?: (response: any) => any;
    responseRejected?: (error: any) => any;
  };

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    if (mockAxiosInstance) {
      mockAxiosInstance.get.mockResolvedValue({ data: { test: true } });
      mockAxiosInstance.post.mockResolvedValue({ data: { created: true } });
      mockAxiosInstance.put.mockResolvedValue({ data: { updated: true } });
      mockAxiosInstance.delete.mockResolvedValue({ data: { deleted: true } });
    }
  });

  describe("axios.create configuration", () => {
    it("creates an axios instance with interceptors configured", () => {
      const callbacks = getInterceptorCallbacks();

      expect(callbacks.requestFulfilled).toBeDefined();
      expect(callbacks.responseFulfilled).toBeDefined();
      expect(callbacks.responseRejected).toBeDefined();
    });

    it("configures request and response interceptors correctly", () => {
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

      localStorageMock.setItem("token", "test-jwt-token");

      const mockConfig = {
        headers: new AxiosHeaders(),
        url: "/api/test",
      };

      const result = onFulfilled!(mockConfig);

      expect(result.headers.Authorization).toBe("Bearer test-jwt-token");
    });

    it("does not inject Authorization header when no token exists", () => {
      const callbacks = getInterceptorCallbacks();
      const onFulfilled = callbacks.requestFulfilled;
      expect(onFulfilled).toBeDefined();

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
      };

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(onRejected!(networkError)).rejects.toEqual(networkError);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Network error:",
        "Network Error",
      );
      consoleSpy.mockRestore();
    });
  });

  describe("api wrapper functions", () => {
    it("api.get calls apiClient.get with correct arguments", async () => {
      await api.get("/api/test");

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        "/api/test",
        undefined,
      );
    });

    it("api.get passes config options", async () => {
      const config = { params: { id: 123 } };
      await api.get("/api/test", config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/api/test", config);
    });

    it("api.post calls apiClient.post with correct arguments", async () => {
      const data = { name: "test" };
      await api.post("/api/test", data);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/api/test",
        data,
        undefined,
      );
    });

    it("api.post passes config options", async () => {
      const data = { name: "test" };
      const config = { headers: { "X-Custom": "value" } };
      await api.post("/api/test", data, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        "/api/test",
        data,
        config,
      );
    });

    it("api.put calls apiClient.put with correct arguments", async () => {
      const data = { name: "updated" };
      await api.put("/api/test/1", data);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        "/api/test/1",
        data,
        undefined,
      );
    });

    it("api.delete calls apiClient.delete with correct arguments", async () => {
      await api.delete("/api/test/1");

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        "/api/test/1",
        undefined,
      );
    });

    it("api.delete passes config options", async () => {
      const config = { params: { force: true } };
      await api.delete("/api/test/1", config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        "/api/test/1",
        config,
      );
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

      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe("Test");
    });
  });
});
