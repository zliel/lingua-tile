import { lazy, Suspense } from "react";
import "./App.css";
import {
  alpha,
  ColorSystemOptions,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useColorScheme,
} from "@mui/material";
import { useRoutes } from "react-router";
import NavBar from "./Components/NavBar";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "./Contexts/SnackbarContext";
import { AuthProvider } from "./Contexts/AuthContext";
import Translate from "./Routes/Translate";
import About from "./Routes/About";
import Login from "./Routes/Login";
import Signup from "./Routes/Signup";
const Profile = lazy(() => import("./Routes/Profile"));
import UpdateProfile from "./Routes/UpdateProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import FlashcardLesson from "./Routes/FlashcardLesson";
import GrammarLesson from "./Routes/GrammarLesson";
import PracticeLesson from "./Routes/PracticeLesson";
import LessonList from "./Routes/LessonList";
const Dashboard = lazy(() => import("./Routes/Dashboard"));
import { HomeRedirect } from "./Routes/HomeRedirect";
const AdminSectionTable = lazy(() => import("./Routes/AdminSectionTable"));
const AdminUserTable = lazy(() => import("./Routes/AdminUserTable"));
const AdminLessonTable = lazy(() => import("./Routes/AdminLessonTable"));
const AdminCardTable = lazy(() => import("./Routes/AdminCardTable"));

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

  const AppRoutes = () =>
    useRoutes([
      { path: "/", element: <HomeRedirect /> },
      { path: "/home", element: <HomeRedirect /> },
      { path: "/about", element: <About /> },
      { path: "/translate", element: <Translate /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ProtectedRoute isAdminPage={false}>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Profile />
          </Suspense>
        ),
      },
      { path: "/update-profile", element: <UpdateProfile /> },
      {
        path: "/admin-users",
        element: (
          <ProtectedRoute isAdminPage={true}>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminUserTable />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-cards",
        element: (
          <ProtectedRoute isAdminPage={true}>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminCardTable />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-lessons",
        element: (
          <ProtectedRoute isAdminPage={true}>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminLessonTable />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-sections",
        element: (
          <ProtectedRoute isAdminPage={true}>
            <Suspense fallback={<div>Loading...</div>}>
              <AdminSectionTable />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      { path: "/lessons", element: <LessonList /> },
      { path: "/flashcards/:lessonId", element: <FlashcardLesson /> },
      { path: "/grammar/:lessonId", element: <GrammarLesson /> },
      { path: "/practice/:lessonId", element: <PracticeLesson /> },
    ]);

  return (
    <ThemeProvider theme={theme} defaultMode="light" noSsr>
      <SnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <NavBar />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
