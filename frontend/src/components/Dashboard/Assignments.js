import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "antd";
const Assignments = () => {
  const navigate = useNavigate();
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p className="ann-title">Assignments</p>
        <Button
          type="link"
          onClick={() => navigate("/assignments")}
          style={styles.seeAll}
        >
          See all
        </Button>
      </div>
      <div>
        <div style={styles.assItem}>
          <div style={{ display: "flex", alignItems: "center", flex: 2 }}>
            <div style={styles.statusLine} />
            <img style={styles.assImg} />
            <div style={{ marginLeft: 12 }}>
              <p style={styles.title}>Presentations SIS1</p>
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
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    color: "#163A61",
    fontWeight: 600,
    fontSize: 14,
  },
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
    lineHeight: 0.5,
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

export default Assignments;
