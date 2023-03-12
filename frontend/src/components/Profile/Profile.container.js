import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Input, Button } from "antd";

const ProfileContainer = () => {
  return (
    <div
      style={{
        backgroundColor: "#FAFAFA",
        flex: 1,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      <div style={{ display: "flex" }}>
        <Header text={"My profile"} visible={false} />
        <Profile />
      </div>
      <div style={{ backgroundColor: "white", padding: 16, borderRadius: 12 }}>
        <p style={styles.userInfo}>USER INFORMATION</p>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 2 }}>
            <div>
              <p style={styles.inputTitle}>Username</p>
              <Input placeholder="Basic usage" />
            </div>
            <div>
              <p style={styles.inputTitle}>Email address</p>
              <Input placeholder="Basic usage" />
            </div>
            <div>
              <p style={styles.inputTitle}>First name</p>
              <Input placeholder="Basic usage" />
            </div>
            <div>
              <p style={styles.inputTitle}>Last name</p>
              <Input placeholder="Basic usage" />
            </div>
          </div>

          <div
            style={{
              flex: 2,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              style={{
                width: 170,
                height: 170,
                borderRadius: 120,
                backgroundColor: "#B6C3D8",
              }}
            />
            <Button style={{ width: 130, marginTop: 12 }}>Change Image</Button>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={styles.inputTitle}>Class</p>
            <Input placeholder="Basic usage" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={styles.inputTitle}>Parallel</p>
            <Input placeholder="Basic usage" />
          </div>
        </div>
        <div style={styles.divider} />
        <div style={{ flex: 1 }}>
          <p style={styles.inputTitle}>Address</p>
          <Input placeholder="Basic usage" />
        </div>
      </div>
    </div>
  );
};

const styles = {
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
};

export default ProfileContainer;
