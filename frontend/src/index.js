import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const THEME = createTheme({
  typography: {
    fontFamily: ["Open Sans"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={THEME}>
        <Provider store={store}>
          {/*<AuthProvider>*/}
          <App />
          {/*</AuthProvider>*/}
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
