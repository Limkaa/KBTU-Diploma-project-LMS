import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import { Button } from "antd";

import { useDispatch, useSelector } from "react-redux";
import {logout, selectCurrentUser} from "../../redux/auth/authSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import "../../assets/icons/boy.png";
import {navigate} from "react-big-calendar/lib/utils/constants";
import {useNavigate} from "react-router-dom";

const ProfileContainer = () => {
  const { data: user } = useGetAuthUserQuery();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const routeNavigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={{ display: "flex" }}>
        <Header text={"My profile"} visible={false} />
        <Profile />
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: 16,
          borderRadius: 12,
          marginTop: 20,
        }}
      >
        <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
          <p style={styles.userInfo}>USER INFORMATION</p>
          <div>
            {
                currentUser.role === "student" &&
                <Button style={{marginRight: 5}} onClick={() => routeNavigate(`/profile/${currentUser.user_id}`)}>
                  Student Profile
                </Button>
            }
            <Button type={"primary"} onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 2 }}>
            <div>
              <p style={styles.inputTitle}>Email address</p>
              <input
                type="text"
                defaultValue={user?.email || ""}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>First name</p>
              <input
                defaultValue={user?.first_name || ""}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>Last name</p>
              <input
                defaultValue={user?.last_name || ""}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>Gender</p>
              <input
                defaultValue={user?.gender || ""}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>Date of birth</p>
              <input
                defaultValue={user?.date_of_birth || ""}
                disabled
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.imgCont}>
            <img
              style={styles.img}
              src={
                user?.avatar
                  ? user?.avatar
                  : user?.gender === "male"
                  ? require("../../assets/icons/boy.png")
                  : require("../../assets/icons/girl.png")
              }
            />
            {/* <Button style={{ width: 130, marginTop: 12 }}>Change Image</Button> */}
          </div>
        </div>
        {user?.role === "student" && (
          <div style={{ flex: 1, display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={styles.inputTitle}>Class</p>
              <input style={styles.input} disabled />
            </div>
            <div style={{ flex: 1 }}>
              <p style={styles.inputTitle}>Parallel</p>
              <input style={styles.input} disabled />
            </div>
          </div>
        )}
        <div style={styles.divider} />
        <div style={{ flex: 1 }}>
          <p style={styles.inputTitle}>Phone Number</p>
          <input
            defaultValue={user?.phone || ""}
            disabled
            style={styles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={styles.inputTitle}>Telegram ID</p>
          <input
            style={styles.input}
            disabled
            defaultValue={user?.telegram_id || ""}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#FAFAFA",
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
  },
  userInfo: {
    fontWeight: 600,
    fontSize: 16,
    color: "#163A61",
    marginTop: 0,
  },
  inputTitle: {
    paddingTop: 13,
    fontWeight: 600,
    fontSize: 14,
    color: "#6B7185",
    lineHeight: 0,
  },
  divider: {
    borderBottom: "1px solid #B6C3D8",
    marginTop: 21,
  },
  input: {
    flex: 1,
    width: "98%",
    borderRadius: 8,
    border: "1px solid #DFDFDF",
    backgroundColor: "white",
    justifyContent: "center",
    color: "#5A617A",
    padding: "7px 10px",
  },
  imgCont: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  img: {
    width: 170,
    height: 175,
    borderRadius: 120,
    backgroundColor: "#B6C3D8",
  },
  logout: {
    borderRadius: 9,
    padding: "12px 18px",
    backgroundColor: "#163A61",
    margin: 16,
    color: "white",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
  },
};

export default ProfileContainer;
