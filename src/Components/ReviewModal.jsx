import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useLessonReview from "../hooks/useLessonReview";

function ReviewModal({ open, setOpen, lessonId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);
  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    setOpen,
    setIsLoading,
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (open && !isLoading) {
        switch (event.key) {
          case "1":
            handlePerformanceReview(0.1);
            break;
          case "2":
            handlePerformanceReview(0.45);
            break;
          case "3":
            handlePerformanceReview(0.7);
            break;
          case "4":
            handlePerformanceReview(0.9);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [open, handlePerformanceReview, isLoading]);

  const reviewOptions = [
    { label: "Again", value: 0.1, keyBinding: isMobile ? "" : "(1)" },
    { label: "Hard", value: 0.45, keyBinding: isMobile ? "" : "(2)" },
    { label: "Good", value: 0.7, keyBinding: isMobile ? "" : "(3)" },
    { label: "Easy", value: 0.9, keyBinding: isMobile ? "" : "(4)" },
  ];

  return (
    <Modal
      open={open}
      sx={{ backdropFilter: "blur(4px)" }}
      onClose={() => setOpen(false)}
    >
      {isLoading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            zIndex: 1300,
          }}
        >
          <CircularProgress
            size="5rem"
            sx={{
              position: "absolute",
              top: "35%",
              "&:focus": { outline: "5px solid " + theme.palette.primary.main },
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "40%",
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
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            gap={isMobile ? 2 : 2}
          >
            {reviewOptions.map((option) => (
              <Button
                key={option.label}
                variant="contained"
                color="primary"
                sx={getButtonStyle(isMobile)}
                onClick={() => {
                  handlePerformanceReview(option.value);
                }}
              >
                {option.label} {option.keyBinding}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Modal>
  );
}

const getButtonStyle = (isMobile) => ({
  minWidth: isMobile ? 48 : 85,
  px: 1.25,
  fontSize: "1rem",
});

export default ReviewModal;
