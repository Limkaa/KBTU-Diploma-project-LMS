import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import { Table, Input, Button, Space, Tag } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import {
  useAddSchoolGradeMutation,
  useGetSchoolGradesQuery,
  useUpdateSchoolGradeMutation,
} from "../../redux/schoolGrades/schoolGradesApiSlice";
import AddSchoolGrade from "./AddSchoolGrade";
import UpdateSchoolGrade from "./UpdateSchoolGrade";
import { toastify } from "../shared/Toast/Toast";

const SchoolGradesContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();

  const [grades, setGrades] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState();
  const [showAddSchoolGrade, setShowAddSchoolGrade] = React.useState(false);
  const [showUpdateSchoolGrade, setShowUpdateSchoolGrade] =
    React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetSchoolGradesQuery({
    school_id: user?.school_id,
    page,
  });

  const [createGrade] = useAddSchoolGradeMutation();
  const [updateGrade] = useUpdateSchoolGradeMutation();

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setGrades(data.results);
    }
  }, [data, isLoading]);

  const filteredUsers = () => {
    if (search) {
      return grades.filter((itm) => {
        return search !== "" && itm.name.toLowerCase().indexOf(search) > -1;
      });
    } else {
      return grades;
    }
  };

  const handleCreateGrade = async (values) => {
    setShowAddSchoolGrade(false);
    if (user) {
      try {
        await createGrade({
          school: user?.school_id,
          name: values.name,
          is_active: true,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toastify("success", "Grade Created");
          });
      } catch (err) {
        let message = err.data.detail?.non_field_errors[0] ?? "Error";
        toastify("error", message);
      }
    }
  };

  const handleUpdateGrade = async (grade, values) => {
    setShowUpdateSchoolGrade(false);
    try {
      await updateGrade({
        grade_id: grade?.id,
        school: user?.school_id,
        name: values.name,
        is_active: values.is_active,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          toastify("success", "Grade Updated");
        });
    } catch (err) {
      let message = err.data.detail?.non_field_errors[0] ?? "Error";
      toastify("error", message);
    }
  };

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "50%",
      render: (item) => <div>{item.name}</div>,
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
              setSelectedGrade(record);
              setShowUpdateSchoolGrade(true);
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
        <Header text={"Grades"} />
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
              onClick={() => setShowAddSchoolGrade(true)}
            >
              Add grade
            </Button>
          </div>
        </div>
        <Table
          dataSource={filteredUsers()}
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
      <AddSchoolGrade
        showAddSchoolGrade={showAddSchoolGrade}
        setShowAddSchoolGrade={setShowAddSchoolGrade}
        handleCreateGrade={handleCreateGrade}
      />
      <UpdateSchoolGrade
        grade={selectedGrade}
        setGrade={setSelectedGrade}
        showUpdateSchoolGrade={showUpdateSchoolGrade}
        setShowUpdateSchoolGrade={setShowUpdateSchoolGrade}
        handleUpdateGrade={handleUpdateGrade}
      />
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
export default SchoolGradesContainer;
