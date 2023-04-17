import React from "react";

const CourseAssignments = ({ item }) => {
  return (
    <div>
      <div style={styles.assItem}>
        <div style={{ display: "flex", alignItems: "center", flex: 2 }}>
          <div style={styles.statusLine} />
          <div style={{ marginLeft: 12 }}>
            <div style={styles.title}>{item?.name}</div>
            <p style={styles.subtitle}>Biology</p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={styles.time}>11:40 PM Today</p>
          <p style={styles.deadline}>Deadline</p>
        </div>
        <div style={{ flex: 0.5 }}>
          <p style={styles.turnIn}>Turn in</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  statusLine: {
    backgroundColor: "#F18D58",
    width: 7,
    height: 60,
    borderRadius: "8px 0px 0px 8px",
  },
  assItem: {
    display: "flex",
    borderRadius: 8,
    height: 60,
    width: "100%",
    padding: 0,
    border: "1px solid #F1F1F1",
    alignItems: "center",
    justifyContent: "space-between",
  },
  assImg: {
    width: 34,
    height: 34,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginLeft: 12,
  },
  title: {
    color: "#000000",
    fontWeight: 600,
    fontSize: 14,
  },
  subtitle: {
    color: "#4A4D58",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 0.5,
  },
  turnIn: {
    color: "#F18D58",
    fontWeight: 700,
    fontSize: 14,
  },
  time: {
    color: "#000000",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 0.5,
  },
  deadline: {
    color: "#969696",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 0.5,
  },
};

export default CourseAssignments;
