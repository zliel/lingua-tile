import { useState } from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Button,
  Icon,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Done } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";
import useLessonReview from "../hooks/useLessonReview";
import ReviewModal from "../Components/ReviewModal";

const GrammarLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { handlePerformanceReview } = useLessonReview(
    lessonId,
    modalOpen,
    setModalOpen,
  );

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lesson", "error");
    },
    enabled: !!authData,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 4,
        }}
      >
        <Skeleton variant="rectangular" width="80%" height={200} />
      </Box>
    );
  }

  if (isError) {
    return <Typography>Error loading lesson.</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "85%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 4,
        mb: 4,
        p: 2.5,
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <MuiMarkdown
        hideLineNumbers
        overrides={getMarkdownOverrides(isMobile, theme)}
      >
        {lesson.content}
      </MuiMarkdown>
      {/* NOTE: Tooltip and disabled button when user is not logged in */}
      <Tooltip
        title={
          !authData.isLoggedIn ? (
            <Typography>You must be logged in to finish the lesson.</Typography>
          ) : (
            <Typography>Finish Lesson</Typography>
          )
        }
        placement={isMobile ? "top" : "right"}
        arrow
      >
        <span>
          <Button
            sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center" }}
            variant={"contained"}
            disabled={!authData.isLoggedIn}
            onClick={() => {
              if (authData.isLoggedIn) {
                setModalOpen(true);
              }
            }}
          >
            Finished
            <Icon
              sx={{ ml: 1, mb: 0.5, display: "flex", alignItems: "center" }}
            >
              <Done />
            </Icon>
          </Button>
        </span>
      </Tooltip>
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        handlePerformanceReview={handlePerformanceReview}
      />
    </Box>
  );
};

const getMarkdownOverrides = (isMobile, theme) => ({
  ...getOverrides({}),
  h1: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.5rem" : "3rem",
      },
    },
  },
  h2: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.25rem" : "2rem",
      },
    },
  },
  h3: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.1rem" : "1.5rem",
      },
    },
  },
  h4: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1rem" : "1.25rem",
      },
    },
  },
  h5: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "0.9rem" : "1.1rem",
      },
    },
  },
  p: {
    props: {
      style: {
        fontSize: isMobile ? "1rem" : "1.25rem",
      },
    },
  },
  img: {
    props: {
      style: {
        border: `2px solid ${theme.palette.primary.dark}`,
      },
    },
  },
});

export default GrammarLesson;
