import { useAuth } from "@/Contexts/AuthContext";
import { Review } from "@/types/lessons";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useIsFetching } from "@tanstack/react-query";

export const LessonDifficultyChart = ({ reviews }: { reviews: Review[] }) => {
  const { authData } = useAuth();
  const isFetchingReviews = useIsFetching({
    queryKey: ["reviews", authData?.token],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const difficultyCounts = () => {
    const counts = Array(10).fill(0);

    reviews?.forEach((review) => {
      const difficulty = review.card_object.difficulty ?? 0; // Will be something like 7.13013
      const index = Math.min(Math.floor(difficulty), 9); // Map to index 0-9
      counts[index]++;
    });

    return counts;
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" textAlign="center">
        Lesson Difficulty
      </Typography>
      <Typography variant="subtitle1" textAlign="center">
        Used by FSRS to Help With Scheduling
      </Typography>
      <BarChart
        xAxis={[
          {
            id: "xAxis",
            label: "Lesson Difficulty (%)",
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            valueFormatter: (value: number) => `${value}-${value + 1}`,
            colorMap: {
              type: "continuous",
              min: 0,
              max: 10,
              color: [theme.palette.primary.main, theme.palette.secondary.main],
            },
          },
        ]}
        series={[
          {
            data: difficultyCounts(),
          },
        ]}
        yAxis={[
          {
            id: "yAxis",
            label: "Number of Lessons",
            tickMinStep: 1,
            width: 35,
          },
        ]}
        loading={isFetchingReviews > 0}
        height={300}
        sx={{ width: "100%", minWidth: isMobile ? 100 : "auto" }}
      />
    </Box>
  );
};
