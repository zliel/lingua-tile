import {
  Box,
  Divider,
  Skeleton,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";

export const LessonListSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const skeletonCount = isMobile ? 10 : 25;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Loading lessons...
      </Typography>
      {isMobile ? (
        <Box sx={{ width: "90%" }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="50%"
            height={40}
            sx={{ borderRadius: 2, mb: 2 }}
          />
          <Divider
            sx={{
              width: "60%",
              mb: 2,
              borderColor:
                theme.palette.mode === "dark"
                  ? "primary.dark"
                  : "primary.light",
              borderWidth: "1px",
            }}
          />
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <Box key={index} sx={{ width: "100%", mb: 2 }}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                height={60}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="30%"
            height={40}
            sx={{ borderRadius: 2, mb: 2, alignSelf: "start" }}
          />
          <Divider
            sx={{
              width: "33%",
              mb: 4,
              borderColor:
                theme.palette.mode === "dark"
                  ? "primary.dark"
                  : "primary.light",
              borderWidth: "1px",
            }}
          />
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={index}
                sx={{ width: "30%" }}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height={80}
                  sx={{ borderRadius: 2, mb: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
