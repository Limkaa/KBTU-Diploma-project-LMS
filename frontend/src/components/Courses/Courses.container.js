import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import {
  useLazyGetGroupCoursesQuery,
  useLazyGetTeacherCoursesQuery,
} from "../../redux/courses/coursesApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled as styledmui } from "@mui/material/styles";
import { Link } from "react-router-dom";
import CourseLogo from "../shared/CourseLogo";
import { useGetStudentCardQuery } from "../../redux/studentsCards/studentsCardsApiSlice";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Input, Empty, Spin } from "antd";
import Search from "../../assets/icons/search.svg";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import styled from "styled-components";

const Item = styledmui(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  fontFamily: "Open Sans",
  fontSize: 18,
  fontWeight: 500,
  padding: theme.spacing(2),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  height: 180,
  color: "black",
  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.12)",
}));

const InputStyled = styled(Input)`
  &.ant-input-affix-wrapper .ant-input {
    background-color: #fafafa;
    border-radius: 10px;
  }
  &.ant-input-affix-wrapper {
    background-color: #fafafa;
    height: 40px;
    width: 280px;
    border: 1px solid #c0c0c0;
    border-radius: 10px;
    background-color: #fafafa;
    margin-right: 15px;
  }
`;

const CoursesContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [courses, setCourses] = React.useState();
  const [selectedYear, setSelectedYear] = React.useState("");
  const [years, setYears] = React.useState();
  const [search, setSearch] = React.useState("");

  const { data: student } = useGetStudentCardQuery({
    student_id: user?.id,
  });

  const [getGroupCourse, { data, isLoading, refetch }] =
    useLazyGetGroupCoursesQuery();

  const [
    getTeacherCourses,
    { data: teacherData, isLoading: teacherIsLoading },
  ] = useLazyGetTeacherCoursesQuery();

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  React.useEffect(() => {
    if (dataYears && !isLoadingYears) {
      setYears(dataYears);
      setSelectedYear(dataYears[dataYears.length - 1].id);
    }
  }, [dataYears, isLoadingYears]);

  React.useEffect(() => {
    if (user?.role === "student") {
      if (student) {
        getGroupCourse({
          group_id: student?.group?.id,
          subject__grade: student?.group?.grade?.id,
          search: search,
        });
      }
    } else if (user?.role === "teacher") {
      getTeacherCourses({
        teacher_id: user?.id,
        search: search,
      });
    }
  }, [user, student, selectedYear, search]);

  React.useEffect(() => {
    if (user?.role === "student") {
      if (data && !isLoading) {
        setCourses(data);
      }
    } else if (user?.role === "teacher") {
      if (teacherData && !teacherIsLoading) {
        setCourses(teacherData);
      }
    }
  }, [data, isLoading, teacherData, teacherIsLoading]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Courses"} />
        <Profile />
      </div>
      <Box sx={{ flexGrow: 1, marginTop: 3 }}>
        <div style={{ marginBottom: 18 }}>
          <InputStyled
            size="default size"
            placeholder="Search..."
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <Spin
          spinning={user?.role === "student" ? isLoading : teacherIsLoading}
          size="large"
        >
          <Grid
            container
            spacing={{ xs: 3, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 15 }}
          >
            {courses?.length > 0 ? (
              courses?.map((item) => (
                <Grid item xs={6} sm={8} md={3} key={item.id}>
                  <Link
                    to={`/courses/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Item>
                      <CourseLogo
                        title={item?.subject?.name}
                        width={"43%"}
                        height={"60%"}
                        fontSize={30}
                      />
                      <div style={styles.title}>{item?.subject?.name}</div>
                      <div style={styles.code}>{item?.subject?.code}</div>
                      <div style={styles.podtext}>
                        {item?.subject?.grade?.name}
                        {" (" + item?.group?.code + ")"}
                      </div>
                      <div style={styles.teacher}>
                        <div style={styles.teachTitle}>Teacher:</div>
                        {item?.teacher ? (
                          <div style={styles.teacher_name}>
                            {item?.teacher?.first_name}{" "}
                            {item?.teacher?.last_name}
                          </div>
                        ) : (
                          <div style={styles.teacher_name}>-</div>
                        )}
                      </div>
                    </Item>
                  </Link>
                </Grid>
              ))
            ) : (
              <div style={{ width: "100%", marginTop: 40 }}>
                <Empty />
              </div>
            )}
          </Grid>
        </Spin>
      </Box>
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
  courseCont: {
    backgroundColor: "white",
  },
  coursesCont: {
    display: "flex",
  },
  teacher_name: {
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(74, 77, 88, 1)",
  },
  teacher: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  teachTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(74, 77, 88, 1)",
  },
  title: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 600,
    color: "rgba(74, 77, 88, 1)",
  },
  code: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(0, 136, 157, 1)",
  },
  podtext: {
    fontSize: 14,
    fontWeight: 500,
    color: "#4A4D5896",
  },
};

export default CoursesContainer;
