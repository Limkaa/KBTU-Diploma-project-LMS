import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import { toasty } from "../shared/Toast";
import { useLocation, useParams } from "react-router-dom";
import {
  useAddSyllabusPointMutation,
  useDeleteSyllabusPointMutation,
  useLazyGetCourseSyllabusQuery,
  useUpdateSyllabusPointMutation,
} from "../../redux/syllabus/syllabusApiSlice";
import SyllabusCreate from "./SyllabusCreate";
import SyllabusUpdate from "./SyllabusUpdate";
import SyllabusDelete from "./SyllabusDelete";

const SyllabusContainer = () => {
  const location = useLocation();
  let courseId = location?.state?.courseId;
  const { data: user } = useGetAuthUserQuery();
  const [selectedSyllabus, setSelectedSyllabus] = React.useState();
  const [showAddSyllabus, setShowAddSyllabus] = React.useState(false);
  const [showUpdateSyllabus, setShowUpdateSyllabus] = React.useState(false);
  const [showDeleteSyllabus, setShowDeleteSyllabus] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [syllabus, setSyllabus] = React.useState();

  const [getSyllabus, { data: dataSyllabus, isLoading: isLoadingSyllabus }] =
    useLazyGetCourseSyllabusQuery();

  const [addSyllabus] = useAddSyllabusPointMutation();
  const [updateSyllabus] = useUpdateSyllabusPointMutation();
  const [deleteSyllabus] = useDeleteSyllabusPointMutation();

  React.useEffect(() => {
    if (courseId) {
      getSyllabus({ course_id: courseId, search });
    }
  }, [courseId, search]);

  React.useEffect(() => {
    if (dataSyllabus && !isLoadingSyllabus) {
      setSyllabus(dataSyllabus);
    }
  }, [dataSyllabus, isLoadingSyllabus]);

  const handleAddSyllabus = async (values, hours, isCompleted) => {
    try {
      await addSyllabus({
        course_id: courseId,
        name: values.name,
        description: values.description,
        hours: hours,
        is_completed: isCompleted,
      })
        .unwrap()
        .then((payload) => {
          getSyllabus({ course_id: courseId, search });
          toasty({ type: "success", text: "Syllabus Point Created" });
        });
    } catch (err) {
      console.log(err);
      toasty();
    }
  };

  const handleUpdateSyllabus = async (values, hours) => {
    setShowUpdateSyllabus(false);
    try {
      await updateSyllabus({
        syllabus_id: selectedSyllabus?.id,
        name: values.name,
        description: values.description,
        hours: hours,
        is_completed: values.is_completed,
      })
        .unwrap()
        .then((payload) => {
          getSyllabus({ course_id: courseId, search });
          toasty({ type: "success", text: "Syllabus Point Updated" });
        });
    } catch (err) {
      console.log(err);
      toasty();
    }
  };

  const handleDeleteSyllabus = async () => {
    setShowDeleteSyllabus(false);
    try {
      await deleteSyllabus({
        syllabus_id: selectedSyllabus?.id,
      })
        .unwrap()
        .then((payload) => {
          getSyllabus({ course_id: courseId, search });
          toasty({ type: "success", text: "Syllabus Point Deleted" });
        });
    } catch (err) {
      console.log(err);
      toasty();
    }
  };

  const columnsForTeacher = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "20%",
      render: (item) => <div>{item?.name}</div>,
    },
    {
      title: () => {
        return <>Description</>;
      },
      width: "25%",
      render: (item) => <div>{item?.description}</div>,
    },
    {
      title: () => {
        return <>Hours</>;
      },
      width: "10%",
      render: (item) => <div>{item?.hours}</div>,
    },
    {
      title: () => {
        return <>Status</>;
      },
      width: "15%",
      render: (item) => (
        <div
          style={{
            ...styles.status,
            color: item.is_completed ? "#45B764" : "#969696",
          }}
        >
          {item.is_completed ? "Completed" : "Not yet"}
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
              setSelectedSyllabus(record);
              setShowUpdateSyllabus(true);
            }}
          >
            Change
          </Button>
          <Button
            style={{ color: "#F18D58", fontWeight: 500 }}
            type={"link"}
            onClick={() => {
              setSelectedSyllabus(record);
              setShowDeleteSyllabus(true);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "20%",
      render: (item) => <div>{item?.name}</div>,
    },
    {
      title: () => {
        return <>Description</>;
      },
      width: "25%",
      render: (item) => <div>{item?.description}</div>,
    },
    {
      title: () => {
        return <>Hours</>;
      },
      width: "10%",
      render: (item) => <div>{item?.hours}</div>,
    },
    {
      title: () => {
        return <>Status</>;
      },
      width: "15%",
      render: (item) => (
        <div
          style={{
            ...styles.status,
            color: item.is_completed ? "#45B764" : "#969696",
          }}
        >
          {item.is_completed ? "Completed" : "Not yet"}
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Syllabus"} />
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
            {user?.role === "teacher" && (
              <Button
                type="primary"
                style={styles.btnAdd}
                icon={<img src={Plus} style={{ paddingRight: 5 }} />}
                onClick={() => setShowAddSyllabus(true)}
              >
                Create syllabus point
              </Button>
            )}
          </div>
        </div>
        <Table
          dataSource={syllabus}
          columns={user?.role === "teacher" ? columnsForTeacher : columns}
          rowKey={(item) => item?.id}
          pagination={false}
        />
      </div>
      <SyllabusCreate
        showAddSyllabus={showAddSyllabus}
        setShowAddSyllabus={setShowAddSyllabus}
        handleAddSyllabus={handleAddSyllabus}
      />
      <SyllabusUpdate
        showUpdateSyllabus={showUpdateSyllabus}
        setShowUpdateSyllabus={setShowUpdateSyllabus}
        syllabus={selectedSyllabus}
        setSyllabus={setSelectedSyllabus}
        handleUpdateSyllabus={handleUpdateSyllabus}
      />
      <SyllabusDelete
        showDeleteSyllabus={showDeleteSyllabus}
        setShowDeleteSyllabus={setShowDeleteSyllabus}
        handleDeleteSyllabus={handleDeleteSyllabus}
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
  status: {
    fontWeight: 600,
    fontSize: 14,
  },
};

export default SyllabusContainer;
