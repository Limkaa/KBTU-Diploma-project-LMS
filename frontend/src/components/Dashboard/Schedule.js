import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {useGetStudentQuery} from "../../redux/students/studentsApiSlice";
import {
  useGetTimeTableWithWeekdayQuery
} from "../../redux/timeline/timetableApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Alert} from "antd";

const Schedule = (props) => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [events, setEvents] = useState([]);
  const {data: studentData, isSuccess: isStudentSuccess, error} = useGetStudentQuery(user.user_id);
  const [student, setStudent] = useState();
  const {data: timetableData, isSuccess, refetch} = useGetTimeTableWithWeekdayQuery(
      {type: props.type, weekday: dayOfWeek, studentGroupId: student?.group?.id, teacherId: user.user_id});

  useEffect(() => {
    if (isStudentSuccess) {
      setStudent(studentData);
    }
  }, [studentData, isStudentSuccess])

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    let arr = [];
    if (isSuccess) {
      for (let slot of timetableData)
        arr.push({
          id: slot.id,
          subject: slot.course.subject.name,
          time: slot.timebound.from_time.slice(0,5) + " - " + slot.timebound.to_time.slice(0,5),
          room: slot.room.name,
        })
      setEvents(arr);
    }
  }, [timetableData, isSuccess])


  return (
    <div style={{ marginTop: 15 }}>
      <div style={styles.header}>
        <p style={styles.title}>Schedule</p>
        <Button
          onClick={() => navigate("/timeline")}
          type="link"
          style={{ padding: 0 }}
        >
          <p style={styles.seeAll}>See all</p>
        </Button>
      </div>
      <div>
        {
          events.map(event => (
              <div key={event.id} style={styles.itemContainer}>
                <div>
                  <p style={styles.itemTitle}>{event.subject}</p>
                  <p style={styles.subTitle}>Room {event.room}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={styles.divider}></div>
                  <p style={styles.time}>{event.time}</p>
                </div>
              </div>
          ))
        }
        {
          !events.length &&
          <Alert message={`You have no scheduled events for today.`}/>
        }
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
    alignItems: "baseline",
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
    marginBottom: 5,
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
