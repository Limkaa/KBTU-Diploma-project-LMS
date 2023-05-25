import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import CourseLogo from "../shared/CourseLogo";
import { FloatButton, Form, Input, Space, Spin } from "antd";
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
import {
  useAddCoursePostMutation,
  useDeleteCoursePostMutation,
  useGetCoursePostsQuery,
  useUpdateCoursePostMutation,
} from "../../redux/coursePosts/coursePostsApiSlice";
import moment from "moment-timezone";
import { toastify } from "../shared/Toast/Toast";

const FormItem = styled(Form.Item)`
  &.ant-form-item .ant-form-item-label > label {
    font-size: 15px;
    font-weight: 600;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
  }
`;

const AntInput = styled(Input)`
  &.ant-input {
    font-size: 14px;
    font-weight: 500;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
  }
`;
const AntInputTextArea = styled(Input.TextArea)`
  &.ant-input {
    font-size: 14px;
    font-weight: 500;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
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
  const [form] = Form.useForm();
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [showMore, setShowMore] = React.useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useGetCourseQuery({ id: courseId });

  const { data: dataSyllabus, isLoading: isLoadingSyllabus } =
    useGetCourseSyllabusWithoutQuery({ course_id: courseId });

  const {
    data: dataPosts,
    isLoading: isLoadingPosts,
    refetch,
  } = useGetCoursePostsQuery({ course_id: courseId });

  const [createPost] = useAddCoursePostMutation();
  const [updatePost] = useUpdateCoursePostMutation();
  const [deletePost] = useDeleteCoursePostMutation();

  const {
    data: dataAssignments,
    isLoading: isLoadingAssignments,
    refetch: refetchAssignments,
  } = useGetCourseAssignmentsQuery({ course_id: courseId, search: "" });

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourse(data);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    refetchAssignments();
  }, [dataAssignments]);

  React.useEffect(() => {
    if (dataSyllabus && !isLoadingSyllabus) {
      setSyllabus(dataSyllabus);
    }
  }, [dataSyllabus, isLoadingSyllabus]);

  React.useEffect(() => {
    let sortedPosts = {};
    if (dataPosts && !isLoadingPosts) {
      dataPosts?.forEach((item) => {
        const time = moment(item?.updated_at).format("dddd, DD MMM YYYY");
        if (!sortedPosts[time]) {
          sortedPosts[time] = [];
          sortedPosts[time].push(item);
        } else {
          sortedPosts[time].push(item);
        }
      });
      setPosts(sortedPosts);
    }
  }, [dataPosts, isLoadingPosts]);

  React.useEffect(() => {
    if (dataAssignments && !isLoadingAssignments) {
      setAssignments(dataAssignments);
    }
  }, [dataAssignments, isLoadingAssignments]);

  const handleCreatePost = async () => {
    try {
      await createPost({
        course_id: courseId,
        title: title,
        text: text,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Post Created");
          refetch();
          setIsPost(false);
          setTitle("");
          setText("");
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleUpdatePost = async ({ values }) => {
    try {
      await updatePost({
        post_id: values.id,
        title: values.title,
        text: values.text,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Post Updated");
          refetch();
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleDeletePost = async ({ id }) => {
    try {
      await deletePost({
        post_id: id,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Post Deleted");
          refetch();
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* <div style={styles.header}>
        <Header text={"Course"} />
        <Profile />
      </div> */}
      <Spin spinning={isLoading} size="large">
        <Box
          sx={{
            flexGrow: 1,
            marginTop: 1,
            marginBottom: 8,
          }}
          onClick={() => setIsPost(false)}
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
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={styles.title}>
                            {course?.subject?.name}{" "}
                          </div>
                          <div style={styles.code}>{course?.subject?.code}</div>
                        </div>

                        <div style={styles.podtext}>
                          {course?.subject?.grade?.name}
                          {" (" + course?.group?.code + ")"}
                        </div>
                      </div>
                    </div>
                    {course?.teacher && (
                      <div style={styles.teachCont}>
                        <img
                          src={
                            course?.teacher?.avatar
                              ? course?.teacher?.avatar
                              : course?.teacher?.gender === "male"
                              ? require("../../assets/icons/boy.png")
                              : require("../../assets/icons/girl.png")
                          }
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
                      {posts[time]?.map((item) => (
                        <CoursePost
                          key={item.id}
                          item={item}
                          handleUpdatePost={handleUpdatePost}
                          handleDeletePost={handleDeletePost}
                          user={user}
                        />
                      ))}
                    </div>
                  ))}
              </div>
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
      {user?.role === "teacher" && (
        <div style={styles.newPostCont}>
          {isPost ? (
            <div style={{ width: "55%", padding: 15, transition: "all 0.3s" }}>
              <Form
                form={form}
                name="basic"
                autoComplete="off"
                onFinish={handleCreatePost}
                requiredMark={false}
              >
                <FormItem
                  label="Title:"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input title!",
                    },
                    {
                      whitespace: true,
                      message: "Title can not be empty!",
                    },
                  ]}
                >
                  <AntInput
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New post title"
                  />
                </FormItem>
                <FormItem
                  label="Text:"
                  name="text"
                  style={styles.formItems}
                  rules={[
                    {
                      required: true,
                      message: "Please input text!",
                    },
                    {
                      whitespace: true,
                      message: "Text can not be empty!",
                    },
                  ]}
                >
                  <AntInputTextArea
                    className="input"
                    rows={4}
                    style={{ resize: "none" }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="New post text"
                  />
                </FormItem>
                <Button
                  type="primary"
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                  htmlType="submit"
                >
                  Send
                </Button>
              </Form>
            </div>
          ) : (
            <Button
              style={styles.newPostBtn}
              icon={<EditSvg />}
              onClick={() => setIsPost(true)}
            >
              New post
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
  teachCont: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginRight: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: "rgba(74, 77, 88, 1)",
  },
  code: {
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(0, 136, 157, 1)",
    backgroundColor: "rgba(240, 247, 255, 1)",
    padding: "3px 7px",
    borderRadius: 8,
    marginLeft: 10,
  },
  titleCont: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teacher: {
    fontSize: 14,
    fontWeight: 500,
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
    fontSize: 18,
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
  newPostCont: {
    display: "flex",
    width: "100%",
    position: "fixed",
    left: 250,
    bottom: 0,
    minHeight: 70,
    backgroundColor: "rgba(248, 249, 250, 1)",
    borderTop: "1px solid rgba(92, 92, 92, 0.1)",
  },
  newPostBtn: {
    display: "flex",
    position: "fixed",
    left: 266,
    bottom: 10,
    minHeight: 30,
    backgroundColor: "#163A61",
    color: "white",
    fontWeight: 500,
    fontSize: 16,
    alignItems: "center",
    gap: 10,
    padding: "20px",
    transition: "all 0.3s",
  },
  formItems: {
    fontWeight: 600,
  },
};

export default Course;
