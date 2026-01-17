import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from "vitest";
import { usePushSubscription } from "./usePushSubscription";
import { api } from "@/utils/apiClient";
import * as AuthContext from "@/Contexts/AuthContext";
import * as SnackbarContext from "@/Contexts/SnackbarContext";

// Mock the apiClient module
vi.mock("@/utils/apiClient", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("usePushSubscription Hook", () => {
  const mockAuthData = { token: "mock-token" };
  const mockShowSnackbar = vi.fn();

  // SW Mocks
  const mockSubscribe = vi.fn();
  const mockUnsubscribe = vi.fn();
  const mockGetSubscription = vi.fn();

  const mockPushManager = {
    getSubscription: mockGetSubscription,
    subscribe: mockSubscribe,
  };

  const mockRegistration = {
    pushManager: mockPushManager,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(AuthContext, "useAuth").mockReturnValue({
      authData: mockAuthData,
    } as any);
    vi.spyOn(SnackbarContext, "useSnackbar").mockReturnValue({
      showSnackbar: mockShowSnackbar,
    });

    // @ts-ignore
    global.Notification = {
      permission: "default",
      requestPermission: vi.fn(),
    };

    Object.defineProperty(navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(mockRegistration),
      },
      writable: true,
      configurable: true,
    });

    // Mock window.atob for VAPID key helper IF logic uses it
    // The logic uses it: urlBase64ToUint8Array -> window.atob
    // JSDOM provides atob, so we might just need to ensure the key we provide is valid base64
    // "BAPP" is 4 chars, which is valid base64.
  });

  afterEach(() => {
    // @ts-ignore
    delete navigator.serviceWorker;
  });

  it("checks subscription status on mount", async () => {
    mockGetSubscription.mockResolvedValue({ endpoint: "test-endpoint" });

    const { result } = renderHook(() => usePushSubscription());

    await waitFor(() => expect(result.current.isSubscribed).toBe(true));
    expect(mockGetSubscription).toHaveBeenCalled();
  });

  it("subscribes successfully", async () => {
    mockGetSubscription.mockResolvedValue(null);
    // @ts-ignore
    Notification.requestPermission.mockResolvedValue("granted");
    (api.get as Mock).mockResolvedValueOnce({ data: { publicKey: "BAPP" } });

    mockSubscribe.mockResolvedValue({
      toJSON: () => ({ endpoint: "new-endpoint" }),
    });
    (api.post as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => usePushSubscription());

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.isSubscribed).toBe(true);

    expect(Notification.requestPermission).toHaveBeenCalled();
    expect(mockSubscribe).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith(
      "/api/notifications/subscribe",
      { endpoint: "new-endpoint" }
    );
    expect(result.current.isSubscribed).toBe(true);
  });

  it("handles permission denied", async () => {
    // @ts-ignore
    Notification.requestPermission.mockResolvedValue("denied");

    const { result } = renderHook(() => usePushSubscription());

    await act(async () => {
      const success = await result.current.subscribe();
      expect(success).toBe(false);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith("Permission denied", "error");
    expect(mockSubscribe).not.toHaveBeenCalled();
  });

  it("unsubscribes successfully", async () => {
    mockGetSubscription.mockResolvedValue({
      unsubscribe: mockUnsubscribe,
      endpoint: "test-endpoint",
    });
    (api.post as Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => usePushSubscription());
    // Wait for initial check
    await waitFor(() => expect(result.current.isSubscribed).toBe(true));

    await act(async () => {
      const success = await result.current.unsubscribe();
      expect(success).toBe(true);
    });

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(api.post).toHaveBeenCalledWith(
      "/api/notifications/unsubscribe",
      { endpoint: "test-endpoint" }
    );
    expect(result.current.isSubscribed).toBe(false);
  });
});
