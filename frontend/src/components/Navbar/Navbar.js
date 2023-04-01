import React from "react";
import { Link } from "react-router-dom";
import { managerMenu, teacherMenu, studentMenu } from "./NavBarData";
import { Menu } from "antd";
import { useLocation } from "react-router-dom";
import "../../App.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import LogoIcon from "../shared/LogoIcon";

function Navbar() {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const userToMenu = {
    manager: managerMenu,
    teacher: teacherMenu,
    student: studentMenu,
  };

  const currentMenu = userToMenu[user.role] || [];

  if (user) {
    return (
      <Menu
        mode="inline"
        theme="light"
        style={{
          backgroundColor: "#ffffff",
          width: 250,
          flexDirection: "column",
          justifyContent: "flex-start",
          borderRadius: "0px 12px 12px 0px",
        }}
        className="navbar"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["/"]}
      >
        <LogoIcon />
        {currentMenu.map((item) => (
          <Menu.Item
            key={item.path}
            style={{ paddingLeft: 40 }}
            icon={
              <item.icon
                fill={location.pathname === item.path ? "#163A61" : "#B6C3D8"}
              />
            }
          >
            <Link
              to={item.path}
              key={item.path}
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: location.pathname === item.path ? "#163A61" : "#B6C3D8",
              }}
            >
              {item.title}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    );
  }
}

export default Navbar;
