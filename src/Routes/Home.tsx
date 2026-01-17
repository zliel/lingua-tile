import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/Contexts/AuthContext";
import { fetchLessons, fetchReviews, fetchSections } from "@/hooks/useLessons";
import { useEffect } from "react";
import { HeroSection } from "@/Components/home/HeroSection";
import { CTASection } from "@/Components/home/CTASection";
import { InfoSection } from "@/Components/home/InfoSection";

function Home() {
  const { authData } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (authData?.token) {
      queryClient.prefetchQuery({
        queryKey: ["lessons", authData.token],
        queryFn: () => fetchLessons(),
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ["sections", authData.token],
        queryFn: () => fetchSections(),
        staleTime: 5 * 60 * 1000,
      });

      queryClient.prefetchQuery({
        queryKey: ["reviews", authData.token],
        queryFn: () => fetchReviews(),
        initialData: () => {
          const token = localStorage.getItem("token");
          if (!token) {
            return [];
          }
          return undefined;
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [authData, queryClient]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <HeroSection />
      <InfoSection />
      <CTASection />
    </Box>
  );
}

export default Home;
