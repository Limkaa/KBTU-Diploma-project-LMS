import React from "react";
import { Link } from "react-router-dom";
import { managerMenu, teacherMenu, studentMenu } from "./NavBarData";
import { useLocation, useNavigate } from "react-router-dom";
import "../../App.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import LogoIcon from "../shared/LogoIcon";
import SubjectsSvg from "../../assets/icons/SubjectsIcon";
import YearSvg from "../../assets/icons/YearIcon";

import { Menu } from "antd";
import styled from "styled-components";

const SubMenu = styled(Menu.SubMenu)`
  &.ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #b6c3d8;
  }
  &.ant-menu-submenu-active > .ant-menu-submenu-title:hover {
    color: #b6c3d8 !important;
  }
`;

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
        inlineIndent={40}
        className="navbar"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={["/"]}
      >
        <LogoIcon />
        {currentMenu.map((item) => (
          <>
            {item.submenu ? (
              <SubMenu
                key={item.path}
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#B6C3D8",
                }}
                title={item.title}
                icon={<item.icon color={"#B6C3D8"} />}
              >
                {item.submenu.map((subitem) => (
                  <Menu.Item
                    key={subitem.path}
                    icon={
                      <subitem.icon
                        color={
                          location.pathname === subitem.path
                            ? "#163A61"
                            : "#B6C3D8"
                        }
                      />
                    }
                  >
                    <Link
                      to={subitem.path}
                      key={subitem.path}
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color:
                          location.pathname === subitem.path
                            ? "#163A61"
                            : "#B6C3D8",
                      }}
                    >
                      {subitem.title}
                    </Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item
                key={item.path}
                icon={
                  <item.icon
                    color={
                      location.pathname === item.path ? "#163A61" : "#B6C3D8"
                    }
                  />
                }
              >
                <Link
                  to={item.path}
                  key={item.path}
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color:
                      location.pathname === item.path ? "#163A61" : "#B6C3D8",
                  }}
                >
                  {item.title}
                </Link>
              </Menu.Item>
            )}
          </>
        ))}
      </Menu>
    );
  }
}

export default Navbar;
