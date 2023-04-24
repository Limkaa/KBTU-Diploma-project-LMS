import { Button } from "antd";
import React from "react";
import EditSvg from "../../assets/icons/Edit";

const CoursePost = ({ setIsPost, isPost, item }) => {
  return (
    <div style={styles.container}>
      <div style={styles.title}>{item?.title}</div>
      <div style={styles.text}>{item?.text}</div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 12,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    padding: 10,
    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
    color: "#4A4D58",
  },
  text: {
    padding: 10,
    color: "#4A4D58",
    fontWeight: 400,
    fontSize: 14,
  },
};

export default CoursePost;
