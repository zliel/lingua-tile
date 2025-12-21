import { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  CircularProgress,
  Popover,
  Stack,
  useTheme,
  useMediaQuery,
  keyframes,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import confetti from "canvas-confetti";
import useLessonReview from "../hooks/useLessonReview";
import { useNavigate } from "react-router";
import { XpSummary } from "./XpSummary";

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  70% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
`;

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const navigate = useNavigate();

  const handleReviewComplete = (data: any) => {
    setSummaryData(data);
  };

  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    setOpen,
    setIsLoading,
    handleReviewComplete,
  );

  const handleContinue = () => {
    setOpen(false);
    navigate("/lessons");
  };

  useEffect(() => {
    if (summaryData?.leveled_up || (open && !isLoading && !summaryData)) {
      const colors = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.grammar.main,
        "#FFC107",
        "#4CAF50",
      ];
      confetti({
        particleCount: summaryData?.leveled_up ? 300 : 150,
        spread: summaryData?.leveled_up ? 180 : 100,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: theme.zIndex.modal + 1,
      });
    }
  }, [open, isLoading, theme, summaryData]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (open && !isLoading && !summaryData) {
        switch (event.key) {
          case "1":
            handlePerformanceReview(1);
            break;
          case "2":
            handlePerformanceReview(2);
            break;
          case "3":
            handlePerformanceReview(3);
            break;
          case "4":
            handlePerformanceReview(4);
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
  }, [open, handlePerformanceReview, isLoading, summaryData]);

  const reviewOptions = [
    { label: "Again", value: 1, keyBinding: isMobile ? "" : "(1)" },
    { label: "Hard", value: 2, keyBinding: isMobile ? "" : "(2)" },
    { label: "Good", value: 3, keyBinding: isMobile ? "" : "(3)" },
    { label: "Easy", value: 4, keyBinding: isMobile ? "" : "(4)" },
  ];

  return (
    <Modal
      open={open}
      sx={{ backdropFilter: "blur(4px)" }}
      onClose={() => {
        if (!isLoading && !summaryData) setOpen(false);
      }}
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
      ) : summaryData ? (
        <XpSummary summaryData={summaryData} handleContinue={handleContinue} />
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
            border: `1px solid ${
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.4)"
            }`,
            p: 4,
            outline: "none",
            animation: `${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 8, right: 48 }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <HelpOutlineIcon />
          </IconButton>
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  py: 1,
                  px: 2,
                  mx: 0.5,
                  maxWidth: isMobile ? "90vw" : 320,
                  borderRadius: 2,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(30, 30, 30, 0.95)"
                      : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${theme.palette.divider}`,
                },
              },
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Grading Guide
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="error.main"
                  fontWeight="bold"
                >
                  Again
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect response. The lesson will be shown again soon.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="warning.main"
                  fontWeight="bold"
                >
                  Hard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct, but required significant effort or hesitation.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="info.main"
                  fontWeight="bold"
                >
                  Good
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct with a reasonable amount of effort.
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="success.main"
                  fontWeight="bold"
                >
                  Easy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct immediately without hesitation.
                </Typography>
              </Box>
            </Stack>
          </Popover>
          <Typography
            variant="h4"
            component="h2"
            textAlign={"center"}
            sx={{
              fontWeight: "bold",
              mt: isMobile ? 1 : 0,
              mb: 1,
              color: theme.palette.text.primary,
            }}
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
