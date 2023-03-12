import React from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/profile")} style={styles.container}>
      <div style={styles.left}>
        <p style={styles.title}>Ayazhan Utemurat</p>
        <p style={styles.subtitle}>Student</p>
      </div>
      <img style={styles.img} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    cursor: "pointer",
    marginLeft: 20,
  },
  img: {
    width: 42,
    height: 42,
    borderRadius: 120,
    backgroundColor: "#DBDBDB",
  },
  left: {
    marginRight: 9,
    justifyContent: "flex-end",
  },
  title: {
    fontWeight: 600,
    color: "#4A4D58",
    lineHeight: 0.5,
    fontSize: 14,
  },
  subtitle: {
    fontWeight: 600,
    color: "#00000091",
    fontSize: 14,
    lineHeight: 0.5,
    textAlign: "end",
  },
};

export default Profile;
