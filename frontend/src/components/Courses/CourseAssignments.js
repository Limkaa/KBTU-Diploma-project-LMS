import moment from "moment-timezone";
import React from "react";
import { Link } from "react-router-dom";

const CourseAssignments = ({ item }) => {
  const returnDate = (date) => {
    let today = moment().format("DD MMM YYYY");
    let tomorrow = moment(today).add(1, "days").format("DD MMM YYYY");
    if (moment(date).format("DD MMM YYYY") === today) {
      return moment(date).format("HH:mm") + " Today";
    } else if (moment(date).format("DD MMM YYYY") === tomorrow) {
      return moment(date).format("HH:mm") + " Tomorrow";
    } else {
      return moment(date).format("HH:mm MMM DD, YYYY");
    }
  };

  const returnColor = () => {
    if (moment(item.datetime) < moment()) {
      return "#45B764";
    } else {
      return "#F18D58";
    }
  };

  return (
    <Link to={`/assignments/${item.id}`} style={{ textDecoration: "none" }}>
      <div style={styles.assItem}>
        <div style={{ ...styles.statusLine, backgroundColor: returnColor() }} />
        <div style={styles.assCont}>
          <div style={{ display: "flex", flex: 1 }}>
            <div>
              <div style={styles.title}>{item?.name}</div>
              {moment(item.datetime) < moment() ? (
                <div style={styles.timeCont}>
                  <div style={{ ...styles.time, color: returnColor() }}>
                    Finished
                  </div>
                  <div style={styles.due}>{returnDate(item.datetime)}</div>
                </div>
              ) : (
                <div style={styles.timeCont}>
                  <div style={styles.due}>Due</div>
                  <div style={{ ...styles.time, color: returnColor() }}>
                    {returnDate(item.datetime)}
                  </div>
                </div>
              )}
            </div>
          </div>
          <img
            src={require("../../assets/icons/arrowcirlce.png")}
            style={{ width: 20, height: 20 }}
          />
        </div>
      </div>
    </Link>
  );
};

const styles = {
  statusLine: {
    width: 7,
    display: "flex",
    borderRadius: "8px 0px 0px 8px",
  },
  assItem: {
    display: "flex",
    borderRadius: 12,
    border: "1px solid #F1F1F1",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: "white",
  },
  assCont: {
    display: "flex",
    flex: 1,
    padding: "11px 20px 11px 10px",
    alignItems: "center",
  },
  timeCont: {
    display: "flex",
    alignItems: "center",
    marginTop: 3,
    gap: 3,
  },
  assImg: {
    width: 34,
    height: 34,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginLeft: 12,
  },
  title: {
    fontWeight: 500,
    fontSize: 14,
    color: "#4A4D58",
  },
  subtitle: {
    color: "#4A4D58A6",
    fontWeight: 400,
    fontSize: 13,
    textOverflow: "ellipsis",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 1,
    marginTop: 2,
  },
  turnIn: {
    color: "#F18D58",
    fontWeight: 700,
    fontSize: 14,
  },
  due: {
    color: "#A7A7A7",
    fontWeight: 600,
    fontSize: 13,
  },
  time: {
    fontWeight: 600,
    fontSize: 13,
  },
  deadline: {
    color: "#969696",
    fontWeight: 600,
    fontSize: 12,
  },
};

export default CourseAssignments;
