import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthData } from "../Contexts/AuthContext";

export const fetchLessons = async (token: string | undefined) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_BASE}/api/lessons/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const fetchSections = async (token: string | undefined) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_BASE}/api/sections/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const fetchReviews = async (token: string | undefined) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const useLessons = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["lessons", authData?.token],
    queryFn: () => fetchLessons(authData?.token),
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSections = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["sections", authData?.token],
    queryFn: () => fetchSections(authData?.token),
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
    queryFn: () => fetchReviews(authData?.token),
    initialData: () => {
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

export const fetchReviewHistory = async (token: string | undefined) => {
  const response = await axios.get(
    `${import.meta.env.VITE_APP_API_BASE}/api/lessons/reviews/history/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const useReviewHistory = (authData: AuthData | null) => {
  return useQuery({
    queryKey: ["reviewHistory", authData?.token],
    queryFn: () => fetchReviewHistory(authData?.token),
    enabled: !!authData,
    staleTime: 5 * 60 * 1000,
  });
};
