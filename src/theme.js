import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#fff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#003232",
        },
      },
    },
  },
});

export default theme;
