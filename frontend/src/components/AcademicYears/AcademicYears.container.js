import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import {
  useAddYearMutation,
  useGetYearsQuery,
  useUpdateYearMutation,
} from "../../redux/academicYears/academicYearsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import CreateYear from "./CreateYear";
import { toasty } from "../shared/Toast";
import UpdateYear from "./UpdateYear";

const AcademicYearsContainer = () => {
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();
  const [years, setYears] = React.useState();
  const [search, setSearch] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState();
  const [showAddYear, setShowAddYear] = React.useState(false);
  const [showUpdateYear, setShowUpdateYear] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();

  const { data, isLoading, refetch } = useGetYearsQuery({
    school_id: user?.school_id,
    page,
  });

  const [addYear] = useAddYearMutation();
  const [updateYear] = useUpdateYearMutation();


  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setYears(data.results);
    }
  }, [data, isLoading]);

  const handleAddYear = async (values) => {
    if (user) {
      try {
        await addYear({
          school: user?.school_id,
          name: values.name,
          is_active: true,
        })
          .unwrap()
          .then((payload) => {
            refetch();
            toasty({ type: "success", text: "Academic Year Created" });
          });
      } catch (err) {
        console.log(err);
        toasty();
      }
    }
  };

  const handleUpdateYear = async (values) => {
    setShowUpdateYear(false);
    try {
      await updateYear({
        year_id: selectedYear?.id,
        school: user?.school_id,
        name: values.name,
        is_active: values.is_active,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          toasty({ type: "success", text: "Year Updated" });
        });
    } catch (err) {
      toasty();
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
      width: "70%",
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
              setSelectedYear(record);
              setShowUpdateYear(true);
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
        <Header text={"Academic Years"} />
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
              onClick={() => setShowAddYear(true)}
            >
              Create Year
            </Button>
          </div>
        </div>
        <Table
          dataSource={years}
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
      <CreateYear
        setShowAddYear={setShowAddYear}
        showAddYear={showAddYear}
        handleAddYear={handleAddYear}
      />
      <UpdateYear
        year={selectedYear}
        showUpdateYear={showUpdateYear}
        setShowUpdateYear={setShowUpdateYear}
        handleUpdateYear={handleUpdateYear}
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
    flexDirection: "space-between",
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

export default AcademicYearsContainer;