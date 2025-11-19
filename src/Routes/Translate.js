import React from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import TranslationForm from "../Components/TranslationForm";

function Translate() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ padding: isMobile ? "1em" : "2em" }}>
      <TranslationForm />
    </Box>
  );
}

export default Translate;
