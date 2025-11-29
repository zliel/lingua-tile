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

function ReviewModal({
  open,
  setOpen,
  lessonId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  lessonId: string;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isLoading, setIsLoading] = useState(false);
  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    setOpen,
    setIsLoading,
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90vw" : 500,
            maxWidth: "95vw",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(30, 30, 30, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px 0 rgba(0, 0, 0, 0.5)"
                : "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            border: `1px solid ${theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.4)"
              }`,
            p: 4,
            outline: "none",
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h2"
            textAlign={"center"}
            sx={{ fontWeight: "bold", mb: 1, color: theme.palette.text.primary }}
          >
            Lesson Complete!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              textAlign: "center",
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            How would you rate your performance?
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {reviewOptions.map((option) => (
              <Button
                key={option.label}
                variant="contained"
                color="primary"
                sx={{
                  flexGrow: 1,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  minWidth: isMobile ? "45%" : "auto",
                }}
                onClick={() => {
                  handlePerformanceReview(option.value);
                }}
              >
                {option.label}
                {!isMobile && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 0.5,
                      opacity: 0.7,
                      fontSize: "0.8rem",
                      fontWeight: "normal",
                    }}
                  >
                    {option.keyBinding}
                  </Typography>
                )}
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Modal>
  );
}



export default ReviewModal;
