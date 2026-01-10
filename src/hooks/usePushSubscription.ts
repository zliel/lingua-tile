import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushSubscription = () => {
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    window.Notification?.permission || "default",
  );

  const checkSubscriptionStatus = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
      setPermission(window.Notification?.permission || "default");
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  }, []);

  useEffect(() => {
    checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  const subscribe = async () => {
    setIsLoading(true);
    try {
      if (!("serviceWorker" in navigator)) {
        showSnackbar("Service Worker not supported", "error");
        return false;
      }

      if (!window.Notification) {
        showSnackbar("Notifications not supported", "error");
        return false;
      }

      const permissionResult = await window.Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== "granted") {
        showSnackbar("Permission denied", "error");
        return false;
      }

      const keyResponse = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/notifications/vapid-public-key`,
      );
      const vapidPublicKey = keyResponse.data.publicKey;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await axios.post(
        `${import.meta.env.VITE_APP_API_BASE}/api/notifications/subscribe`,
        subscription.toJSON(),
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );

      setIsSubscribed(true);
      showSnackbar("Notifications enabled!", "success");
      return true;
    } catch (error: any) {
      console.error("Subscription error:", error);
      showSnackbar(
        `Error: ${error.response?.data?.detail || error.message}`,
        "error",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await axios.post(
            `${import.meta.env.VITE_APP_API_BASE}/api/notifications/unsubscribe`,
            { endpoint: subscription.endpoint },
            {
              headers: { Authorization: `Bearer ${authData?.token}` },
            },
          );
        }
      }
      setIsSubscribed(false);
      showSnackbar("Notifications disabled", "success");
      return true;
    } catch (error: any) {
      console.error("Unsubscribe error:", error);
      showSnackbar(
        `Error: ${error.response?.data?.detail || error.message}`,
        "error",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  };
};
