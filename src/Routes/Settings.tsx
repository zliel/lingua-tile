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
import { usePushSubscription } from "@/hooks/usePushSubscription";

import { useAuth } from "@/Contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { authData } = useAuth();
  const queryClient = useQueryClient();

  const { isSubscribed, isLoading, subscribe, unsubscribe } =
    usePushSubscription();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", authData?.token],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/`,
        { headers: { Authorization: `Bearer ${authData?.token}` } },
      );
      return response.data;
    },
    enabled: !!authData?.isLoggedIn && !!authData?.token,
  });

  const handleNotificationToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleLearningModeToggle = async (newMode: string) => {
    if (!user) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_API_BASE}/api/users/update/${user._id}`,
        { learning_mode: newMode },
        { headers: { Authorization: `Bearer ${authData?.token}` } },
      );
      queryClient.invalidateQueries({ queryKey: ["user", authData?.token] });
    } catch (error) {
      console.error("Failed to update learning mode", error);
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
              primary="Journey Map View"
              secondary="Use the interactive map instead of the lesson list"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={user?.learning_mode === "map"}
                onChange={() =>
                  handleLearningModeToggle(
                    user?.learning_mode === "map" ? "list" : "map",
                  )
                }
                disabled={isUserLoading}
              />
            </ListItemSecondaryAction>
          </ListItem>
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
