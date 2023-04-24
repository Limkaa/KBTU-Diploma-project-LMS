import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import CourseLogo from "../shared/CourseLogo";
import { FloatButton, Input, Space, Spin } from "antd";
import { styled as muistyled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useGetCourseSyllabusWithoutQuery } from "../../redux/syllabus/syllabusApiSlice";
import { Button } from "antd";
import CourseSyllabus from "./CourseSyllabus";
import { useGetCourseAssignmentsQuery } from "../../redux/assignments/assignmentsApiSlice";
import CourseAssignments from "./CourseAssignments";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import EditSvg from "../../assets/icons/Edit";
import Fab from "@mui/material/Fab";
import CoursePost from "./CoursePost";
import styled from "styled-components";
import { useGetCoursePostsQuery } from "../../redux/coursePosts/coursePostsApiSlice";
import moment from "moment-timezone";

const Float = styled(FloatButton)`
  &.ant-float-btn-default {
    background-color: #163a61;
  }
  &.ant-float-btn-default .ant-float-btn-body {
    background-color: #163a61;
  }
`;

const Item = muistyled(Paper)(({ theme }) => ({
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
  const [posts, setPosts] = React.useState();
  const { data: user } = useGetAuthUserQuery();
  const [isPost, setIsPost] = React.useState();

  const [showMore, setShowMore] = React.useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetCourseQuery({ id: courseId });

  const { data: dataSyllabus, isLoading: isLoadingSyllabus } =
    useGetCourseSyllabusWithoutQuery({ course_id: courseId });

  const { data: dataPosts, isLoading: isLoadingPosts } = useGetCoursePostsQuery(
    { course_id: courseId }
  );

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

  // React.useEffect(() => {
  //   if (dataPosts && !isLoadingPosts) {
  //     setPosts(dataPosts);
  //     console.log(dataPosts);
  //   }
  // }, [dataPosts, isLoadingPosts]);

  React.useEffect(() => {
    let sortedPosts = {};
    if (dataPosts && !isLoadingPosts) {
      console.log(dataPosts);
      dataPosts?.forEach((item) => {
        const time = moment(item?.created_at).format("dddd, DD MMM YYYY");
        if (!sortedPosts[time]) {
          sortedPosts[time] = [];
          sortedPosts[time].push(item);
        } else {
          sortedPosts[time].push(item);
        }
      });
      setPosts(sortedPosts);
      // setLoading(false);
    }
  }, [dataPosts, isLoadingPosts]);

  React.useEffect(() => {
    if (dataAssignments && !isLoadingAssignments) {
      setAssignments(dataAssignments);
    }
  }, [dataAssignments, isLoadingAssignments]);

  console.log(course);

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
            marginBottom: 8,
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
                      <div style={{ marginLeft: 8 }}>
                        <div style={styles.title}>{course?.subject?.name}</div>
                        <div style={styles.podtext}>
                          {course?.subject?.grade?.name}
                        </div>
                      </div>
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
              {/* <Item> */}
              <div>
                <div style={styles.cont}>
                  <div
                    style={{
                      ...styles.titleForCont,
                      marginTop: 7,
                      marginLeft: 5,
                    }}
                  >
                    Posts
                  </div>
                </div>
                {posts &&
                  Object?.keys(posts).map((time, index) => (
                    <div key={index}>
                      <div style={styles.timeCont}>
                        <div style={styles.line} />
                        <div style={styles.dateTitle}>{time}</div>
                        <div style={styles.line} />
                      </div>
                      {posts[time].map((item) => (
                        <CoursePost
                          key={item.id}
                          setIsPost={setIsPost}
                          isPost={isPost}
                          item={item}
                        />
                      ))}
                    </div>
                  ))}
              </div>
              {/* </Item> */}
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
          </Grid>
        </Box>
      </Spin>
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "fixed",
          left: 250,
          bottom: 0,
          minHeight: 60,
          backgroundColor: "rgba(248, 249, 250, 1)",
          borderTop: "1px solid rgba(92, 92, 92, 0.1)",
        }}
      >
        {isPost ? (
          <Space.Compact
            style={{
              display: "flex",
              width: "50%",
              position: "fixed",
              left: 266,
              bottom: 2,
              minHeight: 30,
            }}
            size="large"
          >
            <Input defaultValue="Combine input and button" size="large" />
            <Button type="primary">Submit</Button>
          </Space.Compact>
        ) : (
          // <Float
          //   style={{ left: 266, width: 50, height: 50 }}
          //   tooltip={<div>New post</div>}
          //   icon={<EditSvg />}
          //   onClick={() => setIsPost(true)}
          // />
          <Button
            style={{
              display: "flex",
              position: "fixed",
              left: 266,
              bottom: 2,
              minHeight: 30,
            }}
            // style={styles.bottomBtn}
            icon={<EditSvg />}
            onClick={() => setIsPost(true)}
          >
            New post
          </Button>
        )}
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
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  wrapper: {
    display: "flex",
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
    fontWeight: 500,
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
    fontSize: 19,
    fontWeight: 700,
    color: "#4A4D58",
  },
  seeAll: {
    color: "#163A61",
    fontWeight: 600,
    fontSize: 14,
  },
  bottom: {
    position: "absolute",
    bottom: 30,
    marginLeft: 20,
  },
  bottomBtn: {
    fontSize: 16,
    fontWeight: 500,
    color: "#163A61",
    alignItems: "center",
    gap: 10,
    display: "flex",
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: "#163A61",
    marginLeft: 10,
    marginRight: 10,
  },
  timeCont: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
  },
  line: {
    height: 1,
    backgroundColor: "rgba(22, 58, 97, 0.1)",
    flex: 1,
    width: "100%",
  },
};

export default Course;
