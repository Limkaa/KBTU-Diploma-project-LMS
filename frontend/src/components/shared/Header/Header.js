import React from "react";
import "./Header.css";
import Search from "../../../assets/icons/search.svg";
import { Input } from "antd";

const Header = ({ text, visible }) => {
  return (
    <div className="header">
      <div className="header-text">{text}</div>
      {visible && (
        <Input
          size="default size"
          placeholder="Search..."
          prefix={<img src={Search} />}
          style={{ height: 50, width: 280, border: "none", borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default Header;
