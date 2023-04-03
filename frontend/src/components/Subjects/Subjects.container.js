import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import { useGetSubjectsQuery } from "../../redux/subjects/subjectsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";

import UpdateSubjects from "./UpdateSubjects";
const SubjectsContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [subjects, setSubjects] = React.useState();
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

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setSubjects(data.results);
    }
  }, [data, isLoading]);
  //   const handleUpdateGrade = async (grade, values) => {
  //     setShowUpdateSubject(false);
  //     console.log("selectedGrade", grade, values.name);
  //     try {
  //       const updateGrades = await updateGrade({
  //         grade_id: grade?.id,
  //         name: values.name,
  //         is_active: values.is_active,
  //       })
  //         .unwrap()
  //         .then((payload) => {
  //           refetch();
  //           toast.success("User Updated", {
  //             position: "top-right",
  //             autoClose: 2000,
  //             hideProgressBar: false,
  //             closeOnClick: false,
  //             pauseOnHover: true,
  //             draggable: false,
  //             theme: "colored",
  //           });
  //         });
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("Error", {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: false,
  //         theme: "colored",
  //       });
  //     }
  //   };

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
          onRow={(record) => {
            return {
              onClick: () => {
                // setShowBusket(true);
                // setSale(record);
              },
            };
          }}
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
        // handleUpdateSubject={handleUpdateSubject}
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
    border: "1px solid #0000000D"
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
