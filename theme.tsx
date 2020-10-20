import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#DDDDDD",
    },
    secondary: {
      main: "#ffb300",
    },
    background: {
      default: "#111111",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
  },
});

theme.typography.h1 = {
  fontSize: "5rem",
  [theme.breakpoints.down("xs")]: {
    fontSize: "3rem",
  },
};

export default theme;
