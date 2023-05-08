import React, { useEffect, useState } from "react";
import "./GroupsPage.css";
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import { useGetGroupsQuery } from "../../redux/groups/groupsApiSlice";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { Table, Spin, Tag, Button, Input, Space, Radio, Select } from "antd";
import Plus from "../../assets/icons/plus.svg";
import Search from "../../assets/icons/search.svg";
import { useGetTeachersQuery } from "../../redux/users/usersApiSlice";
import CreateGroupModal from "./CreateGroupModal";
import UpdateGroupModal from "./UpdateGroupModal";
import { Link } from "react-router-dom";

const GroupsPage = () => {
  const user = useSelector(selectCurrentUser);
  const [groupType, setGroupType] = useState("school");
  const [grade, setGrade] = useState();
  const [teacher, setTeacher] = useState();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const {
    data: groupsData,
    isLoading,
    refetch,
  } = useGetGroupsQuery({
    groupType,
    school_id: user?.school_id,
    grade_id: grade,
    teacher_id: teacher,
    page,
    search
  });
  const { data: grades, isSuccess: isGradesLoaded } =
    useGetSchoolGradesWithoutPageQuery({ school_id: user?.school_id });
  const { data: teachers, isSuccess: isTeachersLoaded } = useGetTeachersQuery(
    user?.school_id
  );
  const [groups, setGroups] = useState();
  const [gradesOptions, setGradesOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [total, setTotal] = useState();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState();

  useEffect(() => {
    if (groupsData && !isLoading) {
      if (page === 1) setTotal(groupsData?.count);
      setGroups(groupsData?.results);
    }
  }, [groupsData, isLoading, page]);

  useEffect(() => {
    let arr = [];
    if (isGradesLoaded) {
      grades?.forEach((grade) => {
        arr.push({ value: grade.id, label: grade.name });
      });
      setGradesOptions(arr);
      setGrade(arr[0].value);
    }
  }, [isGradesLoaded, grades]);

  useEffect(() => {
    let arr = [];
    if (isTeachersLoaded) {
      teachers.forEach((user) => {
        arr.push({
          value: user.id,
          label: `${user.first_name} ${user.last_name}`,
        });
      });
      setTeacherOptions(arr);
      setTeacher(arr[0].value);
    }
  }, [isTeachersLoaded, teachers]);

  const handleGroupTypeChange = (e) => {
    let value = e.target.value;
    setGroupType(value);
    if (value === "school") {
      setGroupType(value);
    } else if (value === "teacher") {
      setTeacherOptions(teacherOptions);
    } else if (value === "grade") {
      setGradesOptions(gradesOptions);
    }
  };

  const handleSelectChange = (value) => {
    if (groupType === "grade") {
      setGrade(value);
    } else if (groupType === "teacher") {
      setTeacher(value);
    }
  };

  const columns = [
    {
      title: "Code",
      width: "15%",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Grade",
      width: "15%",
      render: (group) => <span>{group?.grade?.name}</span>,
    },
    {
      title: "Teacher",
      width: "15%",
      render: (group) => (
        <span>
          {group?.teacher?.first_name} {group?.teacher?.last_name}
        </span>
      ),
    },
    {
      title: "Status",
      width: "15%",
      render: (group) => (
        <Tag
          style={{ minWidth: 70, textAlign: "center" }}
          color={group?.is_active ? "green" : "volcano"}
        >
          {group?.is_active ? "active" : "inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <a
            className="action"
            style={{ color: "#00899E", fontWeight: 500, padding: 0 }}
            type={"link"}
            onClick={() => {
              setSelectedGroup(record);
              setShowUpdateGroupModal(true);
            }}
          >
            Change
          </a>
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
            style={{ color: "#45B764", fontWeight: 500, padding: 0 }}
            to={`${record.id}/students`}
          >
            Students
          </Link>
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
    <main className="groups">
      <header className="header">
        <Header text={"Groups"} />
        <Profile />
      </header>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <div style={{ marginRight: "auto", display: "flex", alignItems: "center" }}>
            <Radio.Group
              style={{ marginRight: 10 }}
              value={groupType}
              onChange={handleGroupTypeChange}
            >
              <Radio.Button value="school">School</Radio.Button>
              <Radio.Button value="teacher">Teacher</Radio.Button>
              <Radio.Button value="grade">Grade</Radio.Button>
            </Radio.Group>
            {groupType === "school" && (
              <Select
                style={{ width: 200 }}
                placeholder="Not required"
                disabled={true}
              />
            )}
            {groupType === "teacher" && (
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                onChange={handleSelectChange}
                options={teacherOptions}
                defaultValue={teacherOptions[0]}
                value={teacher}
              />
            )}
            {groupType === "grade" && (
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Search to Select"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                onChange={handleSelectChange}
                options={gradesOptions}
                defaultValue={gradesOptions[0]}
                value={grade}
              />
            )}
          </div>
          <div style={{ alignItems: "center", display: "flex" }}>
            <Input
              placeholder="Search code"
              prefix={
                <img alt="" src={Search} style={{ height: 15, width: 15 }} />
              }
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
            <Button
              type="primary"
              style={{
                alignItems: "center",
                display: "flex",
                fontWeight: 500,
                marginLeft: 16,
              }}
              icon={<img alt="" src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowCreateGroupModal(true)}
            >
              Add group
            </Button>
          </div>
        </div>
        <Spin spinning={isLoading}>
          <Table
            dataSource={groups}
            columns={columns}
            rowKey={(item) => item?.id}
            pagination={{
              total: total,
              current: page,
              onChange: (page) => {
                setPage(page);
                window.scrollTo(0, 0);
              },
              showSizeChanger: false,
            }}
          />
        </Spin>
      </div>
      <CreateGroupModal
        setShow={setShowCreateGroupModal}
        show={showCreateGroupModal}
        refetch={refetch}
      />
      <UpdateGroupModal
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        setShow={setShowUpdateGroupModal}
        show={showUpdateGroupModal}
        refetch={refetch}
      />
    </main>
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
    marginBottom: 20,
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
};

export default GroupsPage;
