import React from "react";
import { MuiMarkdown, getOverrides } from "mui-markdown";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Box, Skeleton, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { useTheme } from "@mui/material/styles";

const GrammarLesson = () => {
  const { lessonId } = useParams();
  const { auth } = useAuth();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", lessonId, auth.token],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE}/api/lessons/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      return response.data;
    },
    onError: () => {
      showSnackbar("Failed to fetch lesson", "error");
    },
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
    </Box>
  );
};

export default GrammarLesson;
