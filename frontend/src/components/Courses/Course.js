import React from "react";
import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import CourseLogo from "../shared/CourseLogo";
import { Spin } from "antd";

const Course = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = React.useState();
  const [showMore, setShowMore] = React.useState(false);

  const { data, isLoading } = useGetCourseQuery({ id: courseId });

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourse(data);
    }
  }, [data, isLoading]);

  console.log(course);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Course"} />
        <Profile />
      </div>
      <Spin spinning={isLoading} size="large">
        <div style={styles.wrapper}>
          <div style={styles.mainCont}>
            <div style={styles.titleCont}>
              <div style={{ display: "flex" }}>
                <CourseLogo
                  title={course?.subject?.name}
                  width={50}
                  height={50}
                  fontSize={20}
                />
                <div style={styles.title}>{course?.subject?.name}</div>
              </div>
              <div style={styles.teachCont}>
                <img
                  // src={course?.teacher?.avatar}
                  // alt="teacher"
                  style={styles.img}
                />
                <div>
                  <div style={styles.teacher}>
                    {course?.teacher?.first_name} {course?.teacher?.last_name}
                  </div>
                  <div>Teacher</div>
                </div>
              </div>
            </div>
            {course?.subject?.description && (
              <>
                <div style={styles.des}>Description</div>
                <div style={styles.desText}>
                  {showMore
                    ? course?.subject?.description
                    : `${course?.subject?.description.substring(0, 300)}`}
                  <button
                    style={styles.btn}
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show less" : "Show more"}
                  </button>
                </div>
              </>
            )}
          </div>
          <div>
            <div>Assignments</div>
          </div>
        </div>
      </Spin>
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#FAFAFA",
    padding: 16,
  },
  header: {
    display: "flex",
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  wrapper: {
    display: "flex",
  },
  search: {
    height: 40,
    width: 280,
    border: "none",
    borderRadius: 8,
  },
  mainCont: {
    backgroundColor: "white",
    padding: 16,
    border: 8,
    width: "40%",
  },
  teachCont: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 12,
  },
  titleCont: {
    display: "flex",
    gap: 15,
    justifyContent: 'space-between'
  },
  teacher: {
    fontSize: 14,
    fontWeight: 400,
    color: "#4A4D5896",
  },
  des: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 10,
  },
  desText: {
    fontSize: 14,
    fontWeight: 400,
  },
  btn: {
    backgroundColor: "white",
    border: "none",
    cursor: "pointer",
    color: "#FFB082",
  },
  img: {
    width: 35,
    height: 35,
    backgroundColor: "#DBDBDB",
    borderRadius: 220,
  },
};

export default Course;
