import React from "react";
import Assignment from "./Assignment";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Tabs } from "antd";
import "./Assignments.css";
import AssignmentMarks from "./AssignmentMarks";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

const AssignmentContainer = () => {
  const { data: user } = useGetAuthUserQuery();

  const itemsTeacher = [
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

  const items = [
    {
      key: "1",
      label: `General`,
      children: <Assignment />,
    },
  ];
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assignment"} />
        <Profile />
      </div>
      <Tabs
        defaultActiveKey="1"
        items={user?.role === "teacher" ? itemsTeacher : items}
        className="tabs"
      />
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
