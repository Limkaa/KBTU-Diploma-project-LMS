import React from "react";
import LeftIcon from "../../assets/icons/leftblue.svg";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <Button
      type="link"
      style={{
        padding: 0,
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        marginBottom: 5,
      }}
      onClick={() => navigate(-1)}
    >
      <img src={LeftIcon} />
      <div
        style={{
          fontWeight: 600,
          color: "#163A61",
          fontSize: 15,
          marginLeft: 5,
        }}
      >
        Back
      </div>
    </Button>
  );
};

export default Back;
