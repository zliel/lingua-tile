import { useAuth } from "@/Contexts/AuthContext";
import { Review } from "@/types/lessons"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useIsFetching } from "@tanstack/react-query";
import dayjs from "dayjs";

export const ProjectedReviewsChart = ({ reviews }: { reviews: Review[] }) => {
  const { authData } = useAuth();
  const isFetchingReviews = useIsFetching({ queryKey: ["reviews", authData?.token] });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const upcomingMonth = () => {
    return Array.from({ length: 30 }, (_, i) => dayjs().add(i, "day").format("MM/DD"));
  }

  const reviewsPerDay = upcomingMonth().map(day => {
    if (!reviews || reviews.length == 0) return 0;
    return reviews.filter(review => dayjs(review.next_review).format("MM/DD") === day).length;
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" textAlign="center">
        Projected Upcoming Reviews
      </Typography>
      <BarChart
        xAxis={[{ id: "xAxis", data: upcomingMonth(), label: "Day of the Month" }]}
        yAxis={[{ id: "yAxis", tickMinStep: 1, data: [1, 2, 3, 4, 5, 6, 7], label: "Number of Lessons to Review" }]}
        series={[
          {
            data: reviewsPerDay,
            color: theme.palette.primary.main
          },
        ]}
        height={300}
        loading={isFetchingReviews > 0}
        sx={{ minWidth: isMobile ? 100 : 600 }}
      />
    </Box>
  )
}

