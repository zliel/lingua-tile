import { useState, useEffect } from "react";
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

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function Settings() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { authData } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setNotificationsEnabled(!!subscription);
        });
      });
    }
  }, []);

  const handleNotificationToggle = async () => {
    setIsLoading(true);
    try {
      if (notificationsEnabled) {
        // Unsubscribe
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
            // Tell backend
            await axios.post(
              `${import.meta.env.VITE_APP_API_BASE}/api/notifications/unsubscribe`,
              { endpoint: subscription.endpoint }, // Only need endpoint to identify
              {
                headers: { Authorization: `Bearer ${authData?.token}` },
              }
            );
          }
        }
        setNotificationsEnabled(false);
        showSnackbar("Notifications disabled", "success");
      } else {
        if (!("serviceWorker" in navigator)) {
          showSnackbar("Service Worker not supported", "error");
          return;
        }

        showSnackbar("Requesting permission...", "info");
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          showSnackbar("Permission denied", "error");
          return;
        }

        // Get VAPID key
        showSnackbar("Fetching public key...", "info");
        const keyResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_BASE}/api/notifications/vapid-public-key`
        );
        const vapidPublicKey = keyResponse.data.publicKey;

        showSnackbar("Registering push...", "info");

        // Debugging SW state
        if (!navigator.serviceWorker.controller) {
          console.warn("No active SW controller found, waiting for ready...");
        }

        // Race ready against a 5s timeout
        const readyPromise = navigator.serviceWorker.ready;
        const timeoutPromise = new Promise<ServiceWorkerRegistration>((_, reject) =>
          setTimeout(() => reject(new Error("Service Worker registration timed out. Try reloading.")), 5000)
        );

        let registration: ServiceWorkerRegistration;
        try {
          registration = await Promise.race([readyPromise, timeoutPromise]);
        } catch (e: any) {
          // Attempt manual registration recovery if simple ready fails
          console.log("Timed out waiting for ready, trying manual update/check...");
          try {
            registration = await navigator.serviceWorker.register('/sw.js');
            // Wait for it to be active
            if (registration.installing) {
              await new Promise(resolve => {
                const worker = registration.installing;
                if (worker) {
                  worker.addEventListener('statechange', () => {
                    if (worker.state === 'activated') resolve(null);
                  });
                } else {
                  resolve(null);
                }
              });
            }
          } catch (registerError: any) {
            throw new Error(`SW Registration failed: ${e.message} -> ${registerError.message}`);
          }
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        // Send to backend
        showSnackbar("Saving subscription...", "info");
        await axios.post(
          `${import.meta.env.VITE_APP_API_BASE}/api/notifications/subscribe`,
          subscription.toJSON(),
          {
            headers: { Authorization: `Bearer ${authData?.token}` },
          }
        );

        setNotificationsEnabled(true);
        showSnackbar("Notifications enabled!", "success");
      }
    } catch (error: any) {
      console.error("Notification error:", error);
      showSnackbar(
        `Error: ${error.response?.data?.detail || error.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/profile")} // Or wherever back should go
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
                checked={notificationsEnabled}
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
