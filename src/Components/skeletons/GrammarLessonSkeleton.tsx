import { Box, Card, Skeleton, useTheme, useMediaQuery } from "@mui/material";

const GrammarLessonSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        width: "85%",
        margin: "auto",
        mt: 4,
        mb: 8,
        p: 0,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(30, 30, 30, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: 4,
        animation: "fade-enter 0.5s ease-out", // Container fade in
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
        {/* Title Drops in from Top and drops out */}
        <Skeleton
          variant="text"
          width="60%"
          height={60}
          sx={{
            mb: 4,
            animation: "drop-in-out 3s ease-in-out infinite",
            opacity: 0,
          }}
        />

        {/* Content Blocks Slide in/out from Alternating Sides */}
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              mb: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              animation: `${index % 2 === 0 ? "slide-in-out-left" : "slide-in-out-right"} 3s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`, // Staggered delay
              opacity: 0,
            }}
          >
            {/* Subtitle */}
            <Skeleton variant="text" width="40%" height={30} sx={{ alignSelf: index % 2 === 0 ? "flex-start" : "flex-end" }} />

            {/* Paragraph lines */}
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
          </Box>
        ))}

        {/* Button at bottom */}
        <Skeleton
          variant="rectangular"
          width={200}
          height={50}
          sx={{
            mt: 4,
            borderRadius: 3,
            animation: "drop-in-out 3s ease-in-out infinite",
            animationDelay: "0.8s",
            opacity: 0,
          }}
        />
      </Box>
    </Card>
  );
};

export default GrammarLessonSkeleton;
