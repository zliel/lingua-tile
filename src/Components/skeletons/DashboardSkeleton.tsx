import { Box, Grid, Skeleton, Typography } from "@mui/material";

const DashboardSkeleton = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
        <Grid width="100%" container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 4 }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardSkeleton;
