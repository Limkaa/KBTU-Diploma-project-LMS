import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import active from "../../assets/icons/active.svg";
import inactive from "../../assets/icons/inactive.svg";

import {
  useAddSchoolGradeMutation,
  useGetSchoolGradesQuery,
  useUpdateSchoolGradeMutation,
} from "../../redux/schoolGrades/schoolGradesApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import AddSchoolGrade from "./AddSchoolGrade";
import { toast } from "react-toastify";
import UpdateSchoolGrade from "./UpdateSchoolGrade";

const SchoolGradesContainer = () => {
  const user = useSelector(selectCurrentUser);
  const [grades, setGrades] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedGrade, setSelectedGrade] = React.useState();
  const [showAddSchoolGrade, setShowAddSchoolGrade] = React.useState(false);
  const [showUpdateSchoolGrade, setShowUpdateSchoolGrade] =
    React.useState(false);

  const { data, isLoading, refetch } = useGetSchoolGradesQuery({
    school_id: user?.school_id,
  });

  const [createGrade] = useAddSchoolGradeMutation();
  const [updateGrade] = useUpdateSchoolGradeMutation();

  React.useEffect(() => {
    if (data && !isLoading) {
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
        const createGrades = await createGrade({
          school_id: user?.school_id,
          name: values.name,
          is_active: true,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toast.success("User Updated", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: false,
              theme: "colored",
            });
          });
      } catch (err) {
        console.log(err);
        toast.error("Error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          theme: "colored",
        });
      }
    }
  };

  const handleUpdateGrade = async (grade, values) => {
    setShowUpdateSchoolGrade(false);
    console.log("selectedGrade", grade, values.name);
    try {
      const updateGrades = await updateGrade({
        grade_id: grade?.id,
        name: values.name,
        is_active: values.is_active,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          toast.success("User Updated", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
          });
        });
    } catch (err) {
      console.log(err);
      toast.error("Error", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        theme: "colored",
      });
    }
  };

  const columns = [
    {
      width: "1%",
      render: (item) => (
        <div style={{ display: "flex", alignItems:'center', justifyContent: 'center' }}>
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
      width: "60%",
      render: (item) => <div>{item.name}</div>,
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
          onRow={(record) => {
            return {
              onClick: () => {
                // setShowBusket(true);
                // setSale(record);
              },
            };
          }}
          pagination={false}
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
    borderBottom: "none",
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
