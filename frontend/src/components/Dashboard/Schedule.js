import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: 15 }}>
      <div style={styles.header}>
        <p style={styles.title}>Schedule</p>
        <Button
          onClick={() => navigate("/schedule")}
          type="link"
          style={{ padding: 0 }}
        >
          <p style={styles.seeAll}>See all</p>
        </Button>
      </div>
      <div>
        <div style={styles.itemContainer}>
          <div>
            <p style={styles.itemTitle}>Geography</p>
            <p style={styles.subTitle}>Chapter 47</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.divider}></div>
            <p style={styles.time}>09:00 - 09:45</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  title: {
    color: "#4A4D58",
    fontWeight: 700,
    fontSize: 20,
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
  itemContainer: {
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    padding: "8px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemTitle: {
    color: "#4A4D58",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 0,
    paddingBottom: 4,
  },
  subTitle: {
    color: "#9699A5",
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 0,
  },
  time: {
    color: "#9699A5",
    fontWeight: 600,
    fontSize: 13,
    lineHeight: 0,
  },
  divider: {
    borderLeft: "1px solid #DBDBDB",
    height: 45,
    marginRight: 12,
  },
};
export default Schedule;
