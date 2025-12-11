import { useEffect } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useAppBadge = () => {
  const { authData } = useAuth();

  const { data: reviews } = useQuery({
    queryKey: ["reviews", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews`,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        },
      );
      return response.data;
    },
    enabled: !!authData && !!authData.isLoggedIn && "setAppBadge" in navigator,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!("setAppBadge" in navigator)) return;

    const setBadge = async () => {
      try {
        if (reviews && reviews.length > 0) {
          await navigator.setAppBadge(reviews.length);
        } else {
          await navigator.clearAppBadge();
        }
      } catch (e) {
        console.error("Failed to set app badge:", e);
      }
    };

    setBadge();
  }, [reviews]);
};
