import { useState } from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Box,
  Button,
  Card,
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
import { Theme, useTheme } from "@mui/material/styles";
import ReviewModal from "../Components/ReviewModal";

const GrammarLesson = () => {
  const { lessonId } = useParams();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${authData?.token}` },
        },
      );
      return response.data;
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
    showSnackbar("Failed to fetch lesson", "error");
    return <Typography>Error loading lesson.</Typography>;
  }

  return (
    <Card
      sx={{
        width: "85%",
        margin: "auto",
        mt: 4,
        mb: 8,
        p: 0,
        backgroundColor:
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
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 12px 40px 0 rgba(0, 0, 0, 0.6)"
              : "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
        },
      }}
    >
      <Box sx={{ p: isMobile ? 3 : 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MuiMarkdown
          hideLineNumbers
          overrides={getMarkdownOverrides(isMobile, theme)}
        >
          {lesson.content}
        </MuiMarkdown>
        {/* NOTE: Tooltip and disabled button when user is not logged in */}
        <Tooltip
          title={
            !authData?.isLoggedIn ? (
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
              sx={{
                mt: 4,
                mb: 2,
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "none",
                display: "flex",
                alignItems: "center",
              }}
              variant={"contained"}
              color="primary"
              disabled={!authData?.isLoggedIn}
              onClick={() => {
                if (authData?.isLoggedIn) {
                  setModalOpen(true);
                }
              }}
            >
              Finish Lesson
              <Icon
                sx={{ ml: 1, display: "flex", alignItems: "center" }}
              >
                <Done />
              </Icon>
            </Button>
          </span>
        </Tooltip>
        <ReviewModal
          open={modalOpen}
          setOpen={setModalOpen}
          lessonId={lessonId || ""}
        />
      </Box>
    </Card>
  );
};

const getMarkdownOverrides = (isMobile: boolean, theme: Theme) => ({
  ...getOverrides({}),
  h1: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "2rem" : "3rem",
        fontWeight: 700,
        color: theme.palette.primary.main,
        marginBottom: "1rem",
      },
    },
  },
  h2: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.5rem" : "2rem",
        fontWeight: 600,
        marginTop: "1.5rem",
        marginBottom: "1rem",
      },
    },
  },
  h3: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.25rem" : "1.5rem",
        fontWeight: 600,
        color: theme.palette.text.primary,
        marginTop: "1rem",
        marginBottom: "0.5rem",
      },
    },
  },
  h4: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1.1rem" : "1.25rem",
        fontWeight: 600,
        marginTop: "1rem",
      },
    },
  },
  h5: {
    props: {
      style: {
        textAlign: "center",
        fontSize: isMobile ? "1rem" : "1.1rem",
        fontWeight: 600,
        marginTop: "0.5rem",
      },
    },
  },
  p: {
    props: {
      style: {
        fontSize: isMobile ? "1rem" : "1.1rem",
        lineHeight: 1.8,
        color: theme.palette.text.primary,
        marginBottom: "1rem",
      },
    },
  },
  img: {
    props: {
      style: {
        maxWidth: "100%",
        height: "auto",
        borderRadius: "8px",
        boxShadow: theme.palette.mode === "dark"
          ? "0 4px 12px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.15)",
        marginTop: "1rem",
        marginBottom: "1rem",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  },
  li: {
    props: {
      style: {
        fontSize: isMobile ? "1rem" : "1.1rem",
        lineHeight: 1.6,
        marginBottom: "0.5rem",
      },
    },
  },
});

export default GrammarLesson;
