import React, { useContext } from "react";
import Profile from "../Dashboard/Profile";
import Header from "../shared/Header";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddingUserModal from "../modals/AddingUserModal";
import AuthContext from "../../context/AuthProvider";
import { requestUsers } from "../../api";
import UpdateUserModal from "../modals/UpdateUserModal";
import { updateUser, updateUserStatus } from "../../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAddUserMutation,
  useGetUsersQuery,
} from "../../redux/users/usersApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { async } from "regenerator-runtime";

// const UsersContainer = () => {
//   const { userInfo, authToken } = useContext(AuthContext);
//   const [users, setUsers] = React.useState();
//   const [user, setUser] = React.useState();
//   const [showAddUser, setShowAddUser] = React.useState(false);
//   const [showUpdateUser, setShowUpdateUser] = React.useState(false);
//   const [page, setPage] = React.useState(1);
//   const [total, setTotal] = React.useState();
//   const removeSpecSymbols = (str) => str.replace(/[^A-Z0-9]/gi, "");
//   const [search, setSearch] = React.useState("");

const UsersContainer = () => {
  const [users, setUsers] = React.useState();
  const user = useSelector(selectCurrentUser);
  const [showAddUser, setShowAddUser] = React.useState(false);
  const [role, setRole] = React.useState();
  const [selectedUser, setSelectedUser] = React.useState();
  const [showUpdateUser, setShowUpdateUser] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const removeSpecSymbols = (str) => str.replace(/[^A-Z0-9]/gi, "");
  const [search, setSearch] = React.useState("");

  const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery({
    school_id: user.school_id,
    page,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      if (page === 1) {
        setTotal(data?.count);
      }
      setUsers(data?.results);
    }
  }, [data, isLoading]);

  // const handleUpdateUser = (values) => {
  //   setShowUpdateUser(false);
  //   const phoneFormat = `${removeSpecSymbols(values.phone)}`;
  //   updateUser(user.id, authToken, values, phoneFormat).then((response) => {
  //     if (response.ok) {
  //       toast.success("User Updated", {
  //         position: "top-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: false,
  //         pauseOnHover: true,
  //         draggable: false,
  //         theme: "colored",
  //       });
  //     } else {
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
  //   });
  // };

  // const filteredUsers = () => {
  //   if (search) {
  //     return users.filter((itm) => {
  //       let full_name = itm?.first_name + " " + itm?.last_name;
  //       return (
  //         search !== "" &&
  //         (full_name.toLowerCase().indexOf(search) > -1 ||
  //           itm?.first_name.toLowerCase().indexOf(search) > -1 ||
  //           itm?.last_name.toLowerCase().indexOf(search) > -1 ||
  //           itm?.email.toLowerCase().indexOf(search) > -1 ||
  //           itm?.phone.toLowerCase().indexOf(search) > -1)
  //       );
  //     });
  //   } else {
  //     return users;
  //   }
  // };

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
            style={{ color: "#45B764", fontWeight: 500 }}
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
          {/* <Select
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
          /> */}
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
      <AddingUserModal
        setShowAddUser={setShowAddUser}
        showAddUser={showAddUser}
        user={user}
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
};
export default UsersContainer;
