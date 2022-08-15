import './App.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {useState} from "react";
import {useRoutes} from "react-router"
import NavBar from "./Components/NavBar";
import {BrowserRouter} from "react-router-dom";
import Home from "./Routes/Home";

const lightTheme = createTheme({
  palette: {
    primary: {
      light: "#85bb5c",
      main: "#558b2f",
      dark: "#255d00"
    },
    secondary: {
      light: "#ff77a8",
      main: "#ed4079",
      dark: "#b5004d"
    },
  }
})

const darkTheme = createTheme({
  palette: {
    primary: {
      light: "#2f8b65",
      // main: "#216b4a",
      main: "#1ccc82",
      dark: "#164f30"
    },
    secondary: {
      light: "#9c0095",
      main: "#F4ABC4",
      dark: "#492679"
    },
    mode: "dark"
  }
})

function App() {

  const [theme, setTheme] = useState(lightTheme)
  const handleTheme = () => theme === lightTheme ? setTheme(darkTheme) : setTheme(lightTheme)

  const AppRoutes = () => useRoutes([
    { path: "/", element: <Home/>},
    { path: "/home", element: <Home/>},
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
