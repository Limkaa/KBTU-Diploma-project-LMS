import React from "react";

const CourseSyllabus = ({ item }) => {
  return (
    <div style={styles.itemCont}>
      <div style={{ width: "80%" }}>
        <div style={styles.name}>{item?.name}</div>
        <div style={styles.des}>{item?.description}</div>
        <div style={styles.hours}>Hours: {item?.hours}</div>
      </div>
      <div
        style={{
          ...styles.status,
          color: item.is_completed ? "#45B764" : "#969696",
        }}
      >
        {item.is_completed ? "Completed" : "Not yet"}
      </div>
    </div>
  );
};
const styles = {
  itemCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 13,
    borderBottom: "1px solid #0000001A",
  },
  status: {
    fontWeight: 700,
    fontSize: 14,
  },
  name: {
    fontWeight: 500,
    fontSize: 14,
  },
  hours: {
    color: "#00889D",
    fontWeight: 400,
    fontSize: 13,
    marginTop: 3,
  },
  des: {
    color: "#4A4D58A6",
    fontWeight: 400,
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    marginTop: 2,
  },
};
export default CourseSyllabus;
