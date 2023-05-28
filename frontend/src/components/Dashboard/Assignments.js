import React from "react";
import { useNavigate } from "react-router-dom";
import {Alert, Button, Spin} from "antd";
import {useEffect, useState} from "react";
import {useGetStudentQuery} from "../../redux/students/studentsApiSlice";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {useSelector} from "react-redux";
import {
  useGetStudentOrTeacherAssignmentsQuery
} from "../../redux/assignments/assignmentsApiSlice";

const Assignments = (props) => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [student, setStudent] = useState();
  const {data: studentData, isSuccess: isStudentSuccess, error} = useGetStudentQuery(user.user_id);
  const {data: assignmentsData, isSuccess: isAssignmentsSuccess, isLoading}
      = useGetStudentOrTeacherAssignmentsQuery({type: props.type, studentId: student?.id, teacherId: user.user_id});
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (isStudentSuccess) {
      setStudent(studentData);
    }
  }, [studentData, isStudentSuccess])

  useEffect(() => {
    if (isAssignmentsSuccess) {
      let arr = [];
      for (let as of assignmentsData.results) {
        const date = new Date(as.datetime);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes} ${dayOfWeek}`;
        arr.push({id: as.id, name: as.name, time: formattedTime, subject: as.course.subject.name})
      }
      setAssignments(arr.slice(0, 5));
    }
  }, [assignmentsData, isAssignmentsSuccess])

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
        {/*<Spin spinning={isLoading}>*/}
          {
            assignments.map(as => (
                <div key={as.id} style={styles.assItem}>
                  <div style={{ display: "flex", alignItems: "center", width: "75%" }}>
                    <div style={styles.statusLine} />
                    <div style={{ marginLeft: 12 }}>
                      <p style={styles.title}>{as.name}</p>
                      <p style={styles.subtitle}>{as.subject}</p>
                    </div>
                  </div>
                  <div style={{ width: "20%" }}>
                    <p style={styles.time}>{as.time}</p>
                    <p style={styles.deadline}>Deadline</p>
                  </div>
                </div>
            ))
          }
          {!isLoading && !assignments.length &&
              <Alert message={"You have no assignments."}/>
          }
        {/*</Spin>*/}
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
    border: "1px solid rgba(5, 5, 5, 0.06)"
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
    marginBottom: 5,
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
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1,
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
