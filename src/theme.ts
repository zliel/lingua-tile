import { createTheme, ColorSystemOptions, Theme } from "@mui/material";

const purpleBase = "#8c00cc";
const greenBase = "#00c800";

declare module "@mui/material/styles" {
  interface Palette {
    grammar: Palette["primary"];
  }
  interface PaletteOptions {
    grammar?: PaletteOptions["primary"];
  }
}

const palette: ColorSystemOptions = {
  palette: {
    primary: {
      main: purpleBase,
    },
    secondary: {
      main: greenBase,
      contrastText: "#fff",
    },
    grammar: {
      main: "#0288d1",
      light: "#5eb8ff",
      dark: "#005b9f",
      contrastText: "#fff",
    },
  },
};

export const theme: Theme = createTheme({
  colorSchemes: {
    light: {
      ...palette,
    },
    dark: {
      ...palette,
    },
  },
  // typography: {
  //   fontFamily: "var(--japanese-font-family)",
  // },
});
