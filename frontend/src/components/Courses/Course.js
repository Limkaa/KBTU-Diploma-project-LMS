import React from "react";
import { useParams } from "react-router-dom";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import CourseLogo from "../shared/CourseLogo";
import { Spin } from "antd";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  flexDirection: "column",
  color: "black",
  border: "none",
  boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.12)",
}));

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
        <Box sx={{ flexGrow: 1, marginTop: 3 }}>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={10} sm={9} md={7}>
              <Item>
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
            </Grid>
            <Grid item xs={10} sm={9} md={5}>
              <Item>
                <div>
                  <div>Assignments</div>
                </div>
              </Item>
            </Grid>
          </Grid>
        </Box>
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
    borderRadius: 10,
  },
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
};

export default Course;
