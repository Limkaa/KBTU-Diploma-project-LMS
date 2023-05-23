import React from "react";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Tabs } from "antd";

import CourseAwards from "./CourseAwards";
import Course from "./Course";
import CourseEnrollment from "./CourseEnrollment";
import CourseMarks from "./CourseMarks";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

const CourseContainer = () => {
  const { data: user } = useGetAuthUserQuery();

  const items = [
    {
      key: "1",
      label: `General`,
      children: <Course />,
    },
    {
      key: "4",
      label: `Marks`,
      children: <CourseMarks />,
    },
    {
      key: "2",
      label: `Awards`,
      children: <CourseAwards />,
    },
    {
      key: "3",
      label: `Enrollment`,
      children: <CourseEnrollment />,
    },
  ];

  const itemsStudent = [
    {
      key: "1",
      label: `General`,
      children: <Course />,
    },
    // {
    //   key: "4",
    //   label: `Marks`,
    //   children: <CourseMarks />,
    // },
    {
      key: "2",
      label: `Awards`,
      children: <CourseAwards />,
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Course"} />
        <Profile />
      </div>
      <Tabs
        defaultActiveKey="1"
        items={user?.role === "student" ? itemsStudent : items}
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

export default CourseContainer;
