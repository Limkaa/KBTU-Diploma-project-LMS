import React from "react";

const TodoList = () => {
  return (
    <div style={{ marginTop: 20 }}>
      <div style={styles.header}>
        <p style={styles.title}>To Do List</p>
        <p style={styles.seeAll}>See all</p>
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
};
export default TodoList;
