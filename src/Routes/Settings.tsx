import {
  Container,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  Button,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Contexts/AuthContext";
import { useSnackbar } from "../Contexts/SnackbarContext";
import { usePushSubscription } from "../hooks/usePushSubscription";

function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushSubscription();

  const handleNotificationToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

    } catch (error: any) {
      showSnackbar(
        "error",
      );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/dashboard")}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ p: 3, pb: 1, bgcolor: theme.palette.background.default }}
        >
          Settings
        </Typography>
        <List>
          <ListItem divider>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive alerts for overdue reviews"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={isSubscribed}
                onChange={handleNotificationToggle}
                disabled={isLoading}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
}

export default Settings;
