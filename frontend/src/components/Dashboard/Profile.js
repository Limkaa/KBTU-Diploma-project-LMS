import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const returnRole = () => {
    return user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
  };

  return (
    <div onClick={() => navigate("/profile")} style={styles.container}>
      <div style={styles.left}>
        <p style={styles.title}>
          {user?.first_name} {user?.last_name}
        </p>
        <p style={styles.subtitle}>{returnRole()}</p>
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
