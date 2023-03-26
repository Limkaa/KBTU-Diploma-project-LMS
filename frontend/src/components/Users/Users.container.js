import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Select, Input, Button } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddingUserModal from "../modals/AddingUserModal";
import AuthContext from "../../context/AuthProvider";
import { requestUsers } from "../../api";
import UpdateUserModal from "../modals/UpdateUserModal";

const UsersContainer = () => {
  const { userInfo, authToken } = useContext(AuthContext);
  const [users, setUsers] = React.useState();
  const [user, setUser] = React.useState();

  const [showAddUser, setShowAddUser] = React.useState(false);
  const [showUpdateUser, setShowUpdateUser] = React.useState(false);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  React.useEffect(() => {
    if (userInfo?.school_id && authToken) {
      requestUsers(userInfo?.school_id, authToken).then((response) => {
        setUsers(response.results);
        console.log("response", response);
      });
    }
  }, [userInfo, authToken]);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "15%",
      render: (item) => (
        <div>
          {item.first_name} {item.last_name}
        </div>
      ),
    },
    {
      title: () => {
        return <>E-mail</>;
      },
      dataIndex: "email",
      width: "15%",
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
        return <>Role</>;
      },
      dataIndex: "role",
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
          dataSource={users}
          columns={columns}
          rowKey={(item) => item?.id}
          onRow={(record) => {
            return {
              onClick: () => {
                setUser(record);
                setShowUpdateUser(true);
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
      <UpdateUserModal
        showUpdateUser={showUpdateUser}
        setShowUpdateUser={setShowUpdateUser}
        user={user}
        setUser={setUser}
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
