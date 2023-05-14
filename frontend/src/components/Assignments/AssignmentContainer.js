import React from "react";
import Assignment from "./Assignment";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Tabs } from "antd";
import "./Assignments.css";
import AssignmentMarks from "./AssignmentMarks";

const AssignmentContainer = () => {
  const items = [
    {
      key: "1",
      label: `General`,
      children: <Assignment />,
    },
    {
      key: "2",
      label: `Marks`,
      children: <AssignmentMarks />,
    },
  ];
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assignment"} />
        <Profile />
      </div>
      <Tabs defaultActiveKey="1" items={items} className="tabs" />
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 16,
  },
  header: {
    display: "flex",
  },
};

export default AssignmentContainer;
