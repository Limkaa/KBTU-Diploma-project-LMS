import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Spin, Table, Input, Tooltip, Modal, Button, Select } from "antd";
import Search from "../../assets/icons/search.svg";
import { useGetMarksOfCourseQuery } from "../../redux/marks/marksOfCourse/marksOfCourseApiSlice";
import moment from "moment";
import {
  useGetAssignmentQuery,
  useGetCourseAssignmentsQuery,
  useLazyGetAssignmentQuery,
} from "../../redux/assignments/assignmentsApiSlice";
import { useLazyGetUserQuery } from "../../redux/users/usersApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import {
  useDeleteMarkMutation,
  useUpdateMarkMutation,
} from "../../redux/marks/marksApiSlice";
import { toastify } from "../shared/Toast/Toast";
import { DeleteOutlined } from "@ant-design/icons";
import styled from "styled-components";
import {
  useGetTermsWithoutPageQuery,
  useLazyGetTermQuery,
  useLazyGetTermsWithoutPageQuery,
} from "../../redux/terms/termsApiSlice";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import { useGetMarksOfStudentQuery } from "../../redux/marks/marksOfStudent/marksOfStudentApiSlice";
import { useGetStudentQuery } from "../../redux/students/studentsApiSlice";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { useGetFinalMarksOfStudentQuery } from "../../redux/finalmarks/finalMarksApiSlice";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";

const SelectStyled = styled(Select)`
  &.ant-select-single .ant-select-selector {
    color: rgba(74, 77, 88, 1);
    font-family: "Open Sans";
    font-weight: 700;
    font-size: 14px;
    height: 40px;
    align-items: center;
  }
`;

const FinalMarksForStudent = () => {
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const [search, setSearch] = React.useState("");
  const [marks, setMarks] = React.useState([]);
  const [mark, setMark] = React.useState();
  const [show, setShow] = React.useState(false);
  const { data: user } = useGetAuthUserQuery();
  const [select, setSelect] = React.useState("");
  const [termOptions, setTermOptions] = React.useState([]);
  const [yearOptions, setYearOptions] = React.useState([]);
  const [selectYear, setSelectYear] = React.useState();
  const [term, setTerm] = React.useState();

  const { data: studentData } = useGetStudentQuery(user?.id);

  const [getTerm, { data: dataTerm, isLoadingTerm }] = useLazyGetTermQuery();

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  const { data, isLoading } = useGetFinalMarksOfStudentQuery({
    student_id: studentData?.id,
    search: search,
    page: page,
    year: selectYear,
  });

  React.useEffect(() => {
    if (mark) {
      if (mark?.el?.term) {
        getTerm({ term_id: mark?.el?.term });
      }
    }
  }, [mark]);

  React.useEffect(() => {
    if (dataTerm && !isLoadingTerm) {
      setTerm(dataTerm);
    }
  }, [dataTerm, isLoadingTerm]);

  React.useEffect(() => {
    if (data && !isLoading) {
      setMarks(data.results);
      console.log(data);
      setTotal(data.count);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    let arr = [];
    if (dataYears && !isLoadingYears) {
      dataYears.forEach((item) => {
        arr.push({
          value: item.id,
          label: item.name,
        });
      });
      setYearOptions(arr);
      setSelectYear(arr[arr.length - 1].value);
    }
  }, [dataYears]);

  const renderColor = (item) => {
    if (item === 5) {
      return "rgba(0, 137, 158, 1)";
    } else if (item === 4) {
      return "#DFD61B";
    } else {
      return "#ED7432";
    }
  };

  const columns = [
    {
      title: () => {
        return <>Subject</>;
      },
      width: "12%",
      render: (item) => (
        <div>
          <div style={styles.name}>{item?.subject?.name}</div>
          <div style={styles.email}>{item?.subject?.code}</div>
        </div>
      ),
    },
    {
      title: "Term",
      children: [
        {
          title: "Marks",
          width: "30%",
          render: (item) => (
            <div style={{ display: "flex" }}>
              {item?.terms_marks?.map((el) => (
                <div
                  key={el.id}
                  onClick={() => {
                    setMark({ el, year: item?.year });
                    setShow(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Tooltip
                    color="white"
                    title={() => {
                      return (
                        <div style={{ padding: 5 }}>
                          <div style={styles.date}>
                            Updated date:{" "}
                            {moment(item?.updated_at).format("DD MMM YYYY")}
                          </div>
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

        {
          title: () => {
            return <>Average</>;
          },
          width: "10%",
          render: (item) => <div style={styles.avr}>{item.terms_average}</div>,
        },
      ],
    },
    {
      title: "Year mark",
      width: "15%",
      render: (item) => (
        <div style={{ display: "flex" }}>
          {item?.year_mark?.number && (
            <div
              onClick={() => {
                setMark({ el: item?.year_mark, year: item?.year });
                setShow(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <Tooltip
                color="white"
                title={() => {
                  return (
                    <div style={{ padding: 5 }}>
                      <div style={styles.date}>
                        Updated date:{" "}
                        {moment(item?.year_mark?.updated_at).format(
                          "DD MMM YYYY"
                        )}
                      </div>
                    </div>
                  );
                }}
              >
                <div
                  style={{
                    ...styles.number,
                    backgroundColor: renderColor(item?.year_mark?.number),
                  }}
                >
                  {item?.year_mark?.number}
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
  ];

  console.log(mark);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Marks"} />
        <Profile />
      </div>
      <div style={styles.tableCont}>
        <div style={styles.filter}>
          <div style={{ display: "flex", gap: 6 }}>
            <SelectStyled
              size={"middle"}
              style={{ width: 140 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={yearOptions}
              defaultValue={yearOptions[yearOptions?.length - 1]}
              onChange={(val) => {
                setSelectYear(val);
              }}
              value={selectYear}
            />
            <div style={styles.selectHeader}>
              Grade: {marks[0]?.subject?.grade?.name}
            </div>
          </div>
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
      <Modal
        title="Mark"
        style={{ fontSize: 25 }}
        open={show}
        maskClosable={false}
        onCancel={() => setShow(false)}
        okText={"Update"}
        footer={null}
      >
        {mark?.el?.term ? (
          <div
            style={{
              ...styles.assCont,
              backgroundColor: "#E4F4E6",
            }}
          >
            <div style={styles.assTitle}>{term?.name}</div>
            <div style={styles.assDate}>
              {moment(term?.from_date).format("DD.MM.YYYY")}
              {"-"}
              {moment(term?.to_date).format("DD.MM.YYYY")}
            </div>
          </div>
        ) : (
          <div
            style={{
              ...styles.assCont,
              backgroundColor: "#E4F4E6",
            }}
          >
            <div style={styles.assTitle}>{mark?.year?.name}</div>
          </div>
        )}

        <div style={styles.select}>
          <div style={styles.title}>Number:</div>
          <div style={styles.input}>{mark?.el?.number}</div>
        </div>

        <div style={styles.date}>
          Created date: {moment(mark?.el?.created_at).format("DD MMM YYYY")}
        </div>
        <div style={styles.date}>
          Updated date: {moment(mark?.el?.updated_at).format("DD MMM YYYY")}
        </div>
      </Modal>
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
  selectHeader: {
    border: "1px solid #d9d9d9",
    color: "rgba(74, 77, 88, 1)",
    backgroundColor: "white",
    fontSize: 14,
    height: 38.5,
    alignItems: "center",
    textAlign: "center",
    display: "flex",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
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
  commentTitle: {
    color: "#4A4D58",
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1.2,
  },
  comment: {
    color: "#4A4D58",
    fontWeight: 400,
    fontSize: 13,
    lineHeight: 1.2,
    paddingTop: 5,
    paddingBottom: 5,
  },
  date: {
    color: "#969696",
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1.2,
    marginBottom: 3,
  },
  avr: {
    color: "rgba(22, 58, 97, 1)",
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1.2,
    textAlign: "center",
  },
  select: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 7,
    color: "#4A4D58",
  },
  assCont: {
    backgroundColor: "rgba(240, 247, 255, 1)",
    padding: "5px 8px",
    borderRadius: 8,
  },
  assTitle: {
    fontWeight: 500,
    fontSize: 14,
    color: "#4A4D58",
  },
  btnDelete: {
    backgroundColor: "#EA0C0C",
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 400,
  },
  btnAdd: {
    backgroundColor: "#163A61",
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 400,
  },
  input: {
    border: "1px solid rgba(22, 58, 97, 0.1)",
    padding: 5,
    borderRadius: 8,
    fontWeight: 400,
    fontSize: 14,
    color: "#4A4D58",
  },
};

export default FinalMarksForStudent;
