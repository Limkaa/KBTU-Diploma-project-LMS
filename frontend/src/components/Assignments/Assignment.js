import React from "react";
import { useParams } from "react-router-dom";
import { useGetAssignmentQuery } from "../../redux/assignments/assignmentsApiSlice";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Spin } from "antd";
import moment from "moment-timezone";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";

const Assignment = () => {
  const { id: assignment_id } = useParams();
  const [assignment, setAssignment] = React.useState();
  const { data, isLoading } = useGetAssignmentQuery({
    assignment_id,
  });
  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery({
    id: assignment?.course,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setAssignment(data);
    }
  }, [data, isLoading]);

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

  console.log(courseData);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assigment"} />
        <Profile />
      </div>
      <div style={styles.main}>
        <Spin spinning={isLoading} size="large">
          <div style={styles.subject}>{courseData?.subject?.name}</div>
          <div style={styles.name}>{assignment?.name}</div>
          <div style={styles.due}>Due {returnDate(assignment?.datetime)}</div>
          <div style={styles.des}>
            <div style={styles.desTitle}>Description</div>
            <div style={styles.desText}>{assignment?.description}</div>
          </div>
        </Spin>
      </div>
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
  main: {
    backgroundColor: "white",
    marginTop: 25,
    padding: 16,
    borderRadius: 8,
    minHeight: "70%",
  },
  name: {
    fontWeight: 600,
    fontSize: 22,
    color: "#4A4D58",
    marginTop: 3,
  },
  due: {
    color: "#4A4D58A6",
    fontWeight: 500,
    fontSize: 14,
  },
  subject: {
    color: "#4A4D58",
    fontWeight: 500,
    fontSize: 15,
  },
  des: {
    marginTop: 25,
    width: "55%",
  },
  desTitle: {
    color: "#4A4D58A6",
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 6,
  },
  desText: {
    fontWeight: 400,
    fontSize: 14,
    color: "#4A4D58",
  },
};

export default Assignment;
