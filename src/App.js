import './App.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useState} from "react";
import {useRoutes} from "react-router"
import NavBar from "./Components/NavBar";
import {BrowserRouter} from "react-router-dom";
import Home from "./Routes/Home";
import Translate from "./Routes/Translate";
import About from "./Routes/About";

const lightTheme = createTheme({
  palette: {
    primary: {
      light: "#b41afc",
      main: "#8a00ca",
      dark: "#5000c1",
      contrastText: "#fff"
    },
    secondary: {
      light: "#61fc1a",
      main: "#18b201",
      dark: "#007803",
        contrastText: "#fff"
    },
  }
})

const darkTheme = createTheme({
  palette: {
    primary: {
      light: "#b41afc",
      main: "#8a00ca",
      dark: "#5000c1",
      contrastText: "#fff"
    },
    secondary: {
      light: "#61fc1a",
      main: "#18b201",
      dark: "#007803",
      contrastText: "#fff"
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
