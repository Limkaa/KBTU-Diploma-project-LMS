import React from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Select, Input, Button } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddingUserModal from "../modals/AddingUserModal";

const UsersContainer = () => {
  const [users, setUsers] = React.useState();
  const [showAddUser, setShowAddUser] = React.useState(false);
  const [role, setRole] = React.useState();
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  React.useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      fetch("https://dummyjson.com/users")
        .then((res) => res.json())
        .then((json) => setUsers(json));
    };

    dataFetch();
  }, []);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "15%",
      render: (text, item) => (
        <div>
          {item.lastName} {item.firstName}
        </div>
      ),
    },
    {
      title: () => {
        return <>Phone number</>;
      },
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: () => {
        return <>Class</>;
      },
      dataIndex: "age",
      width: "15%",
    },
    {
      title: () => {
        return <>Role</>;
      },
      dataIndex: "age",
      width: "15%",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Users"} />
        <Profile />
      </div>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <Select
            defaultValue="lucy"
            style={{
              width: 180,
            }}
            size={"large"}
            onChange={handleChange}
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "Yiminghe",
                label: "yiminghe",
              },
            ]}
          />
          <div style={{ alignItems: "center", display: "flex" }}>
            <Input
              size="default size"
              placeholder="Search..."
              prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
              style={{
                height: 40,
                width: 280,
                border: "none",
                borderRadius: 8,
              }}
            />
            <Button
              type="primary"
              style={{
                backgroundColor: "#163A61",
                height: 40,
                borderRadius: 8,
                alignItems: "center",
                display: "flex",
                fontWeight: 500,
                marginLeft: 16,
              }}
              icon={<img src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowAddUser(true)}
            >
              Add user
            </Button>
          </div>
        </div>

        <Table
          dataSource={users?.users}
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
          // pagination={{
          //   defaultPageSize: 14,
          //   total: users.total,
          //   current: 1,
          //   // onChange: (page, pageSize) => {
          //   //   setPage(page);
          //   // },
          //   showSizeChanger: false,
          // }}
        />
      </div>
      <AddingUserModal
        setShowAddUser={setShowAddUser}
        showAddUser={showAddUser}
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
    justifyContent: "space-between",
    display: "flex",
  },
};
export default UsersContainer;
