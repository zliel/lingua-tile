import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

interface NotificationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onEnable: () => void;
  onDismiss: () => void;
  loading?: boolean;
}

export const NotificationPermissionModal = ({
  open,
  onClose,
  onEnable,
  onDismiss,
  loading = false,
}: NotificationPermissionModalProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="notification-permission-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        id="notification-permission-title"
        sx={{ textAlign: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            "& > svg": {
              fontSize: 48,
              color: theme.palette.primary.main,
            },
          }}
        >
          <NotificationsActiveIcon />
        </Box>
        <Typography variant="h5" component="div" fontWeight="bold">
          Stay on Track
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: "center" }}>
          Get notified when you have reviews overdue so you never miss a study
          session.
        </DialogContentText>
        <DialogContentText
          sx={{
            textAlign: "center",
            mt: 3,
            fontSize: "0.85rem",
            color: theme.palette.text.secondary,
          }}
        >
          You can change this any time in the Settings page.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1, p: 2 }}>
        <Button
          onClick={onEnable}
          loading={loading}
          variant="contained"
          fullWidth
          size="large"
          sx={{ borderRadius: 2 }}
        >
          Enable Notifications
        </Button>
        <Button onClick={onDismiss} color="inherit" fullWidth size="small">
          Not Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};
