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

  const renderAvatar = () => {
    if (!user?.avatar) {
      console.log("gooooooo");
      if (user?.gender === "male") {
        return require("../../assets/icons/boy.png");
      } else {
        return require("../../assets/icons/girl.png");
      }
    } else {
      return "http://127.0.0.1:8000/static" + user?.avatar;
    }
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
        src={
          user?.avatar
            ? "http://127.0.0.1:8000/static" + user?.avatar
            : user?.gender === "male"
            ? require("../../assets/icons/boy.png")
            : require("../../assets/icons/girl.png")
        }
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
