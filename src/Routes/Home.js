import React from "react";
import { Box, Typography } from "@mui/material";
import Logo from "../assets/LinguaTile Logo.png";

function Home() {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        margin: "auto",
        display: "flex",
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
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
        src={Logo}
      />
      <Typography variant={"h6"} sx={{ textAlign: "center" }}>
        Welcome to LinguaTile, a learning platform focused on the Japanese
        language.
      </Typography>
    </Box>
  );
}

export default Home;
