import { Box, Skeleton, useTheme, useMediaQuery } from "@mui/material";

const FlashcardListSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: isMobile ? 2 : 4,
        width: isMobile ? "100%" : "auto",
        px: isMobile ? 1 : 0,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: isMobile ? "90%" : 400,
          height: isMobile ? 400 : 500,
          mb: 2,
        }}
      >
        {/* Static Background Card Stack */}
        <>
          <Skeleton
            variant="rectangular"
            width={isMobile ? "100%" : 400}
            height={isMobile ? 400 : 500}
            animation={false}
            sx={{
              position: "absolute",
              top: 0,
              left: -12,
              borderRadius: 4,
              opacity: 0.2,
              transform: "rotate(2deg)",
              zIndex: 0,
            }}
          />
          <Skeleton
            variant="rectangular"
            width={isMobile ? "100%" : 400}
            height={isMobile ? 400 : 500}
            animation={false}
            sx={{
              position: "absolute",
              top: 0,
              left: -6, // Slight offset
              borderRadius: 4,
              opacity: 0.2,
              transform: "rotate(-1deg)", // Static rotation
              zIndex: 0,
            }}
          />
        </>

        {/* Main Card with Swipe Animation */}
        <Skeleton
          variant="rectangular"
          width={isMobile ? "100%" : 400}
          height={isMobile ? 400 : 500}
          sx={{
            borderRadius: 4,
            mb: 3,
            position: "relative",
            zIndex: 1,
            animation: "swipe-out-in 1.5s infinite ease-in-out",
          }}
        />
      </Box>

      {/* Progress Bar Skeleton */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={8}
          sx={{ borderRadius: 4 }}
        />
        <Skeleton variant="text" width={40} height={20} />
      </Box>
    </Box>
  );
};

export default FlashcardListSkeleton;
