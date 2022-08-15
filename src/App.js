import './App.css';
import {createTheme, CssBaseline, ThemeProvider, Typography} from "@mui/material";
import {useState} from "react";

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Typography variant={"h1"} color={"primary.dark"}>Hello!</Typography>
    </ThemeProvider>
  );
}

export default App;
