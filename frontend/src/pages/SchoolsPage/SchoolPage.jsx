import React from "react";
import Profile from "../../components/Dashboard/Profile";
import Header from "../../components/shared/Header/Header";
import "./SchoolPage.css";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
  useGetSchoolQuery,
  useUpdateSchoolMutation,
} from "../../redux/schools/schoolsApiSlice";
import { useEffect, useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import "react-toastify/dist/ReactToastify.css";
import { toastify } from "../../components/shared/Toast/Toast";
import EditSvg from "../../assets/icons/Edit";
import styled from "styled-components";
import {
  useAddSchoolPostMutation,
  useDeleteSchoolPostMutation,
  useGetSchoolPostsQuery,
  useUpdateSchoolPostMutation,
} from "../../redux/schoolPosts/schoolPostsApiSlice";
import moment from "moment-timezone";
import CoursePost from "../../components/Courses/CoursePost";
import SchoolPost from "./SchoolPost";
import Cancel from "../../assets/icons/close.svg";
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

const SchoolPage = () => {
  const user = useSelector(selectCurrentUser);
  const disabled = user.role !== "manager";
  const [updateSchool] = useUpdateSchoolMutation();
  const {
    data: school,
    isLoading,
    isSuccess,
    refetch: refetchSchool,
  } = useGetSchoolQuery(user?.school_id);
  const [name, setName] = useState(school?.name);
  const [address, setAddress] = useState(school?.address);
  const [desc, setDesc] = useState(school?.description);
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isPost, setIsPost] = React.useState();
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [posts, setPosts] = React.useState();

  console.log(user)

  const {
    data: dataPosts,
    isLoading: isLoadingPosts,
    refetch,
  } = useGetSchoolPostsQuery({ school_id: school?.id });

  const [createPost] = useAddSchoolPostMutation();
  const [updatePost] = useUpdateSchoolPostMutation();
  const [deletePost] = useDeleteSchoolPostMutation();

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

  useEffect(() => {
    if (isSuccess) {
      setName(school.name);
      setDesc(school.description);
      setAddress(school.address);
      form.setFieldsValue({
        name: school?.name,
        description: school?.description,
        address: school?.address,
      });
    }
  }, [school, isSuccess, form]);

  const handleCreatePost = async () => {
    try {
      await createPost({
        school_id: school?.id,
        title: title,
        text: text,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Post Created");
          refetch();
          setTitle("");
          setText("");
          setIsPost(false);
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

  const onUpdateSchool = () => {
    if (
      name === school?.name &&
      address === school?.address &&
      desc === school?.description
    ) {
      toastify("info", "School information has not changed");
    } else {
      updateSchool({
        school_id: user.school_id,
        name,
        address,
        description: desc,
      })
        .unwrap()
        .then((school) => {
          setName(school.name);
          setDesc(school.description);
          setAddress(school.address);
          toastify("success", "School successfully updated");
          setIsEdit(false);
          refetchSchool();
        })
        .catch(() => {
          toastify("error", "School updating failed");
        });
    }
  };

  return (
    <main className="school">
      <header className="header">
        <Header text={"School"} />
        <Profile />
      </header>
      <div onClick={() => setIsPost(false)} style={{ paddingBottom: 60 }}>
        <Spin spinning={isLoading}>
          <div className="section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ width: "80%" }}>
                <div>
                  {isEdit ? (
                    <Input
                      placeholder="School Title"
                      style={{
                        ...styles.title,
                        border: "none",
                        borderBottom: "1px solid #00000038",
                        padding: 0,
                        boxShadow: "none",
                        borderRadius: 0,
                        width: "40%",
                      }}
                      value={name}
                      name="name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="title">{school?.name}</div>
                      {!isEdit && user?.role === "manager" && (
                        <img
                          src={require("../../assets/icons/edit.png")}
                          style={styles.imgEdit}
                          onClick={() => setIsEdit(true)}
                        />
                      )}
                    </div>
                  )}
                </div>

                {isEdit ? (
                  <Input
                    placeholder="Address"
                    className="address"
                    style={{
                      border: "none",
                      borderBottom: "1px solid #00000038",
                      padding: 0,
                      boxShadow: "none",
                      borderRadius: 0,
                      width: "35%",
                    }}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                ) : (
                  <div className="address">Address: {school?.address}</div>
                )}
                {isEdit ? (
                  <div style={{ paddingTop: 10, width: "100%" }}>
                    <div className="des">Description</div>
                    <Input.TextArea
                      rows={4}
                      placeholder="Description"
                      className="desText"
                      style={{ width: "90%", marginTop: 10 }}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                ) : (
                  school?.description && (
                    <div style={{ paddingTop: 10, width: "90%" }}>
                      <div className="des">Description</div>
                      <div className="desText">{school?.description}</div>
                    </div>
                  )
                )}
              </div>
              <div>
                {isEdit && (
                  <img
                    src={Cancel}
                    style={styles.close}
                    onClick={() => {
                      setIsEdit(false);
                    }}
                  />
                )}
              </div>
            </div>
            {isEdit && (
              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  style={styles.btn1}
                  onClick={onUpdateSchool}
                  disabled={name?.length === 0 || address?.length === 0}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <div>
            <div style={styles.cont}>
              <div
                style={{
                  ...styles.titleForCont,
                  marginTop: 15,
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
                    <SchoolPost
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
        </Spin>
      </div>
      {user?.role === "manager" && (
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
                  Submit
                </Button>
              </Form>
            </div>
          ) : (
            <Button
              style={styles.newPostBtn}
              icon={<EditSvg />}
              onClick={() => {
                setIsPost(true);
                form.resetFields();
              }}
            >
              New post
            </Button>
          )}
        </div>
      )}
    </main>
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
  imgEdit: {
    width: 23,
    height: 23,
    cursor: "pointer",
    marginLeft: 10,
  },
  close: {
    cursor: "pointer",
    padding: 5,
  },
  btn1: {
    backgroundColor: "#163A61",
    color: "white",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
};

export default SchoolPage;
