import React from "react";
import Login from "../../components/Login/Login";
import "./LoginPage.css";
import CanvasComponent from "./canvas";

const LoginPage = () => {
  return (
    <div className="login">
      <section id="main">
        <div className="inner-con">
          <Login />
          <CanvasComponent/>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
