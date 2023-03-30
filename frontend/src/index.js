import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import { AuthProvider } from "./context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Provider store={store}>
            {/*<AuthProvider>*/}
                <App />
            {/*</AuthProvider>*/}
        </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
