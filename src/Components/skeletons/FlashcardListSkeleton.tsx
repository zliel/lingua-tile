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
      <Skeleton
        variant="rectangular"
        width={isMobile ? "100%" : 400}
        height={isMobile ? 400 : 500}
        sx={{ borderRadius: 4, mb: 3 }}
      />

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
