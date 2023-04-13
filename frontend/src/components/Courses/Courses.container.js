import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { useGetSchoolCoursesQuery } from "../../redux/courses/coursesApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import CourseLogo from "../shared/CourseLogo";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  fontSize: 18,
  fontWeight: 500,
  padding: theme.spacing(2),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  height: 170,
  color: "black",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.12)",
}));

const CoursesContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [courses, setCourses] = React.useState();
  const { data, isLoading, refetch } = useGetSchoolCoursesQuery({
    school_id: user?.school_id,
    page: 1,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourses(data.results);
    }
  }, [data, isLoading]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Courses"} />
        <Profile />
      </div>

      <Box sx={{ flexGrow: 1, marginTop: 5 }}>
        <Grid
          container
          spacing={{ xs: 3, md: 3 }}
          columns={{ xs: 4, sm: 10, md: 15 }}
        >
          {courses?.map((item) => (
            <Grid item xs={2} sm={4} md={2.5} key={item.id}>
              <Link
                to={`/courses/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Item>
                  <CourseLogo
                    title={item?.subject?.name}
                    width={"40%"}
                    height={"50%"}
                    fontSize={30}
                  />
                  <div>{item?.subject?.name}</div>
                  <div style={styles.teacher}>
                    <div style={styles.teachTitle}>Teacher:</div>
                    {item?.teacher ? (
                      <div style={styles.teacher_name}>
                        {item?.teacher?.first_name} {item?.teacher?.last_name}
                      </div>
                    ) : (
                      <div style={styles.teacher_name}>-</div>
                    )}
                  </div>
                </Item>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
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
  search: {
    height: 40,
    width: 280,
    border: "none",
    borderRadius: 8,
  },
  courseCont: {
    backgroundColor: "white",
  },
  coursesCont: {
    display: "flex",
  },
  teacher_name: {
    fontSize: 14,
    fontWeight: 500,
  },
  letter: {
    width: "40%",
    height: "50%",
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 500,
    borderRadius: 10,
    color: "black",
    marginBottom: 15,
  },
  teacher: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 6,
  },
  teachTitle: {
    fontSize: 14,
    fontWeight: 600,
  },
};

export default CoursesContainer;
