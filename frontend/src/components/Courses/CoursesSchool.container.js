import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import { Table, Input, Button, Space, Tag } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import {
  useAddCourseMutation,
  useGetSchoolCoursesQuery,
  useUpdateCourseMutation,
} from "../../redux/courses/coursesApiSlice";
import CoursesSchoolAdd from "./CoursesSchoolAdd";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetSubjectsWithoutPageQuery } from "../../redux/subjects/subjectsApiSlice";
import { useGetTeachersQuery } from "../../redux/users/usersApiSlice";
import { useGetGroupsQuery } from "../../redux/groups/groupsApiSlice";
import CoursesSchoolUpdate from "./CoursesSchoolUpdate";
import { Link, useNavigate } from "react-router-dom";
import { toastify } from "../shared/Toast/Toast";

const CoursesSchoolContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [courses, setCourses] = React.useState();
  const [groups, setGroups] = React.useState();
  const [years, setYears] = React.useState();
  const [subjects, setSubjects] = React.useState();
  const [teachers, setTeachers] = React.useState();
  const navigate = useNavigate();

  const [search, setSearch] = React.useState("");
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [showAddCourse, setShowAddCourse] = React.useState(false);
  const [showUpdateCourse, setShowUpdateCourse] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetSchoolCoursesQuery({
    school_id: user?.school_id,
    page,
  });

  const [createCourse] = useAddCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  const { data: dataGroups, isLoading: isLoadingGroups } = useGetGroupsQuery({
    school_id: user?.school_id,
  });

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  const { data: dataSubjects, isLoading: isLoadingSubjects } =
    useGetSubjectsWithoutPageQuery({
      school_id: user?.school_id,
    });

  const { data: dataTeachers, isLoading: isLoadingTeachers } =
    useGetTeachersQuery({
      school_id: user?.school_id,
    });

  React.useEffect(() => {
    if (dataGroups && !isLoadingGroups) {
      setGroups(dataGroups.filter((el) => el.is_active));
    }
  }, [dataGroups, isLoadingGroups]);

  React.useEffect(() => {
    if (dataYears && !isLoadingYears) {
      setYears(dataYears.filter((el) => el.is_active));
    }
  }, [dataYears, isLoadingYears]);

  React.useEffect(() => {
    if (dataSubjects && !isLoadingSubjects) {
      setSubjects(dataSubjects.filter((el) => el.is_active));
    }
  }, [dataSubjects, isLoadingSubjects]);

  React.useEffect(() => {
    if (dataTeachers && !isLoadingTeachers) {
      setTeachers(dataTeachers);
    }
  }, [dataTeachers, isLoadingTeachers]);

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setCourses(data.results);
    }
  }, [data, isLoading]);

  const handleAddCourse = async (values, isActive) => {
    if (user) {
      try {
        await createCourse({
          school_id: user?.school_id,
          year: values.year,
          subject: values.subject,
          teacher: values.teacher,
          group: values.group,
          is_active: isActive,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toastify("success", "Course Created");
          });
      } catch (err) {
        console.log(err);
        let message = err.data.detail?.non_field_errors[0] ?? "Error";
        toastify("error", message);
      }
    }
  };

  const handleUpdateCourse = async (isActive, teacherId) => {
    if (user) {
      try {
        await updateCourse({
          course_id: selectedCourse.id,
          teacher: teacherId,
          is_active: isActive,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toastify("success", "Course Updated");
          });
      } catch (err) {
        console.log(err);
        let message = err.data.detail?.non_field_errors[0] ?? "Error";
        toastify("error", message);
      }
    }
    setShowUpdateCourse(false);
  };

  const columns = [
    // {
    //   width: "1%",
    //   render: (item) => (
    //     <div
    //       style={{
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center",
    //       }}
    //     >
    //       <img
    //         src={
    //           item?.is_active
    //             ? require("../../assets/icons/active.png")
    //             : require("../../assets/icons/inactive.png")
    //         }
    //         style={{ width: 16, height: 16 }}
    //       />
    //     </div>
    //   ),
    // },
    {
      title: () => {
        return <>Subject</>;
      },
      width: "20%",
      render: (item) => (
        <Link
          to={`/courses/${item.id}`}
          style={{ textDecoration: "none", fontWeight: 600, color: "#00889D" }}
        >
          {item?.subject?.name} ({item?.subject?.code})
        </Link>
      ),
    },
    {
      title: () => {
        return <>Teacher</>;
      },
      width: "20%",
      render: (item) => (
        <div>
          {item?.teacher?.first_name} {item?.teacher?.last_name}
        </div>
      ),
    },
    {
      title: () => {
        return <>Year</>;
      },
      width: "15%",
      render: (item) => <div>{item?.year?.name}</div>,
    },
    {
      title: () => {
        return <>Group</>;
      },
      width: "15%",
      render: (item) => (
        <div>
          {item?.group?.grade?.name} ({item?.group?.code})
        </div>
      ),
    },
    {
      title: "Status",
      width: "15%",
      render: (item) => (
        <Tag
          style={{ minWidth: 70, textAlign: "center" }}
          color={item.is_active ? "green" : "volcano"}
        >
          {item.is_active ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ color: "#00899E", fontWeight: 500 }}
            type={"link"}
            onClick={() => {
              setSelectedCourse(record);
              setShowUpdateCourse(true);
            }}
          >
            Change
          </Button>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
          <Space size="middle">
            <Link
                className="action"
                style={{ color: "#F18D58", fontWeight: 500, padding: 0 }}
                to={`${record.id}/timetable`}
            >
              Schedule
            </Link>
          </Space>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Courses"} />
        <Profile />
      </div>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <div style={{ alignItems: "center", display: "flex" }}>
            <Input
              size="default size"
              placeholder="Search..."
              prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
              style={styles.search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <Button
              type="primary"
              style={styles.btnAdd}
              icon={<img src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowAddCourse(true)}
            >
              Create course
            </Button>
          </div>
        </div>
        <Table
          dataSource={courses}
          columns={columns}
          rowKey={(item) => item?.id}
          pagination={{
            total: total,
            current: page,
            onChange: (page) => {
              setPage(page);
            },
            showSizeChanger: false,
          }}
        />
      </div>
      <CoursesSchoolUpdate
        course={selectedCourse}
        showUpdateCourse={showUpdateCourse}
        setShowUpdateCourse={setShowUpdateCourse}
        teachers={teachers}
        handleUpdateCourse={handleUpdateCourse}
      />
      <CoursesSchoolAdd
        showAddCourse={showAddCourse}
        setShowAddCourse={setShowAddCourse}
        handleAddCourse={handleAddCourse}
        years={years}
        groups={groups}
        teachers={teachers}
        subjects={subjects}
      />
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
  tableCont: {
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  btnAdd: {
    backgroundColor: "#163A61",
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
    marginLeft: 16,
  },
  search: {
    height: 40,
    width: 280,
    border: "none",
    borderRadius: 8,
  },
};

export default CoursesSchoolContainer;
