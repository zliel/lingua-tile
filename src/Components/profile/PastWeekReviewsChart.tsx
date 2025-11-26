import { useAuth } from "@/Contexts/AuthContext";
import { Review } from "@/types/lessons";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useIsFetching } from "@tanstack/react-query";
import dayjs from "dayjs";

export const PastWeekReviewsChart = ({ reviews }: { reviews: Review[] }) => {
  const { authData } = useAuth();
  const isFetchingReviews = useIsFetching({
    queryKey: ["reviews", authData?.token],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const lastWeekDays = () => {
    return Array.from({ length: 7 }, (_, i) =>
      dayjs()
        .subtract(6 - i, "day")
        .format("YYYY-MM-DD"),
    );
  };

  const reviewsPerDay = lastWeekDays().map((day) => {
    if (!reviews || reviews.length == 0) return 0;
    return reviews.filter((review) =>
      dayjs(review.card_object.last_review).isSame(day, "day"),
    ).length;
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" textAlign="center">
        Lessons Reviewed This Week
      </Typography>
      <BarChart
        xAxis={[
          {
            id: "xAxis",
            data: lastWeekDays().map((day) => dayjs(day).format("ddd - MM/DD")),
            label: "Day of the Week",
          },
        ]}
        yAxis={[
          {
            id: "yAxis",
            tickMinStep: 1,
            data: [1, 2, 3, 4, 5, 6, 7],
            label: "Lessons Reviewed",
          },
        ]}
        series={[
          {
            data: reviewsPerDay,
            color: theme.palette.primary.main,
          },
        ]}
        height={300}
        loading={isFetchingReviews > 0}
        sx={{ minWidth: isMobile ? 100 : 600 }}
      />
    </Box>
  );
};
