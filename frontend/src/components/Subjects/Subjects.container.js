import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { toast } from "react-toastify";
import {
  useAddSubjectMutation,
  useGetSubjectsQuery,
  useUpdateSubjectMutation,
} from "../../redux/subjects/subjectsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import UpdateSubjects from "./UpdateSubjects";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import AddSubject from "./AddSubject";
import { toasty } from "../shared/Toast";

const SubjectsContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [subjects, setSubjects] = React.useState();
  const [grades, setGrades] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState();
  const [showAddSubject, setShowAddSubject] = React.useState(false);
  const [showUpdateSubject, setShowUpdateSubject] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetSubjectsQuery({
    school_id: user?.school_id,
    page,
  });

  const [addSubject] = useAddSubjectMutation();

  const [updateSubject] = useUpdateSubjectMutation();

  const { data: dataGrades, isLoading: isLoadingGrades } =
    useGetSchoolGradesWithoutPageQuery({
      school_id: user?.school_id,
      page,
    });

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setSubjects(data.results);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    if (dataGrades && !isLoadingGrades) {
      setGrades(dataGrades.filter((el) => el.is_active));
    }
  }, [dataGrades, isLoadingGrades]);

  const handleAddSubject = async (values) => {
    if (user) {
      try {
        await addSubject({
          school: user?.school_id,
          name: values.name,
          code: values.code,
          description: values.description,
          grade: values.grade,
          is_active: true,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toasty({ type: "success", text: "Subject Created" });
          });
      } catch (err) {
        console.log(err);
        toasty();
      }
    }
  };

  const handleUpdateSubject = async (values) => {
    setShowUpdateSubject(false);
    if (user) {
      try {
        const updateSubjects = await updateSubject({
          subject_id: selectedSubject?.id,
          school: user?.school_id,
          name: values.name,
          code: values.code.toUpperCase(),
          description: values.description,
          grade: values.grade,
          is_active: values.is_active,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toasty({ type: "success", text: "Subject Updated" });
          });
      } catch (err) {
        toasty();
      }
    }
  };

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
        return <>Name</>;
      },
      width: "20%",
      render: (item) => <div>{item.name}</div>,
    },
    {
      title: () => {
        return <>Code</>;
      },
      width: "20%",
      render: (item) => <div>{item.code}</div>,
    },
    {
      title: () => {
        return <>Grade</>;
      },
      width: "20%",
      render: (item) => <div>{item.grade.name}</div>,
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
              setSelectedSubject(record);
              setShowUpdateSubject(true);
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
        <Header text={"Subjects"} />
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
              onClick={() => setShowAddSubject(true)}
            >
              Add subject
            </Button>
          </div>
        </div>
        <Table
          dataSource={subjects}
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
      <UpdateSubjects
        subject={selectedSubject}
        setSubject={setSelectedSubject}
        showUpdateSubject={showUpdateSubject}
        setShowUpdateSubject={setShowUpdateSubject}
        grades={grades}
        handleUpdateSubject={handleUpdateSubject}
      />
      <AddSubject
        showAddSubject={showAddSubject}
        setShowAddSubject={setShowAddSubject}
        grades={grades}
        handleAddSubject={handleAddSubject}
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

export default SubjectsContainer;
