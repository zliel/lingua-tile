import './App.css';
import {createTheme, CssBaseline, ThemeProvider, alpha, getContrastRatio} from "@mui/material";

import {useState} from "react";
import {useRoutes} from "react-router"
import NavBar from "./Components/NavBar";
import {BrowserRouter} from "react-router-dom";
import Home from "./Routes/Home";
import Translate from "./Routes/Translate";
import About from "./Routes/About";

const purpleBase = "#8c00cc"
const greenBase = "#18b201"
const lightTheme = createTheme({
  palette: {
    primary: {
      light: alpha(purpleBase, 0.5),
      main: alpha(purpleBase, 0.7),
      dark: alpha(purpleBase, 0.9),
      contrastText: getContrastRatio(alpha(purpleBase, 0.7), "#fff") >= 4.5 ? "#fff" : "#000"
    },
    secondary: {
      light: alpha(greenBase, 0.5),
        main: alpha(greenBase, 0.7),
        dark: alpha(greenBase, 0.9),
        contrastText: getContrastRatio(alpha(greenBase, 0.7), "#fff") >= 4.5 ? "#fff" : "#000"
    },
    mode: "light"
  }
})

const darkTheme = createTheme({
  palette: {
    primary: {
      light: alpha(purpleBase, 0.5),
      main: alpha(purpleBase, 0.7),
      dark: alpha(purpleBase, 0.9),
      contrastText: getContrastRatio(alpha(purpleBase, 0.7), "#fff") >= 4.5 ? "#fff" : "#000"
    },
    secondary: {
      light: alpha(greenBase, 0.5),
      main: alpha(greenBase, 0.7),
      dark: alpha(greenBase, 0.9),
      contrastText: getContrastRatio(alpha(greenBase, 0.7), "#fff") >= 4.5 ? "#fff" : "#000"
    },
    mode: "dark"
  }
})

function App() {

  const startingTheme = localStorage.getItem("theme") === "dark" ? darkTheme : lightTheme
  const [theme, setTheme] = useState(startingTheme)
  const handleTheme = () => {
    theme === lightTheme ? setTheme(darkTheme) : setTheme(lightTheme)

    localStorage.setItem("theme", theme === lightTheme ? "dark" : "light")
  }

  const AppRoutes = () => useRoutes([
    { path: "/", element: <Home/>},
    { path: "/home", element: <Home/>},
    { path: "/about", element: <About />},
    { path: "/translate", element: <Translate />}
  ])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar onThemeSwitch={handleTheme} />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
