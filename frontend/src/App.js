import Login from "./components/Login/Login";
import React from "react";
// import {BrowserRouter as Routes, Route} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/home" element={<HomePage />} />
        </Route>
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
