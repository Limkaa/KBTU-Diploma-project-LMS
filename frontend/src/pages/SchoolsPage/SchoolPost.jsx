import { Button, Form, Input, Modal } from "antd";
import React, { useRef } from "react";
import moment from "moment-timezone";
import { Dropdown, Space } from "antd";
import styled from "styled-components";
import { toastify } from "../../components/shared/Toast/Toast";
import Cancel from "../../assets/icons/close.svg";
import Tick from "../../assets/icons/tick.svg";
import Delete from "../../assets/icons/delete.svg";
import {
  useAddSchoolPostCommentMutation,
  useDeleteSchoolPostCommentMutation,
  useGetSchoolPostCommentsQuery,
  useUpdateSchoolPostCommentMutation,
} from "../../redux/schoolPosts/comments/schoolPostCommentsApiSlice";

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

const CommentInputTextArea = styled(Input.TextArea)`
  &.ant-input[disabled] {
    width: 95%;
    font-size: 13px;
    font-weight: 500;
    font-family: "Open Sans";
    color: rgba(74, 77, 88, 1);
    border: none;
    background-color: rgba(248, 249, 250, 1);
    padding: 0;
    cursor: default;
    border-radius: 0px;
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
    border-bottom: 3px solid rgba(0, 136, 157, 1);
  }
  &.ant-input:focus {
    box-shadow: none;
  }
`;

const InputComment = styled(Input)`
  &.ant-input {
    padding: 15px;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: #163a61;
    border: none;
    border-left: 4px solid #163a61;
    border-radius: 0px;
  }
  &.ant-input:focus {
    box-shadow: none;
  }
`;

const ReplyButton = styled(Button)`
  &.ant-btn {
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    width: 40px;
    color: #163a61;
    border: none;
    align-items: center;
    display: flex;
    border-bottom: 3px solid rgba(0, 136, 157, 1);
    padding-left: 5px;
  }
  &.ant-input:focus {
    box-shadow: none;
  }
`;

const SchoolPost = ({ item, handleUpdatePost, handleDeletePost, user }) => {
  const [comments, setComments] = React.useState([]);
  const [isEdit, setIsEdit] = React.useState(false);
  const [isEditComment, setIsEditComment] = React.useState(false);
  const [isReply, setIsReply] = React.useState(false);
  const inputRef = useRef(null);
  const [showDeletePost, setShowDeletePost] = React.useState(false);
  const [showDeleteComment, setShowDeleteComment] = React.useState(false);
  const [textComment, setTextComment] = React.useState();
  const [editedComment, setEditedComment] = React.useState();
  const [comment, setComment] = React.useState();

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

  const {
    data: dataComments,
    isLoading: isLoadingComments,
    refetch,
  } = useGetSchoolPostCommentsQuery({ post_id: item.id });

  const [createPostComment] = useAddSchoolPostCommentMutation();
  const [updatePostComment] = useUpdateSchoolPostCommentMutation();
  const [deletePostComment] = useDeleteSchoolPostCommentMutation();

  React.useEffect(() => {
    if (dataComments && !isLoadingComments) {
      setComments(dataComments);
    }
  }, [dataComments, isLoadingComments]);

  const handleCreatePostComment = async () => {
    try {
      await createPostComment({
        post_id: item.id,
        text: textComment,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          setIsReply(false);
          setTextComment("");
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleUpdatePostComment = async (item) => {
    try {
      await updatePostComment({
        comment_id: item.id,
        text: editedComment,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          setIsEditComment(false);
          setEditedComment("");
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleDeletePostComment = async () => {
    try {
      await deletePostComment({
        comment_id: comment?.id,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          setIsEditComment(false);
          setEditedComment("");
          setShowDeleteComment(false);
        });
    } catch (err) {
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

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
            {user?.role === "manager" && (
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
            <div key={item?.id}>
              {isEditComment && comment?.id === item?.id && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  <InputComment
                    className="input"
                    value={editedComment}
                    name="editedComment"
                    onChange={(e) => setEditedComment(e.target.value)}
                    placeholder="Comment text"
                  />
                  <Button
                    type="link"
                    style={{ marginRight: 15 }}
                    icon={<img src={Delete} />}
                    onClick={() => setShowDeleteComment(true)}
                  />
                  <Button
                    type="link"
                    style={{ marginRight: 10 }}
                    icon={<img src={Cancel} />}
                    onClick={() => setIsEditComment(false)}
                  />
                  <Button
                    type="link"
                    style={{ marginRight: 7, height: 26 }}
                    icon={<img src={Tick} />}
                    disabled={editedComment?.length === 0}
                    onClick={() => handleUpdatePostComment(item)}
                  />
                </div>
              )}
              <div style={styles.comment}>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    borderLeft:
                      user?.user_id === item?.user?.id
                        ? "4px solid #163A61"
                        : "4px solid rgba(248, 249, 250, 1)",
                    paddingLeft: 12,
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  <img style={styles.avatar} />
                  <div style={styles.rightCont}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginRight: 15,
                        alignItems: "center",
                      }}
                    >
                      <div style={styles.userInfo}>
                        <div style={styles.name}>
                          {item?.user?.first_name} {item?.user?.last_name}
                        </div>
                        <div style={styles.day}>
                          {moment(item?.updated_at).format(
                            "MMM DD, YYYY HH:mm"
                          )}
                        </div>
                      </div>
                      <div>
                        {user?.user_id === item?.user?.id && !isEditComment && (
                          <img
                            src={require("../../assets/icons/edit.png")}
                            style={styles.editImg}
                            onClick={() => {
                              setIsEditComment(true);
                              setEditedComment(item?.text);
                              setIsReply(false);
                              setComment(item);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <CommentInputTextArea
                      value={item?.text}
                      autoSize={{ minRows: 1, maxRows: 7 }}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <Modal
                title="Are you sure about deleting this comment?"
                open={showDeleteComment}
                onOk={() => handleDeletePostComment()}
                onCancel={() => setShowDeleteComment(false)}
              >
                <p>Data cannot be recovered</p>
              </Modal>
            </div>
          ))}
          {isReply ? (
            <Space.Compact style={{ width: "100%" }}>
              <InputReply
                placeholder="Comment..."
                size="large"
                onChange={(e) => setTextComment(e.target.value)}
              />
              <ReplyButton
                type="link"
                icon={
                  <img
                    src={require("../../assets/icons/send.png")}
                    style={styles.send}
                  />
                }
                onClick={handleCreatePostComment}
              />
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
                setIsEdit(false);
                setIsEditComment(false);
              }}
            >
              Reply
            </AntButton>
          )}
        </div>
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
    width: 17,
    height: 5.5,
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
  },
  commentText: {
    fontWeight: 400,
    fontSize: 14,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderRadius: "50%",
  },
  comment: {
    display: "flex",
    alignItems: "center",
    height: "100%",
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
    fontSize: 14,
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
  send: {
    width: 22,
    height: 22,
  },
  editImg: {
    width: 18,
    height: 18,
    cursor: "pointer",
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
    padding: "10px 15px",
  },
};

export default SchoolPost;
