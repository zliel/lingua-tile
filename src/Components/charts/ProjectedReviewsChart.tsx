import { useAuth } from "@/Contexts/AuthContext";
import { Review } from "@/types/lessons";
import { useState } from "react";
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useIsFetching } from "@tanstack/react-query";
import dayjs from "dayjs";

export const ProjectedReviewsChart = ({ reviews }: { reviews: Review[] }) => {
  const { authData } = useAuth();
  const isFetchingReviews = useIsFetching({
    queryKey: ["reviews", authData?.token],
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [timeSpan, setTimeSpan] = useState<number>(isMobile ? 7 : 30);

  const handleTimeSpanChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeSpan: number,
  ) => {
    if (newTimeSpan !== null) {
      setTimeSpan(newTimeSpan);
    }
  };

  const getChartDays = () => {
    return Array.from({ length: timeSpan }, (_, i) =>
      dayjs().add(i, "day").format("MM/DD"),
    );
  };

  const chartDays = getChartDays();

  const reviewsPerDay = chartDays.map((day) => {
    if (!reviews || reviews.length == 0) return 0;
    return reviews.filter(
      (review) => dayjs(review.next_review).format("MM/DD") === day,
    ).length;
  });

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" textAlign="center">
        Projected Upcoming Reviews
      </Typography>
      <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={timeSpan}
          exclusive
          onChange={handleTimeSpanChange}
          aria-label="time span"
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: (theme) => theme.palette.action.hover,
            p: 0.5,
            mt: 1,
            borderRadius: 10,
            "& .MuiToggleButton-root": {
              border: 0,
              borderRadius: 10,
              px: isMobile ? 2 : 3,
              py: isMobile ? 0.5 : 1,
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              "&.Mui-selected": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                boxShadow: 2,
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                },
              },
            },
          }}
        >
          <ToggleButton value={7} disableRipple>
            1 Week
          </ToggleButton>
          <ToggleButton value={14} disableRipple>
            2 Weeks
          </ToggleButton>
          <ToggleButton value={30} disableRipple>
            1 Month
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <BarChart
        xAxis={[
          { id: "xAxis", data: chartDays, scaleType: "band", label: "Date" },
        ]}
        yAxis={[
          {
            id: "yAxis",
            tickMinStep: 1,
            data: [1, 2, 3, 4, 5, 6, 7],
            label: "Number of Lessons to Review",
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
        sx={{ width: "100%", minWidth: isMobile ? 100 : "auto" }}
      />
    </Box>
  );
};
