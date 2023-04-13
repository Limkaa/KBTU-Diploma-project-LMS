import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddingUserModal from "./AddingUserModal";
import UpdateUserModal from "./UpdateUserModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useUpdateUserMutation,
  useLazyGetUsersQuery,
} from "../../redux/users/usersApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import { toasty } from "../shared/Toast";

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

  const [getUsers, { data, isLoading, isSuccess, isError, error, refetch }] =
    useLazyGetUsersQuery();

  React.useEffect(() => {
    if (user?.school_id) {
      getUsers({ school_id: user?.school_id, page, search });
    }
  }, [user, page, search]);

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
          toasty({ type: "success", text: "User Updated" });
        });
    } catch (err) {
      toasty();
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
      dataIndex: "role",
      width: "15%",
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

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Users"} />
        <Profile />
      </div>
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
        <Table
          dataSource={users}
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
};
export default UsersContainer;
