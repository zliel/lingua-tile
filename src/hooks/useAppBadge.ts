import { useEffect } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/apiClient";
import { Review } from "@/types/lessons";

export const useAppBadge = () => {
  const { authData } = useAuth();

  // Won't use the useReviews hook for this due to its unique requirements
  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["reviews", authData?.token],
    queryFn: async (): Promise<Review[]> => {
      const response = await api.get<Review[]>("/api/lessons/reviews");
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
          const numOverdueReviews = reviews.filter((review: Review) => {
            const reviewDate = new Date(review.next_review);
            reviewDate.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return reviewDate <= today;
          }).length;

          await navigator.setAppBadge(numOverdueReviews);
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
