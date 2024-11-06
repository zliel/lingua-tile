import React, { useState } from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Button, Icon, Skeleton, Typography } from "@mui/material";
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
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        mt: 4,
        p: 1.5,
        border: 2,
        borderColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <MuiMarkdown
        hideLineNumbers
        overrides={{
          ...getOverrides({}),
          h2: {
            props: {
              style: {
                textAlign: "center",
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
        }}
      >
        {lesson.content}
      </MuiMarkdown>
      <Button
        sx={{ mt: 2, display: "flex", alignItems: "center" }}
        variant={"contained"}
        onClick={() => setModalOpen(true)}
      >
        Finished{" "}
        <Icon sx={{ ml: 1, mb: 0.5, display: "flex", alignItems: "center" }}>
          <Done />
        </Icon>
      </Button>
      <ReviewModal
        open={modalOpen}
        setOpen={setModalOpen}
        handlePerformanceReview={handlePerformanceReview}
      />
    </Box>
  );
};

export default GrammarLesson;
