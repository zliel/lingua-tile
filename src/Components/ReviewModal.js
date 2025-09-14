import React from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ReviewModal({ open, setOpen, handlePerformanceReview, isMobile }) {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          gap: isMobile ? 1 : 2,
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
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.1);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 60 : 85,
              px: isMobile ? 1 : 1.5,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
            }}
          >
            Again (1)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.45);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 60 : 85,
              px: isMobile ? 1 : 1.5,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
            }}
          >
            Hard (2)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.7);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 60 : 85,
              px: isMobile ? 1 : 1.5,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
            }}
          >
            Good (3)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.9);
            }}
            size={isMobile ? "small" : "medium"}
            sx={{
              minWidth: isMobile ? 60 : 85,
              px: isMobile ? 1 : 1.5,
              fontSize: isMobile ? "0.8rem" : "0.9rem",
            }}
          >
            Easy (4)
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ReviewModal;
