import { Box, Skeleton, useTheme, useMediaQuery } from "@mui/material";

const PageSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      {/* Header Skeleton */}
      <Skeleton
        variant="rectangular"
        width={isMobile ? "80%" : "40%"}
        height={isMobile ? 40 : 60}
        sx={{ mb: 4, borderRadius: 2 }}
      />

      {/* Content Areas */}
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ borderRadius: 2, width: "100%" }}
        />
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ borderRadius: 2, width: "100%" }}
        />
        <Skeleton
          variant="rectangular"
          height={120}
          sx={{ borderRadius: 2, width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default PageSkeleton;
