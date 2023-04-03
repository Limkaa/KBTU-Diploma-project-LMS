import React from "react";

import moment from "moment-timezone";
import RightIcon from "../../assets/icons/right.svg";
import LeftIcon from "../../assets/icons/left.svg";
import { Button } from "antd";

const Calendar = () => {
  const [start, setStart] = React.useState(
    moment().isoWeekday(1).format("YYYY.MM.DD")
  );

  const days = [
    moment(start),
    moment(start).add(1, "days"),
    moment(start).add(2, "days"),
    moment(start).add(3, "days"),
    moment(start).add(4, "days"),
    moment(start).add(5, "days"),
    moment(start).add(6, "days"),
  ];

  const handleMinus = () => {
    setStart(
      moment(start, "YYYY.MM.DD").subtract(7, "days").format("YYYY.MM.DD")
    );
  };

  const handlePlus = () => {
    setStart(moment(start, "YYYY.MM.DD").add(7, "days").format("YYYY.MM.DD"));
  };

  return (
    <div style={{ marginTop: 25 }}>
      <div style={styles.header}>
        <div style={styles.month}>{moment().format("MMMM YYYY")}</div>
        <div>
          <Button onClick={handleMinus} type="link">
            <img src={LeftIcon} />
          </Button>
          <Button onClick={handlePlus} type="link">
            <img src={RightIcon} />
          </Button>
        </div>
      </div>
      <div style={styles.week}>
        {days.map((day, index) => {
          return (
            <div
              key={index}
              style={{
                ...styles.dayContainer,
                backgroundColor:
                  moment(day).format("YYYY.MM.DD") ===
                  moment().format("YYYY.MM.DD")
                    ? "#163A61"
                    : "white",
              }}
            >
              <p
                style={{
                  ...styles.weekText,
                  color:
                    moment(day).format("YYYY.MM.DD") ===
                    moment().format("YYYY.MM.DD")
                      ? "white"
                      : "black",
                }}
              >
                {moment(day).format("ddd").toUpperCase()}
              </p>
              <p
                style={{
                  ...styles.dayText,
                  color:
                    moment(day).format("YYYY.MM.DD") ===
                    moment().format("YYYY.MM.DD")
                      ? "white"
                      : "black",
                }}
              >
                {moment(day).format("D")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  week: {
    display: "flex",
    gap: 8,
    marginTop: 15,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  month: {
    color: "#4A4D58",
    fontWeight: 700,
    fontSize: 20,
  },
  dayContainer: {
    border: "1px solid #F1F1F1",
    flex: 1,
    padding: "8px 1px",
    textAlign: "center",
    borderRadius: 10,
  },
  weekText: {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: 0.5,
  },
  dayText: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 0,
  },
};

export default Calendar;
