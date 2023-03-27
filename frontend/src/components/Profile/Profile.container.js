import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Button } from "antd";
import AuthContext from "../../context/AuthProvider";

const ProfileContainer = () => {
  const { userInfo, user, logoutUser, userSchool } = useContext(AuthContext);

  return (
    <div style={styles.container}>
      <div style={{ display: "flex" }}>
        <Header text={"My profile"} visible={false} />
        <Profile />
      </div>
      <div style={{ backgroundColor: "white", padding: 16, borderRadius: 12 }}>
        <p style={styles.userInfo}>USER INFORMATION</p>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 2 }}>
            <div>
              <p style={styles.inputTitle}>Email address</p>
              <input
                type="text"
                defaultValue={userInfo?.email}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>First name</p>
              <input
                defaultValue={userInfo?.first_name}
                disabled
                style={styles.input}
              />
            </div>
            <div>
              <p style={styles.inputTitle}>Last name</p>
              <input
                defaultValue={userInfo?.last_name}
                disabled
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.imgCont}>
            <img style={styles.img} />
            <Button style={{ width: 130, marginTop: 12 }}>Change Image</Button>
          </div>
        </div>
        {user.role === "manager" && (
          <div style={{ flex: 1, display: "flex", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={styles.inputTitle}>Class</p>
              <input placeholder="Basic usage" style={styles.input} disabled />
            </div>
            <div style={{ flex: 1 }}>
              <p style={styles.inputTitle}>Parallel</p>
              <input placeholder="Basic usage" style={styles.input} disabled />
            </div>
          </div>
        )}
        <div style={styles.divider} />
        <div style={{ flex: 1 }}>
          <p style={styles.inputTitle}>School</p>
          <input
            defaultValue={userSchool?.name}
            disabled
            style={styles.input}
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={styles.inputTitle}>Telegram ID</p>
          <input placeholder="Basic usage" style={styles.input} disabled />
        </div>
      </div>
      <button onClick={logoutUser} style={styles.logout}>
        Logout
      </button>
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
    padding: "15px 0px 15px 15px",
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
    height: 170,
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