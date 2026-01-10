import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { FallbackProps } from "react-error-boundary";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }}
        />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Something went wrong
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We encountered an unexpected error. Please try reloading the page or
          go back to the dashboard.
        </Typography>

        {/* Only show error details in development */}
        {/* {import.meta.env.VITE_DEV && ( */}
        <Box
          component="pre"
          sx={{
            p: 2,
            bgcolor: "grey.100",
            color: "error.dark",
            borderRadius: 1,
            overflow: "auto",
            maxWidth: "100%",
            textAlign: "left",
            fontSize: "0.875rem",
            width: "100%",
          }}
        >
          {error.message}
        </Box>
        {/*)}*/}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={resetErrorBoundary}
            size="large"
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => (window.location.href = "/")}
            size="large"
          >
            Go Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
