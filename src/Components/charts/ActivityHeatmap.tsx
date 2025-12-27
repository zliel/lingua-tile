import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./ActivityHeatmap.css";
import { Box, Typography, useTheme, Card, useMediaQuery } from "@mui/material";
import dayjs from "dayjs";

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  title?: string;
}

export function ActivityHeatmap({
  data,
  title = "Study Activity",
}: ActivityHeatmapProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Determine start/end dates (last 365 days)
  const today = dayjs();
  const startDate = isMobile
    ? today.subtract(6, "months").toDate()
    : today.subtract(1, "year").toDate();
  const endDate = today.toDate();

  // Map count to classForValue (scale 0-4)
  const getClassForValue = (value: ActivityData | null) => {
    const darkPrefix = theme.palette.mode === "dark" ? "dark" : "";
    if (!value || !value.count) {
      return `${darkPrefix} grade-0`;
    }
    if (value.count >= 20) return "grade-4";
    if (value.count >= 10) return "grade-3";
    if (value.count >= 5) return "grade-2";
    return "grade-1";
  };

  // We will inject CSS variables for the colors to match MUI theme
  const heatMapStyle = {
    "--heatmap-color-0": theme.palette.action.hover,
    "--heatmap-color-1": theme.palette.success.light,
    "--heatmap-color-2": theme.palette.success.main,
    "--heatmap-color-3": theme.palette.success.dark,
    "--heatmap-color-4": theme.palette.secondary.main,
  } as React.CSSProperties;

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 4,
        border: `1px solid ${theme.palette.divider}`,
        height: "100%",
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      <Box sx={{ width: "100%", ...heatMapStyle }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={(value) => getClassForValue(value as any)}
          tooltipDataAttrs={(value: any) => {
            return {
              "data-tip": `${value.date}: ${value.count} reviews`,
            } as any;
          }}
          showWeekdayLabels={false}
          gutterSize={2}
          titleForValue={(value: any) =>
            value ? `${value.date}: ${value.count} reviews` : "No reviews"
          }
        />
      </Box>
    </Card>
  );
}
