import "./App.css";
import {
  alpha,
  createTheme,
  CssBaseline,
  getContrastRatio,
  ThemeProvider,
} from "@mui/material";

import { useState } from "react";
import { useRoutes } from "react-router";
import NavBar from "./Components/NavBar";
import { BrowserRouter } from "react-router-dom";
import Home from "./Routes/Home";
import Translate from "./Routes/Translate";
import About from "./Routes/About";
import Login from "./Routes/Login";
import Signup from "./Routes/Signup";
import Profile from "./Routes/Profile";
import UpdateProfile from "./Routes/UpdateProfile";
import { SnackbarProvider } from "./Contexts/SnackbarContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminUserTable from "./Routes/AdminUserTable";
import AdminCardTable from "./Routes/AdminCardTable";
import AdminLessonTable from "./Routes/AdminLessonTable";
import AdminSectionTable from "./Routes/AdminSectionTable";
import FlashcardLesson from "./Routes/FlashcardLesson";
import LessonList from "./Routes/LessonList";
import { AuthProvider } from "./Contexts/AuthContext";
import GrammarLesson from "./Routes/GrammarLesson";
import PracticeLesson from "./Routes/PracticeLesson";

const purpleBase = "#8c00cc";
const greenBase = "#18b201";
const lightTheme = createTheme({
  palette: {
    primary: {
      light: alpha(purpleBase, 0.5),
      main: alpha(purpleBase, 0.7),
      dark: alpha(purpleBase, 0.9),
      contrastText:
        getContrastRatio(alpha(purpleBase, 0.7), "#fff") >= 4.5
          ? "#fff"
          : "#000",
    },
    secondary: {
      light: alpha(greenBase, 0.5),
      main: alpha(greenBase, 0.7),
      dark: alpha(greenBase, 0.9),
      contrastText:
        getContrastRatio(alpha(greenBase, 0.7), "#fff") >= 4.5
          ? "#fff"
          : "#000",
    },
    mode: "light",
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      light: alpha(purpleBase, 0.5),
      main: alpha(purpleBase, 0.7),
      dark: alpha(purpleBase, 0.9),
      contrastText:
        getContrastRatio(alpha(purpleBase, 0.7), "#fff") >= 4.5
          ? "#fff"
          : "#000",
    },
    secondary: {
      light: alpha(greenBase, 0.5),
      main: alpha(greenBase, 0.7),
      dark: alpha(greenBase, 0.9),
      contrastText:
        getContrastRatio(alpha(greenBase, 0.7), "#fff") >= 4.5
          ? "#fff"
          : "#000",
    },
    mode: "dark",
  },
});

function App() {
  const startingTheme =
    localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme;
  const [theme, setTheme] = useState(startingTheme);
  const handleTheme = () => {
    theme === lightTheme ? setTheme(darkTheme) : setTheme(lightTheme);

    localStorage.setItem("theme", theme === lightTheme ? "dark" : "light");
  };

  const AppRoutes = () =>
    useRoutes([
      { path: "/", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/translate", element: <Translate /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/profile", element: <Profile /> },
      { path: "/update-profile", element: <UpdateProfile /> },
      {
        path: "/admin-users",
        element: (
          <ProtectedRoute>
            <AdminUserTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-cards",
        element: (
          <ProtectedRoute>
            <AdminCardTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-lessons",
        element: (
          <ProtectedRoute>
            <AdminLessonTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-sections",
        element: (
          <ProtectedRoute>
            <AdminSectionTable />
          </ProtectedRoute>
        ),
      },
      { path: "/lessons", element: <LessonList /> },
      { path: "/flashcards/:lessonId", element: <FlashcardLesson /> },
      { path: "/grammar/:lessonId", element: <GrammarLesson /> },
      { path: "/practice/:lessonId", element: <PracticeLesson /> },
    ]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <NavBar onThemeSwitch={handleTheme} />
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
