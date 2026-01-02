import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useSnackbar } from "./SnackbarContext";

interface ReviewData {
  lesson_id: string;
  overall_performance: number;
  timestamp: number;
  username: string;
}

interface OfflineContextType {
  isOnline: boolean;
  addToQueue: (review: ReviewData) => void;
  isPending: (lessonId: string) => boolean;
  sync: () => Promise<void>;
  clearQueue: () => void;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  addToQueue: () => { },
  isPending: () => false,
  sync: async () => { },
  clearQueue: () => { },
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [queue, setQueue] = useState<ReviewData[]>(() => {
    const saved = localStorage.getItem("offlineReviewQueue");
    if (!saved) return [];
    try {
      // Try to decode base64, fallback to raw JSON if it fails (migration)
      const decoded = atob(saved);
      return JSON.parse(decoded);
    } catch (e) {
      try {
        return JSON.parse(saved);
      } catch (e2) {
        return [];
      }
    }
  });

  const queueRef = useRef(queue);

  // Keep ref in sync with state and persist with obfuscation
  useEffect(() => {
    queueRef.current = queue;
    const json = JSON.stringify(queue);
    const encoded = btoa(json);
    localStorage.setItem("offlineReviewQueue", encoded);
  }, [queue]);

  const addToQueue = useCallback((review: ReviewData) => {
    setQueue((prev) => {
      // Remove existing pending review for this lesson AND user to avoid duplicates
      const filtered = prev.filter(
        (r) =>
          !(r.lesson_id === review.lesson_id && r.username === review.username),
      );
      return [...filtered, review];
    });
  }, []);

  const isPending = useCallback(
    (lessonId: string) => {
      if (!authData?.username) return false;
      return queue.some(
        (r) => r.lesson_id === lessonId && r.username === authData.username,
      );
    },
    [queue, authData],
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem("offlineReviewQueue");
    showSnackbar("Offline data cleared.", "success");
  }, [showSnackbar]);

  const sync = useCallback(async () => {
    const currentQueue = queueRef.current;
    if (
      currentQueue.length === 0 ||
      !navigator.onLine ||
      !authData?.token ||
      !authData?.username
    )
      return;

    // Only sync items for the current user
    const userQueue = currentQueue.filter(
      (r) => r.username === authData.username,
    );
    if (userQueue.length === 0) return;

    const otherUsersQueue = currentQueue.filter(
      (r) => r.username !== authData.username,
    );

    const failedReviews: ReviewData[] = [];
    let successCount = 0;
    let authError = false;

    for (const review of userQueue) {
      if (authError) {
        failedReviews.push(review);
        continue;
      }

      try {
        await axios.post(
          `${import.meta.env.VITE_APP_API_BASE}/api/lessons/review`,
          {
            lesson_id: review.lesson_id,
            overall_performance: review.overall_performance,
          },
          {
            headers: { Authorization: `Bearer ${authData.token}` },
          },
        );
        successCount++;
      } catch (error: any) {
        console.error("Failed to sync review:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          authError = true;
          failedReviews.push(review);
        } else {
          failedReviews.push(review);
        }
      }
    }

    // Update queue: keep other users' items + failed items for current user
    if (failedReviews.length !== userQueue.length || successCount > 0) {
      setQueue([...otherUsersQueue, ...failedReviews]);
    }

    if (successCount > 0) {
      showSnackbar(`Synced ${successCount} offline reviews`, "success");
    }
    if (authError) {
      showSnackbar(
        "Sync paused: Authentication failed. Please log in again.",
        "error",
      );
    }
  }, [authData, showSnackbar]);

  // Monitor network status and app visibility
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sync();
    };
    const handleOffline = () => setIsOnline(false);

    // Also check when app comes into focus/visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine) {
        setIsOnline(true);
        sync();
      }
    };

    const handleFocus = () => {
      if (navigator.onLine) {
        setIsOnline(true);
        sync();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [sync]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline) {
      sync();
    }
  }, [isOnline, sync]);

  return (
    <OfflineContext.Provider
      value={{ isOnline, addToQueue, isPending, sync, clearQueue }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export default OfflineContext;
