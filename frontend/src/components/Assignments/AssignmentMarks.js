import React from "react";
import { useParams } from "react-router-dom";
import { useGetAssignmentMarksByEnrollmentsQuery } from "../../redux/assignments/assignmentsApiSlice";
import { Table, Input, Button, Space, Tooltip, Alert } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import styled from "styled-components";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  useCreateMarkMutation,
  useDeleteMarkMutation,
  useUpdateMarkMutation,
} from "../../redux/marks/marksApiSlice";
import { toastify } from "../shared/Toast/Toast";

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
    font-size: 14px;
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
  const [updatedMarks, setUpdatedMarks] = React.useState([]);

  const [createMark] = useCreateMarkMutation();
  const [updateMark] = useUpdateMarkMutation();
  const [deleteMark] = useDeleteMarkMutation();

  const { data, isLoading, refetch } = useGetAssignmentMarksByEnrollmentsQuery({
    assignment_id: assignment_id,
    search,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      let arr = [];
      setAssignmentMarks(data.results);
      data?.results?.forEach((el) => {
        arr.push({
          id: el?.id,
          mark_id: el?.marks[0]?.id,
          number: el?.marks[0]?.number,
          comment: el?.marks[0]?.comment,
        });
      });
      setUpdatedMarks(arr);
    }
  }, [data, isLoading]);

  const handleCreateMark = async (id) => {
    const item = updatedMarks.find((item) => item.id === id);
    try {
      await createMark({
        assignment_id: assignment_id,
        enrollment: item.id,
        number: item.number,
        comment: item.comment,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark created");
          refetch();
        });
    } catch (err) {
      console.log(err);
      if (err?.data?.detail?.number[0]) {
        toastify("error", err?.data?.detail?.number[0]);
      }
      if (err.data.detail?.__all__[0]) {
        toastify("error", err.data.detail?.__all__[0]);
      }
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleUpdateMark = async (id) => {
    const item = updatedMarks.find((item) => item.id === id);
    try {
      await updateMark({
        mark_id: item.mark_id,
        number: item.number,
        comment: item.comment,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark update");
          refetch();
        });
    } catch (err) {
      if (err?.data?.detail?.number[0]) {
        toastify("error", err?.data?.detail?.number[0]);
      }
      if (err.data.detail?.__all__[0]) {
        toastify("error", err.data.detail?.__all__[0]);
      }
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleDeleteMark = async (id) => {
    const item = updatedMarks.find((item) => item.id === id);
    try {
      await deleteMark({
        mark_id: item.mark_id,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark deleted");
          refetch();
        });
    } catch (err) {
      if (err.data.detail?.__all__[0]) {
        toastify("error", err.data.detail?.__all__[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleCommentChange = (id, event) => {
    const value = event.target.value;
    const updatedData = updatedMarks.map((item) => {
      if (item.id === id) {
        return { ...item, comment: value };
      }
      return item;
    });
    setUpdatedMarks(updatedData);
  };

  const handleMarkChange = (id, value) => {
    const updatedData = updatedMarks.map((item) => {
      if (item.id === id) {
        return { ...item, number: value };
      }
      return item;
    });
    setUpdatedMarks(updatedData);
  };

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "15%",
      render: (item) => (
        <>
          <div
            style={{
              textDecoration: "none",
              fontWeight: 500,
              color: "#00889D",
              fontSize: 13,
            }}
          >
            {item?.student?.user?.first_name} {item?.student?.user?.last_name}
          </div>
          <div
            style={{
              color: "rgba(74, 77, 88, 1)",
              textDecoration: "none",
              fontWeight: 400,
              fontSize: 13,
            }}
          >
            {item?.student?.user?.email}
          </div>
        </>
      ),
    },
    {
      title: "Comment",
      width: "20%",
      render: (_, record) => (
        <InputMark
          defaultValue={record?.marks[0]?.comment}
          onChange={(event) => handleCommentChange(record.id, event)}
        />
      ),
    },
    {
      title: "Mark",
      key: "mark",
      width: "20%",
      render: (_, record) => (
        <InputMark
          max={5}
          type="number"
          defaultValue={record?.marks[0]?.number}
          onChange={(event) => handleMarkChange(record.id, event.target.value)}
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
            <CheckOutlined
              className="check"
              onClick={() => handleCreateMark(record.id)}
            />
          </Tooltip>
          <Tooltip title="Update Mark">
            <EditOutlined
              key="edit"
              className="edit"
              onClick={() => {
                handleUpdateMark(record.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete Mark">
            <DeleteOutlined
              className="delete"
              key="delete"
              onClick={() => handleDeleteMark(record.id)}
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
