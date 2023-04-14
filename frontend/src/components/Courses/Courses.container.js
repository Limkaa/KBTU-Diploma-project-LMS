import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import {
  useLazyGetGroupCoursesQuery,
  useLazyGetTeacherCoursesQuery,
} from "../../redux/courses/coursesApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import CourseLogo from "../shared/CourseLogo";
import { useGetStudentCardQuery } from "../../redux/studentsCards/studentsCardsApiSlice";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Input, Empty } from "antd";
import Search from "../../assets/icons/search.svg";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";

const Item = styled(Paper)(({ theme }) => ({
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

const CoursesContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [courses, setCourses] = React.useState();
  const [selectedYear, setSelectedYear] = React.useState("");
  const [years, setYears] = React.useState();
  const [search, setSearch] = React.useState("");

  const { data: studentCard } = useGetStudentCardQuery({
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
      setYears(dataYears.filter((el) => el.is_active));
      setSelectedYear(
        dataYears.filter((el) => el.is_active)[dataYears.length - 1].id
      );
    }
  }, [dataYears, isLoadingYears]);

  React.useEffect(() => {
    if (user?.role === "student") {
      if (studentCard && selectedYear) {
        getGroupCourse({
          group_id: studentCard?.group?.id,
          year_id: selectedYear,
          search: search,
        });
      }
    } else if (user?.role === "teacher") {
      console.log(user?.id);
      getTeacherCourses({
        teacher_id: user?.id,
        year_id: selectedYear,
        search: search,
      });
    }
  }, [user, studentCard, selectedYear, search]);

  React.useEffect(() => {
    if (data && !isLoading) {
      setCourses(data);
    }
  }, [data, isLoading]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Courses"} />
        <Profile />
      </div>
      <Box sx={{ flexGrow: 1, marginTop: 3 }}>
        <div>
          <Input
            size="default size"
            placeholder="Search..."
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            style={styles.search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          <FormControl
            sx={{
              width: 220,
              marginBottom: 3,
              fieldset: { borderRadius: "10px" },
            }}
            size="small"
          >
            <InputLabel id="grade">Year</InputLabel>
            <Select
              labelId="grade"
              id="grade"
              label="Grade"
              defaultValue={""}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <MenuItem value="" disabled>
                <em>Choose year</em>
              </MenuItem>
              {years?.map((item) => (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
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
                      width={"40%"}
                      height={"60%"}
                      fontSize={30}
                    />
                    <div style={styles.title}>{item?.subject?.name}</div>
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
            ))
          ) : (
            <div style={{ width: "100%", marginTop: 40 }}>
              <Empty />
            </div>
          )}
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
    border: "1px solid #C0C0C0",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    marginRight: 15,
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
  title: {
    marginTop: 20,
  },
};

export default CoursesContainer;
