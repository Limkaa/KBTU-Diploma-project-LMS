import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import CourseLogo from "../shared/CourseLogo";
import { Spin } from "antd";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useGetCourseSyllabusWithoutQuery } from "../../redux/syllabus/syllabusApiSlice";
import { Button } from "antd";
import CourseSyllabus from "./CourseSyllabus";
import { useGetCourseAssignmentsQuery } from "../../redux/assignments/assignmentsApiSlice";
import CourseAssignments from "./CourseAssignments";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  flexDirection: "column",
  color: "black",
  border: "none",
  borderRadius: 12,
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.12)",
  padding: 16,
}));
const Course = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = React.useState();
  const [syllabus, setSyllabus] = React.useState();
  const [assignments, setAssignments] = React.useState();
  const { data: user } = useGetAuthUserQuery();

  const [showMore, setShowMore] = React.useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetCourseQuery({ id: courseId });

  const { data: dataSyllabus, isLoading: isLoadingSyllabus } =
    useGetCourseSyllabusWithoutQuery({ course_id: courseId });

  const { data: dataAssignments, isLoading: isLoadingAssignments } =
    useGetCourseAssignmentsQuery({ course_id: courseId, search: "" });

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourse(data);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    if (dataSyllabus && !isLoadingSyllabus) {
      setSyllabus(dataSyllabus);
    }
  }, [dataSyllabus, isLoadingSyllabus]);

  React.useEffect(() => {
    if (dataAssignments && !isLoadingAssignments) {
      setAssignments(dataAssignments);
    }
  }, [dataAssignments, isLoadingAssignments]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Course"} />
        <Profile />
      </div>
      <Spin spinning={isLoading} size="large">
        <Box
          sx={{
            flexGrow: 1,
            marginTop: 3,
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={10} sm={9} md={8}>
              <Item style={{ marginBottom: 10 }}>
                <div style={styles.mainCont}>
                  <div style={styles.titleCont}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CourseLogo
                        title={course?.subject?.name}
                        width={50}
                        height={50}
                        fontSize={20}
                      />
                      <div style={styles.title}>{course?.subject?.name}</div>
                    </div>
                    {course?.teacher && (
                      <div style={styles.teachCont}>
                        <img
                          // src={course?.teacher?.avatar}
                          // alt="teacher"
                          style={styles.img}
                        />
                        <div>
                          <div style={styles.teacher}>
                            {course?.teacher?.first_name}{" "}
                            {course?.teacher?.last_name}
                          </div>
                          <div style={styles.podtext}>Teacher</div>
                        </div>
                      </div>
                    )}
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
              </Item>
              <Item>
                <div>
                  <div>Course Posts</div>
                </div>
              </Item>
            </Grid>
            <Grid item xs={1} sm={9} md={4}>
              {user?.role !== "manager" && (
                <Item style={{ marginBottom: 10 }}>
                  <div style={styles.cont}>
                    <div style={styles.titleForCont}>Assignments</div>
                    <Button
                      type="link"
                      onClick={() =>
                        navigate(`/courses/${course?.id}/assignments`, {
                          state: { courseId: course?.id },
                        })
                      }
                      style={styles.seeAll}
                    >
                      See all
                    </Button>
                  </div>
                  {assignments?.slice(0, 3).map((item) => (
                    <CourseAssignments key={item.id} item={item} />
                  ))}
                </Item>
              )}
              <Item>
                <div style={styles.cont}>
                  <div style={styles.titleForCont}>Syllabus</div>
                  <Button
                    type="link"
                    onClick={() =>
                      navigate(`/courses/${course?.id}/syllabus`, {
                        state: { courseId: course?.id },
                      })
                    }
                    style={styles.seeAll}
                  >
                    See all
                  </Button>
                </div>
                {syllabus?.slice(0, 3).map((item) => (
                  <CourseSyllabus key={item.id} item={item} />
                ))}
              </Item>
            </Grid>

            {/* <Grid item xs={10} sm={9} md={5}></Grid> */}
          </Grid>
        </Box>
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
  cont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainCont: {},
  teachCont: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginRight: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginLeft: 8,
  },
  titleCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teacher: {
    fontSize: 14,
    fontWeight: 400,
  },
  podtext: {
    fontSize: 14,
    fontWeight: 400,
    color: "#4A4D5896",
  },
  des: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 10,
    marginTop: 20,
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
    marginRight: 8,
  },
  titleForCont: {
    fontSize: 18,
    fontWeight: 700,
    color: "#4A4D58",
  },
  seeAll: {
    color: "#163A61",
    fontWeight: 600,
    fontSize: 14,
  },
};

export default Course;
