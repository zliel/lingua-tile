import { useQuery } from "@tanstack/react-query";
import { AuthData } from "../Contexts/AuthContext";
import { Lesson, Review, ReviewLog } from "@/types/lessons";
import { Section } from "@/types/sections";
import { api } from "@/utils/apiClient";

export const fetchLessons = async (): Promise<Lesson[]> => {
  const response = await api.get<Lesson[]>("/api/lessons/all");
  return response.data;
};

export const fetchSections = async (): Promise<Section[]> => {
  const response = await api.get<Section[]>("/api/sections/all");
  return response.data;
};

export const fetchReviews = async (): Promise<Review[]> => {
  const response = await api.get<Review[]>("/api/lessons/reviews");
  return response.data;
};

export const useLessons = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: () => fetchLessons(),
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSections = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: () => fetchSections(),
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useReviews = (
  authData: AuthData | null,
  authIsLoading: boolean = false,
) => {
  return useQuery({
    queryKey: ["reviews", authData?.token],
    queryFn: () => fetchReviews(),
    initialData: (): Review[] | undefined => {
      const token = localStorage.getItem("token");
      if (!token) {
        return [];
      }
      return undefined;
    },
    enabled: !authIsLoading && !!authData,
    staleTime: 5 * 60 * 1000,
  });
};

export const fetchReviewHistory = async (): Promise<ReviewLog[]> => {
  const response = await api.get<ReviewLog[]>("/api/lessons/reviews/history/all");
  return response.data;
};

export const useReviewHistory = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["reviewHistory", authData?.token],
    queryFn: () => fetchReviewHistory(),
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });
};
