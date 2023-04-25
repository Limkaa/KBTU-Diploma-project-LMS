import { Button, Form, Input, Modal } from "antd";
import React, { useRef } from "react";
import { useGetCoursePostCommentsQuery } from "../../redux/coursePosts/comments/commentsApiSlice";
import moment from "moment-timezone";
import { Dropdown, Space } from "antd";
import styled from "styled-components";

const AntInput = styled(Input)`
  &.ant-input {
    font-size: 14px;
    font-weight: 500;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
    margin-bottom: 13px;
  }
`;
const AntInputTextArea = styled(Input.TextArea)`
  &.ant-input {
    font-size: 14px;
    font-weight: 500;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
    margin-bottom: 13px;
  }
`;

const AntButton = styled(Button)`
  &.ant-btn {
    border-radius: 0px 0px 12px 12px;
  }
  &.ant-btn-link {
    color: rgba(22, 58, 97, 0.7);
    display: flex;
    align-items: center;
    padding: 5px 15px;
    font-weight: 500;
    font-size: 14px;
    gap: 5px;
    width: 100%;
    background-color: rgba(248, 249, 250, 1);
  }
  &.ant-btn-link:hover {
    color: rgba(22, 58, 97, 1);
    display: flex;
    align-items: center;
    padding: 5px 15px;
    font-weight: 500;
    font-size: 14px;
    gap: 5px;
    background-color: rgba(248, 249, 250, 1);
  }
`;

const InputReply = styled(Input)`
  &.ant-input {
    padding: 15px;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: #163a61;
    border: none;
    border-bottom: 2px solid rgba(0, 136, 157, 1);
  }
  &.ant-input:focus {
    box-shadow: none;
  }
`;
const CoursePost = ({ item, handleUpdatePost, handleDeletePost, user }) => {
  const [comments, setComments] = React.useState([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isReply, setIsReply] = React.useState(false);
  const inputRef = useRef(null);
  const [showDeletePost, setShowDeletePost] = React.useState(false);
  const [form] = Form.useForm();

  const [values, setValues] = React.useState({
    title: "",
    text: "",
  });
  const { title, text } = values;

  React.useEffect(() => {
    if (item) {
      setValues({ ...item });
    }
  }, [item]);

  const { data: dataComments, isLoading: isLoadingComments } =
    useGetCoursePostCommentsQuery({ post_id: item.id });

  React.useEffect(() => {
    if (dataComments && !isLoadingComments) {
      setComments(dataComments);
    }
  }, [dataComments, isLoadingComments]);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const items = [
    {
      label: <a onClick={() => setIsEdit(true)}>Edit post</a>,
      key: "0",
    },
    {
      label: <a onClick={() => setShowDeletePost(true)}>Delete post</a>,
      key: "1",
      danger: true,
    },
  ];
  return (
    <div style={styles.container}>
      {isEdit ? (
        <div style={{ padding: 15 }}>
          <AntInput
            className="input"
            value={title}
            name="title"
            onChange={handleInputChange}
            placeholder="Post title"
          />
          <AntInputTextArea
            className="input"
            rows={4}
            style={{ resize: "none" }}
            value={text}
            name="text"
            onChange={handleInputChange}
            placeholder="Post text"
          />
          <Button
            type="primary"
            style={{
              fontWeight: 600,
              fontSize: 15,
            }}
            disabled={text?.length === 0 || title?.length === 0}
            onClick={() => {
              handleUpdatePost({ values });
              setIsEdit(false);
            }}
          >
            Update
          </Button>
          <Button
            style={{
              fontWeight: 600,
              fontSize: 15,
              marginLeft: 10,
            }}
            onClick={() => {
              setIsEdit(false);
              setValues({ ...item });
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              // borderBottom: item?.text
              //   ? "1px solid rgba(0, 0, 0, 0.1)"
              //   : "none",
              alignItems: "center",
              justifyContent: "space-between",
              padding: item?.text
                ? "15px 15px 10px 15px"
                : "15px 15px 15px 15px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div style={styles.title}>{item?.title}</div>
              <div style={styles.day}>
                {moment(item?.updated_at).format("MMM DD, YYYY HH:mm")}
              </div>
            </div>
            {user?.role === "teacher" && (
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <a onClick={(e) => e.preventDefault()}>
                  <img
                    src={require("../../assets/icons/more.png")}
                    style={styles.imgEdit}
                  />
                </a>
              </Dropdown>
            )}
          </div>
          {item?.text && <div style={styles.text}>{item?.text}</div>}
        </div>
      )}
      {comments?.length > 0 && (
        <div style={styles.commentsCont}>
          <div style={styles.commentsTitle}>Comments</div>
          {comments.map((item) => (
            <div style={styles.comment}>
              <img style={styles.avatar} />
              <div style={styles.rightCont}>
                <div style={styles.userInfo}>
                  <div style={styles.name}>
                    {item?.user?.first_name} {item?.user?.last_name}
                  </div>
                  <div style={styles.day}>
                    {moment(item?.updated_at).format("MMM DD, YYYY HH:mm")}
                  </div>
                </div>
                <div key={item.id}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isReply ? (
        <Space.Compact style={{ width: "100%" }}>
          <InputReply placeholder="Comment..." size="large" ref={inputRef} />
          <Button
            style={{ border: "none" }}
            icon={
              <img
                src={require("../../assets/icons/reply.png")}
                style={styles.reply}
              />
            }
          ></Button>
        </Space.Compact>
      ) : (
        <AntButton
          type="link"
          icon={
            <img
              src={require("../../assets/icons/reply.png")}
              style={styles.reply}
            />
          }
          onClick={() => {
            setIsReply(true);
            inputRef.current.focus({
              cursor: "start",
            });
          }}
        >
          Reply
        </AntButton>
      )}

      <Modal
        title="Are you sure about deleting this post?"
        open={showDeletePost}
        onOk={() => handleDeletePost({ id: item.id })}
        onCancel={() => setShowDeletePost(false)}
      >
        <p>Data cannot be recovered</p>
      </Modal>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 12,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s",
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    color: "#4A4D58",
    marginRight: 10,
  },
  imgEdit: {
    width: 20,
    height: 6,
    cursor: "pointer",
  },
  text: {
    padding: "0px 15px 15px 15px",
    color: "rgba(92, 92, 92, 1)",
    fontWeight: 400,
    fontSize: 15,
  },
  commentsCont: {
    backgroundColor: "rgba(248, 249, 250, 1)",
    padding: "6px 12px 4px 12px",
    // borderRadius: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderRadius: "50%",
  },
  comment: {
    display: "flex",
    padding: "0px 0px 10px 0px",
    marginBottom: 5,
  },
  userInfo: {
    display: "flex",
    gap: 5,
    alignItems: "center",
  },
  rightCont: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: 500,
    fontSize: 15,
    color: "rgba(74, 77, 88, 1)",
  },
  day: {
    fontWeight: 500,
    fontSize: 13,
    color: "rgba(92, 92, 92, 1)",
  },
  replyText: {
    fontWeight: 500,
    fontSize: 14,
    color: "#163A61",
  },
  reply: {
    width: 15,
    height: 15,
  },
  replyCont: {
    display: "flex",
    alignItems: "center",
    padding: "5px 15px",
    fontWeight: 500,
    fontSize: 14,
    color: "#163A61",
    gap: 5,
  },
  commentsTitle: {
    fontWeight: 500,
    fontSize: 14,
    color: "#163A61",
    paddingBottom: 8,
  },
};

export default CoursePost;
