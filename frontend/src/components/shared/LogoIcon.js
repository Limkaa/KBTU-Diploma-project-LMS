import React from "react";
import Logo from "../../assets/icons/logo.svg";

const LogoIcon = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 50,
        marginTop: 10,
      }}
    >
      <img src={Logo} />
      <div style={{ marginBottom: 5, marginLeft: 5 }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              color: "#EA5A0C",
              lineHeight: "30px",
              fontWeight: 800,
              fontSize: 30,
            }}
          >
            S
          </div>
          <div
            style={{
              color: "#163A61",
              lineHeight: "30px",
              fontWeight: 800,
              fontSize: 30,
            }}
          >
            tudy
          </div>
        </div>
        <div
          style={{
            color: "#163A61",
            lineHeight: "30px",
            fontWeight: 800,
            fontSize: 30,
          }}
        >
          Mate
        </div>
      </div>
    </div>
  );
};

export default LogoIcon;
