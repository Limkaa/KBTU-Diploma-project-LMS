import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header/Header";
import { Table, Input, Button, Space, Spin, Tag } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddingUserModal from "./AddingUserModal";
import UpdateUserModal from "./UpdateUserModal";
import "react-toastify/dist/ReactToastify.css";
import {
  useUpdateUserMutation,
  useGetUsersQuery,
} from "../../redux/users/usersApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import { toastify } from "../shared/Toast/Toast";

const UsersContainer = () => {
  const [users, setUsers] = React.useState();
  const [showAddUser, setShowAddUser] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState();
  const [showUpdateUser, setShowUpdateUser] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const removeSpecSymbols = (str) => str.replace(/[^A-Z0-9]/gi, "");
  const [search, setSearch] = React.useState("");
  const { data: user, refetch: refetchUser } = useGetAuthUserQuery();

  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetUsersQuery({ school_id: user?.school_id, page, search });
    
  const roleColor = {
    manager: "orange",
    teacher: "purple",
    student: "green",
  };

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setUsers(data?.results);
    }
  }, [data, isLoading]);

  const [updateUser] = useUpdateUserMutation();

  const handleUpdateUser = async (values) => {
    setShowUpdateUser(false);
    const phoneFormat = `${removeSpecSymbols(values.phone)}`;
    try {
      await updateUser({
        id: selectedUser.id,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        role: values.role,
        gender: values.gender,
        date_of_birth: values.date_of_birth,
        phone: phoneFormat,
        telegram_id: values.telegram_id,
        is_active: values.is_active,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          refetchUser();
          toastify("success", "User Updated");
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
      width: "15%",
      render: (user) => (
        <Tag
          style={{ minWidth: 70, textAlign: "center" }}
          color={roleColor[user.role]}
        >
          {user.role}
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
            style={{ color: "#00899E", fontWeight: 500, padding: 0 }}
            type={"link"}
            onClick={() => {
              setSelectedUser(record);
              setShowUpdateUser(true);
            }}
          >
            Change
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <Header text={"Users"} />
        <Profile />
      </header>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
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
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
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
        <Spin spinning={isLoading}>
          <Table
            dataSource={users}
            columns={columns}
            rowKey={(item) => item?.id}
            onRow={(record) => {
              return {
                onClick: () => {},
              };
            }}
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
      <AddingUserModal
        setShowAddUser={setShowAddUser}
        showAddUser={showAddUser}
        user={user}
        refetch={refetch}
        refetchUser={refetchUser}
      />
      <UpdateUserModal
        showUpdateUser={showUpdateUser}
        setShowUpdateUser={setShowUpdateUser}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleUpdateUser={handleUpdateUser}
      />
    </main>
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
};
export default UsersContainer;
