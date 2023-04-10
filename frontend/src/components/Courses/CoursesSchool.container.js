import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import { toasty } from "../shared/Toast";
import {
  useAddCourseMutation,
  useGetSchoolCoursesQuery,
} from "../../redux/courses/coursesApiSlice";
import CoursesSchoolAdd from "./CoursesSchoolAdd";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetSubjectsWithoutPageQuery } from "../../redux/subjects/subjectsApiSlice";
import { useGetTeachersQuery } from "../../redux/users/usersApiSlice";
import { useGetSchoolGroupsQuery } from "../../redux/groups/groupsApiSlice";

const CoursesSchoolContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [courses, setCourses] = React.useState();
  const [groups, setGroups] = React.useState();
  const [years, setYears] = React.useState();
  const [subjects, setSubjects] = React.useState();
  const [teachers, setTeachers] = React.useState();

  const [search, setSearch] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState();
  const [showAddCourse, setShowAddCourse] = React.useState(false);
  const [showUpdateSubject, setShowUpdateSubject] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetSchoolCoursesQuery({
    school_id: user?.school_id,
    page,
  });

  const [createCourse] = useAddCourseMutation();

  const { data: dataGroups, isLoading: isLoadingGroups } =
    useGetSchoolGroupsQuery({
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

  const handleAddCourse = () => {};

  const columns = [
    {
      width: "1%",
      render: (item) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={
              item?.is_active
                ? require("../../assets/icons/active.png")
                : require("../../assets/icons/inactive.png")
            }
            style={{ width: 16, height: 16 }}
          />
        </div>
      ),
    },
    {
      title: () => {
        return <>Subject</>;
      },
      width: "20%",
      render: (item) => (
        <div>
          {item?.subject?.name} ({item?.subject?.code})
        </div>
      ),
    },
    {
      title: () => {
        return <>Teacher</>;
      },
      width: "20%",
      render: (item) => (
        <div>
          {item?.teacher?.last_name} {item?.teacher?.first_name}
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
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            style={{ color: "#00899E", fontWeight: 500 }}
            type={"link"}
            onClick={() => {
              //   setSelectedSubject(record);
              //   setShowUpdateSubject(true);
            }}
          >
            Change
          </Button>
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
              //   onClick={() => setShowAddSubject(true)}
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
      {/* <UpdateSubjects
        subject={selectedSubject}
        setSubject={setSelectedSubject}
        showUpdateSubject={showUpdateSubject}
        setShowUpdateSubject={setShowUpdateSubject}
        grades={grades}
        handleUpdateSubject={handleUpdateSubject}
      />*/}
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
