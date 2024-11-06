import React from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ReviewModal({ open, setOpen, handlePerformanceReview }) {
  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
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
        <Typography sx={{ mt: 2 }}>
          How would you rate your performance?
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.1);
            }}
          >
            Again (1)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.45);
            }}
          >
            Hard (2)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.7);
            }}
          >
            Good (3)
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handlePerformanceReview(0.9);
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
