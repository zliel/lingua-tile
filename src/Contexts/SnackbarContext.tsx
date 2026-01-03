import { createContext, useContext, useState } from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type SnackBarSeverity = "error" | "warning" | "info" | "success";

export const SnackbarContext = createContext<{
  showSnackbar: (
    message: string,
    severity?: SnackBarSeverity,
    duration?: number,
  ) => void;
}>({
  showSnackbar: () => {},
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackBarSeverity>("info");
  // NOTE: Used in preventing users from reviewing, allows custom auto-hide durations
  const [duration, setDuration] = useState(1500);

  const showSnackbar = (
    msg: string,
    sev: SnackBarSeverity = "info",
    duration = 1500,
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
    setDuration(duration);
  };

  const handleClose = (_: any, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={handleClose}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={duration}
        onClose={handleClose}
        message={message}
        action={action}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarContext;
