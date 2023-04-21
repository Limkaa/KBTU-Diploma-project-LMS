import React from "react";
import { useParams } from "react-router-dom";
import { useGetAssignmentMarksQuery } from "../../redux/assignments/assignmentsApiSlice";
import { Table, Input, Button, Space } from "antd";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";

const AssignmentMarks = () => {
  const { id: assignment_id } = useParams();
  const [assignmentMarks, setAssignmentMarks] = React.useState([]);
  const [search, setSearch] = React.useState("");

  const { data, isLoading, refetch } = useGetAssignmentMarksQuery({
    assignment_id: assignment_id,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setAssignmentMarks(data);
    }
  }, [data, isLoading]);

  console.log(assignmentMarks);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "20%",
      render: (item) => (
        <div>
          {item?.user?.first_name} {item?.user?.last_name}
        </div>
      ),
    },
    {
      title: () => {
        return <>Mark</>;
      },
      width: "20%",
      render: (item) => <div>{item?.marks?.number}</div>,
    },
    {
      title: () => {
        return <>Comment</>;
      },
      width: "20%",
      render: (item) => <div>{item?.marks?.comment}</div>,
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
            onClick={() => {}}
          >
            Change
          </Button>
          <Button
            style={{ color: "#F18D58", fontWeight: 500 }}
            type={"link"}
            onClick={() => {}}
          >
            Delete
          </Button>
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
