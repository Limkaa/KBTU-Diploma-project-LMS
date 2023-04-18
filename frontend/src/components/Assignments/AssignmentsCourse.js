import React from "react";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { useLocation } from "react-router-dom";
import { useGetCourseAssignmentsQuery } from "../../redux/assignments/assignmentsApiSlice";
import moment from "moment-timezone";
import { Spin } from "antd";

const AssignmentsCourse = () => {
  const location = useLocation();
  let courseId = location?.state?.courseId;
  const [assignments, setAssignments] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const { data: dataAssignments, isLoading: isLoadingAssignments } =
    useGetCourseAssignmentsQuery({ course_id: courseId });

  React.useEffect(() => {
    let sortedAssignmentss = {};
    if (dataAssignments && !isLoadingAssignments) {
      dataAssignments?.forEach((item) => {
        const time = moment(item?.datetime).format("MMM DD, YYYY");
        if (!sortedAssignmentss[time]) {
          sortedAssignmentss[time] = [];
          sortedAssignmentss[time].push(item);
        } else {
          sortedAssignmentss[time].push(item);
        }
      });
      setAssignments(sortedAssignmentss);
      setLoading(false);
    }
  }, [dataAssignments, isLoadingAssignments]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assignments"} />
        <Profile />
      </div>
      <Spin spinning={loading} size="large">
        {assignments &&
          Object?.keys(assignments).map((item) => (
            <div>
              <div>{item}</div>
              {assignments[item].map((el) => (
                <div>{el?.name}</div>
              ))}
            </div>
          ))}
      </Spin>
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
  tableCont: {
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
};
export default AssignmentsCourse;
