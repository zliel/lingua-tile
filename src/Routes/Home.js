import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Logo from "../assets/LinguaTile Logo.png";

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "auto",
        display: "flex",
        padding: 2,
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        component={"img"}
        sx={{
          margin: "auto",
          marginTop: 5,
          display: "block",
          marginBottom: 2,
          transition: isMobile ? "" : "transform 0.3s ease",
          "&:hover": {
            transform: isMobile ? "" : "scale(1.1)",
          },
        }}
        src={Logo}
      />
      <Typography
        sx={{ textAlign: "center", fontSize: isMobile ? "1.2rem" : "1.5rem" }}
      >
        Welcome to LinguaTile, a learning platform focused on the Japanese
        language.
      </Typography>
    </Box>
  );
}

export default Home;
