import React from "react";
import Header from "../shared/Header/Header";
import styled from "styled-components";
import Profile from "../Dashboard/Profile";
import { useLocation, useParams } from "react-router-dom";
import {
  useGetCourseWinnersQuery,
  useGetWinnersOfAwardQuery,
} from "../../redux/winners/winnersApiSlice";
import { Spin, Table, Input, Tooltip } from "antd";
import { useGetAwardQuery } from "../../redux/awards/awardsApiSlice";
import { Paper } from "@mui/material";
import Back from "../shared/Back";
import Search from "../../assets/icons/search.svg";
import { useGetMarksOfCourseQuery } from "../../redux/marks/marksOfCourse/marksOfCourseApiSlice";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import moment from "moment";
import { useGetCourseAssignmentsQuery } from "../../redux/assignments/assignmentsApiSlice";

const TooltipStyled = styled(Tooltip)`
  &.ant-tooltip {
    color: #666666;
    font-size: 15px;
    border: 1px solid red;
  }
`;

const CourseMarks = () => {
  const { id: courseId } = useParams();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const [search, setSearch] = React.useState("");
  const [marks, setMarks] = React.useState([]);
  const [markDates, setMarkDates] = React.useState([]);

  const { data, isLoading } = useGetMarksOfCourseQuery({
    course_id: courseId,
    page,
    search,
  });

  const {
    data: dataAssignments,
    isLoading: isLoadingAssignments,
    refetch,
  } = useGetCourseAssignmentsQuery({ course_id: courseId, search: "" });

  React.useEffect(() => {
    if (data && !isLoading) {
      setMarks(data.results);
      setTotal(data.count);
    }
  }, [data, isLoading]);

  const renderColor = (item) => {
    if (item === 5) {
      return "rgba(0, 137, 158, 1)";
    } else if (item === 4) {
      return "#DFD61B";
    } else {
      return "#ED7432";
    }
  };

  console.log(marks);

  const columns = [
    {
      title: () => {
        return <>Name</>;
      },
      width: "10%",
      render: (item) => (
        <div style={{}}>
          <div style={styles.name}>
            {item?.student?.user?.first_name} {item?.student?.user?.last_name}
          </div>
          <div style={styles.email}>{item?.student?.user?.email}</div>
        </div>
      ),
    },
    {
      title: "Marks",
      width: "80%",
      render: (item) => (
        <div style={{ display: "flex" }}>
          {item?.marks?.map((el) => (
            <div key={el.id}>
              <Tooltip
                color="white"
                title={() => {
                  return (
                    <div>
                      <div style={styles.comment}>Comment</div>
                      <div style={styles.comment}>{el?.comment}</div>
                    </div>
                  );
                }}
              >
                <div
                  style={{
                    ...styles.number,
                    backgroundColor: renderColor(el?.number),
                  }}
                >
                  {el?.number}
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <Input
            size="default size"
            placeholder="Search..."
            prefix={<img src={Search} style={{ height: 15, width: 15 }} />}
            style={styles.search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <Spin spinning={isLoading} size="large">
          <Table
            dataSource={marks}
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
        </Spin>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  tableCont: {
    marginTop: 15,
    borderRadius: 8,
    border: "1px solid #0000000D",
  },
  search: {
    height: 40,
    width: 280,
    //   border: "none",
    //   borderRadius: 8,
  },
  filter: {
    padding: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnAdd: {
    backgroundColor: "#163A61",
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    height: 40,
    fontWeight: 500,
    marginLeft: 16,
    gap: 5,
  },
  name: {
    textDecoration: "none",
    fontWeight: 500,
    color: "#00889D",
    fontSize: 13,
  },
  email: {
    color: "rgba(74, 77, 88, 1)",
    textDecoration: "none",
    fontWeight: 400,
    fontSize: 13,
  },
  number: {
    alignSelf: "baseline",
    padding: "6px 10px",
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
    margin: 2,
    borderRadius: 5,
  },
  comment: {
    color: "#4A4D58",
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1.2,
  },
};

export default CourseMarks;
