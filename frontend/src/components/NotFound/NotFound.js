import React from "react";
import NotFoundImg from "../../assets/icons/notfound.svg";
import LogoIcon from "../shared/LogoIcon";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <LogoIcon />
      <div style={styles.section}>
        <img src={NotFoundImg} />
        <div>
          <div style={styles.ops}>Oops!</div>
          <div style={styles.ops}>Page not found</div>
          <div style={styles.txtback}>
            Let's get you{" "}
            <a href="/" style={styles.link}>
              back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#F3F3F3",
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: 40,
    marginTop: "3%",
  },
  ops: {
    fontWeight: 800,
    fontSize: 48,
    color: "#163A61",
  },
  txtback: {
    fontWeight: 600,
    fontSize: 24,
    color: "#163A61",
    marginTop: 70,
  },
  link: {
    color: "#F18D58",
  },
};
export default NotFound;
