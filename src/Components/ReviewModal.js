import React from "react";
import { Box, Button, IconButton, Modal, Typography, useTheme, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ReviewModal({ open, setOpen, handlePerformanceReview }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90vw" : 500,
          maxWidth: "95vw",
          maxHeight: isMobile ? "80vh" : "60vh",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" textAlign={"center"}>
          Lesson Complete!
        </Typography>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          How would you rate your performance?
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }} gap={isMobile ? 2 : 2}>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.1);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 48 : 85,
              px: 1.25,
              fontSize: isMobile ? "1rem" : "1rem",
            }}
          >
            Again {isMobile ? "" : "(2)"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.45);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 48 : 85,
              px: 1.25,
              fontSize: "1rem"
            }}
          >
            Hard {isMobile ? "" : "(2)"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.7);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 48 : 85,
              px: 1.25,
              fontSize: "1rem"
            }}
          >
            Good {isMobile ? "" : "(3)"}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.9);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 48 : 85,
              px: 1.25,
              fontSize: "1rem"
            }}
          >
            Easy {isMobile ? "" : "(4)"}

          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ReviewModal;
