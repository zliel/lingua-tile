import "./App.css";
import { CssBaseline, ThemeProvider, useColorScheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "./Contexts/SnackbarContext";
import { AuthProvider } from "./Contexts/AuthContext";
import { OfflineProvider } from "./Contexts/OfflineContext";
import { AppRoutes } from "./Routes/AppRoutes";
import { theme } from "./theme";

function App() {
  const { mode, setMode } = useColorScheme();
  if (!mode || mode == undefined) {
    setMode("light");
  }

  return (
    <ThemeProvider theme={theme} defaultMode="light" noSsr>
      <SnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <OfflineProvider>
              <AppRoutes />
            </OfflineProvider>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
