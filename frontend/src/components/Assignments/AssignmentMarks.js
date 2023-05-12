import React from "react";
import { useParams } from "react-router-dom";
import { useGetAssignmentMarksByEnrollmentsQuery } from "../../redux/assignments/assignmentsApiSlice";
import { Table, Input, Button, Space, Tooltip } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import styled from "styled-components";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";

const InputComment = styled(Input)`
  &.ant-input {
    padding: 15px;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: #163a61;
    border: none;
    border-radius: 6px;
    background-color: rgba(248, 249, 250, 1);
    box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.05);
  }
  &.ant-input:focus {
    box-shadow: inset 2px 2px 2px 2px rgba(0, 0, 0, 0.07);
  }
`;

const InputMark = styled(Input)`
  &.ant-input {
    padding: 15px;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    color: #163a61;
    border: none;
    width: 80%;
    // border-left: 4px solid #163a61;
    border-radius: 6px;
    background-color: rgba(248, 249, 250, 1);
    box-shadow: inset 0px 2px 2px rgba(0, 0, 0, 0.05);
  }
  &.ant-input:focus {
    box-shadow: inset 2px 2px 2px 2px rgba(0, 0, 0, 0.07);
  }
`;

const AssignmentMarks = () => {
  const { id: assignment_id } = useParams();
  const [assignmentMarks, setAssignmentMarks] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [changedRows, setChangedRows] = React.useState([]);
  const [newComment, setNewComment] = React.useState();
  const [newMark, setNewMark] = React.useState();

  const { data, isLoading, refetch } = useGetAssignmentMarksByEnrollmentsQuery({
    assignment_id: assignment_id,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setAssignmentMarks(data.results);
    }
  }, [data, isLoading]);

  // const handleDataChange = (id, data) => {
  //   console.log(id, data);
  //   // const changedRowKeys = newData.map((row) => row.key);
  //   // setChangedRows([...changedRows, { id, comment, mark }]);
  //   // setAssignmentMarks(newData);
  // };

  const handleSave = () => {
    const changedData = assignmentMarks.filter((row) =>
      changedRows.includes(row.key)
    );
    // Send changedData to query
  };

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "15%",
      render: (item) => (
        <div>
          {item?.student?.user?.first_name} {item?.student?.user?.last_name}
        </div>
      ),
    },
    {
      title: "Comment",
      width: "20%",
      render: (_, record) => (
        <InputMark defaultValue={record?.marks[0]?.comment} />
      ),
    },
    {
      title: "Mark",
      key: "mark",
      width: "20%",
      render: (_, record) => (
        <InputMark
          type="number"
          defaultValue={record?.marks[0]?.number}
          // onChange={(e) =>
          //   handleDataChange(
          //     assignmentMarks.map((row) =>
          //       row.key === record.key ? { ...row, mark: e.target.value } : row
          //     )
          //   )
          // }
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Create Mark">
            <CheckOutlined />
          </Tooltip>
          <Tooltip title="Update Mark">
            <EditOutlined
              key="edit"
              onClick={() => {
                // setSelectedRoom(room);
                // setShowModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Mark">
            <DeleteOutlined
              className="delete"
              key="delete"
              // onClick={() => handleDeleteRoom(room.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <div style={styles.tableCont}>
      <div style={styles.filter}>
        <div style={{ alignItems: "center", display: "flex" }}>
          <Input
            size="default size"
            placeholder="Search by name"
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            style={styles.search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      <Table
        dataSource={assignmentMarks}
        columns={columns}
        rowKey={(item) => item?.id}
        pagination={false}
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
  status: {
    fontWeight: 600,
    fontSize: 14,
  },
};

export default AssignmentMarks;
