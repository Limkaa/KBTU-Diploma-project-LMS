import { Button } from "antd";
import React from "react";
import EditSvg from "../../assets/icons/Edit";
import { useGetCoursePostCommentsQuery } from "../../redux/coursePosts/comments/commentsApiSlice";
import moment from "moment-timezone";

const CoursePost = ({ setIsPost, isPost, item }) => {
  const [comments, setComments] = React.useState([]);
  const { data: dataComments, isLoading: isLoadingComments } =
    useGetCoursePostCommentsQuery({ post_id: item.id });

  React.useEffect(() => {
    if (dataComments && !isLoadingComments) {
      console.log(dataComments);
      setComments(dataComments);
    }
  }, [dataComments, isLoadingComments]);
  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          borderBottom: item?.text ? "1px solid rgba(0, 0, 0, 0.1)" : "none",
          alignItems: "center",
        }}
      >
        <div style={styles.title}>{item?.title}</div>
        <div style={styles.day}>
          {moment(item?.created_at).format("MMM DD, YYYY HH:mm")}
        </div>
      </div>

      {item?.text && <div style={styles.text}>{item?.text}</div>}
      {comments?.length > 0 && (
        <div style={styles.commentsCont}>
          {comments.map((item) => (
            <div style={styles.comment}>
              <img style={styles.avatar} />
              <div style={styles.rightCont}>
                <div style={styles.userInfo}>
                  <div style={styles.name}>
                    {item?.user?.first_name} {item?.user?.last_name}
                  </div>
                  <div style={styles.day}>
                    {moment(item?.created_at).format("MMM DD, YYYY HH:mm")}
                  </div>
                </div>
                <div key={item.id}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}
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
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    padding: 10,

    color: "#4A4D58",
  },
  text: {
    padding: "5px 10px 10px 10px",
    color: "rgba(92, 92, 92, 1)",
    fontWeight: 400,
    fontSize: 15,
  },
  commentsCont: {
    backgroundColor: "rgba(248, 249, 250, 1)",
    padding: "12px 12px 4px 12px",
    borderRadius: 12,
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
};

export default CoursePost;
