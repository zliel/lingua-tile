import "./App.css";
import {
  alpha,
  ColorSystemOptions,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "./Contexts/SnackbarContext";
import { AuthProvider } from "./Contexts/AuthContext";
import { OfflineProvider } from "./Contexts/OfflineContext";
import { AppRoutes } from "./Routes/AppRoutes";

const purpleBase = "#8c00cc";
const greenBase = "#00c500";

const palette: ColorSystemOptions = {
  palette: {
    primary: {
      light: alpha(purpleBase, 0.5),
      main: alpha(purpleBase, 0.7),
      dark: alpha(purpleBase, 1),
    },
    secondary: {
      light: alpha(greenBase, 0.5),
      main: alpha(greenBase, 0.7),
      dark: alpha(greenBase, 1),
      contrastText: "#fff",
    },
    grammar: {
      main: "#0288d1",
      light: "#5eb8ff",
      dark: "#005b9f",
    },
  },
};

const theme = createTheme({
  colorSchemes: {
    light: {
      ...palette,
    },
    dark: {
      ...palette,
    },
  },
});

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
