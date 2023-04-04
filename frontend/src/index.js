import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import OpenSans from "./assets/fonts/OpenSans-Regular.ttf";
import OpenSansSemiBold from "./assets/fonts/OpenSans-SemiBold.ttf";

const THEME = createTheme({
  typography: {
    fontFamily: ["Open Sans"].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'OpenSans';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('OpenSans'), local('OpenSans-Regular'), url(${OpenSans}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={THEME}>
      <Provider store={store}>
        {/*<AuthProvider>*/}
        <App />
        {/*</AuthProvider>*/}
      </Provider>
    </ThemeProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
