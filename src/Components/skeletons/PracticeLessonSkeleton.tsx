import { Box, Card, Skeleton, useTheme, useMediaQuery } from "@mui/material";

const PracticeLessonSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
        pb: 8,
      }}
    >
      {/* Title */}
      <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />

      <Card
        sx={{
          m: isMobile ? 1 : 8,
          p: 0,
          minWidth: isMobile ? "95%" : "50%",
          maxWidth: isMobile ? "100%" : "600px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 4,
          position: "relative", // Essential for the absolute ghost element
          overflow: "visible", // Allow ghost to be seen if it slightly overflows (though we keep it inside)
        }}
      >
        <Box
          sx={{
            p: isMobile ? 3 : 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Header */}
          <Skeleton
            variant="text"
            width="30%"
            height={20}
            sx={{ mb: 2, alignSelf: "center" }}
          />

          {/* Source Sentence Block (Emitter) */}
          <Skeleton
            variant="rectangular"
            width="80%"
            height={60}
            sx={{
              mb: 4,
              borderRadius: 2,
              animation: "pulse-source 3s ease-in-out infinite",
              zIndex: 2,
            }}
          />

          {/* The Ghost/Stream Element - Absolutely positioned to start at source */}
          <Skeleton
            variant="rectangular"
            width="80%"
            height={60}
            sx={{
              position: "absolute",
              top: isMobile ? 80 : 100, // Adjust based on padding/layout
              borderRadius: 2,
              opacity: 0,
              zIndex: 1,
              animation: "stream-flow 3s ease-in-out infinite",
              backgroundColor: theme.palette.primary.main, // Give it a tint color
            }}
          />

          {/* Input Field (Target) */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={56}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "2px solid transparent",
              animation: "pulse-target 3s ease-in-out infinite",
            }}
          />

          {/* Button */}
          <Skeleton
            variant="rectangular"
            width="100%"
            height={50}
            sx={{
              borderRadius: 3,
              animation: "pulse-button 3s ease-in-out infinite",
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default PracticeLessonSkeleton;
