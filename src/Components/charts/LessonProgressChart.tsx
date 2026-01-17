import { useAuth } from "@/Contexts/AuthContext";
import { Review } from "@/types/lessons";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { api } from "@/utils/apiClient";

export const LessonProgressChart = ({ reviews }: { reviews: Review[] }) => {
  const { authData } = useAuth();
  const isFetchingReviews = useIsFetching({
    queryKey: ["reviews", authData?.token],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: lessonCount, isLoading: isLoadingLessonCount } = useQuery({
    queryKey: ["lessonCount"],
    queryFn: async () => {
      const response = await api.get<{ total: number }>("/api/lessons/total");
      return response.data.total;
    },
  });

  const getStateCounts = () => {
    const counts = {
      new: 0,
      learning: 0,
      review: 0,
      relearning: 0,
    };

    reviews?.forEach((review) => {
      const state = review.card_object.state;
      if (state === 0) counts.new++;
      else if (state === 1) counts.learning++;
      else if (state === 2) counts.review++;
      else if (state === 3) counts.relearning++;
    });

    // Any lessons not reviewed yet are considered "new"
    if (lessonCount) {
      counts.new += lessonCount - reviews.length;
    }

    return [
      {
        id: 0,
        value: counts.new,
        label: "New",
        color: theme.palette.info.main,
      },
      {
        id: 1,
        value: counts.learning,
        label: "Learning",
        color: theme.palette.warning.main,
      },
      {
        id: 2,
        value: counts.review,
        label: "Review",
        color: theme.palette.success.main,
      },
      {
        id: 3,
        value: counts.relearning,
        label: "Relearning",
        color: theme.palette.error.main,
      },
    ].filter((item) => item.value > 0);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" textAlign="center">
        Lesson Progress
      </Typography>
      <PieChart
        series={[
          {
            data: getStateCounts(),
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            innerRadius: 30,
            outerRadius: 100,
            paddingAngle: 5,
            cornerRadius: 5,
          },
        ]}
        height={300}
        loading={isFetchingReviews > 0 || isLoadingLessonCount}
        slotProps={{
          legend: {
            direction: isMobile ? "vertical" : "horizontal",
            position: {
              vertical: "middle",
              horizontal: "center",
            } as any,
          },
        }}
        sx={{ width: "100%", minWidth: isMobile ? 200 : "auto" }}
      />
    </Box>
  );
};
