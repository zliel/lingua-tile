import {
  Container,
  Paper,
  Grid,
  Skeleton,
  Stack,
  Card,
  CardContent,
  Box,
  useTheme,
  SxProps,
} from "@mui/material";

export const ProfileSkeleton = ({ sx }: { sx?: SxProps }) => {
  const theme = useTheme();
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ...sx }}>
      {/* Header Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Skeleton variant="circular" width={80} height={80} />
          </Grid>
          <Grid size="grow">
            <Skeleton variant="text" width={200} height={40} />
            <Stack direction="row" spacing={1} mt={1}>
              <Skeleton variant="rounded" width={60} height={24} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Stack>
          </Grid>
          <Grid>
            <Skeleton
              variant="rounded"
              width={120}
              height={36}
              sx={{ mt: 6 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Skeleton */}
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3].map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton variant="text" width={40} height={32} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Skeleton */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: 400,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: 400,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: 300,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
