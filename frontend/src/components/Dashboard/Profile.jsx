import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user } = useGetAuthUserQuery();

  const returnRole = () => {
    return user?.role.charAt(0).toUpperCase() + user?.role.slice(1);
  };

  return (
    <div onClick={() => navigate("/profile")} style={styles.container}>
      <div style={styles.left}>
        <div style={styles.title}>
          {user?.first_name} {user?.last_name}
        </div>
        <div style={styles.subtitle}>{returnRole()}</div>
      </div>
      <img
        style={styles.img}
        src={"http://127.0.0.1:8000/static" + user?.avatar}
      />
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
    width: 40,
    height: 40,
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
    fontSize: 14,
  },
  subtitle: {
    fontWeight: 600,
    color: "#00000091",
    fontSize: 14,
    textAlign: "end",
  },
};

export default Profile;
