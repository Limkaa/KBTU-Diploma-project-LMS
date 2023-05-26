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
  useLazyGetTermsWithoutPageQuery,
} from "../../redux/terms/termsApiSlice";
import {
  useGetCourseQuery,
  useGetSchoolCoursesWithoutQuery,
  useLazyGetSchoolCoursesWithoutQuery,
  useLazyGetTeacherCoursesWithoutQuery,
} from "../../redux/courses/coursesApiSlice";
import { useGetMarksOfStudentQuery } from "../../redux/marks/marksOfStudent/marksOfStudentApiSlice";
import { useGetStudentQuery } from "../../redux/students/studentsApiSlice";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";

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

const MarksByCourses = () => {
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const [search, setSearch] = React.useState("");
  const [marks, setMarks] = React.useState([]);
  const [mark, setMark] = React.useState();
  const [show, setShow] = React.useState(false);
  const { data: user } = useGetAuthUserQuery();
  const [select, setSelect] = React.useState("");
  const [selectYear, setSelectYear] = React.useState("");
  const [selectCourse, setSelectCourse] = React.useState("");
  const [selectGrade, setSelectGrade] = React.useState("");

  const [termOptions, setTermOptions] = React.useState([]);
  const [yearOptions, setYearOptions] = React.useState([]);
  const [courseOptions, setCourseOptions] = React.useState([]);
  const [gradeOptions, setGradeOptions] = React.useState([]);

  const [newNumber, setNewNumber] = React.useState();
  const [newComment, setNewComment] = React.useState();

  const [updateMark] = useUpdateMarkMutation();
  const [deleteMark] = useDeleteMarkMutation();

  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState();

  const { data, isLoading, refetch } = useGetMarksOfCourseQuery({
    course_id: selectCourse || courseOptions[0]?.value,
    page,
    search,
    term: select,
  });

  const [getAssignment, { data: dataAssignment, isLoadingAssignment }] =
    useLazyGetAssignmentQuery();

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  const [getTerm, { data: dataTerm }] = useLazyGetTermsWithoutPageQuery();

  const [getUser, { data: dataUser, isLoadingUser }] = useLazyGetUserQuery();

  const [
    getTeacherCourses,
    { data: teacherData, isLoading: teacherIsLoading },
  ] = useLazyGetTeacherCoursesWithoutQuery();

  const [
    getTeacherCoursesWithout,
    { data: teacherWithoutData, isLoading: teacherWithoutIsLoading },
  ] = useLazyGetTeacherCoursesWithoutQuery();

  const [
    getSchoolCourses,
    { data: schoolCoursesData, isLoading: schoolCoursesIsLoading },
  ] = useLazyGetSchoolCoursesWithoutQuery();

  const { data: dataGrades, isLoading: isLoadingGrades } =
    useGetSchoolGradesWithoutPageQuery({
      school_id: user?.school_id,
    });

  React.useEffect(() => {
    if (data && !isLoading) {
      setMarks(data.results);
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
      getTerm({ year_id: dataYears[dataYears?.length - 1]?.id });
    }
  }, [dataYears]);

  React.useEffect(() => {
    if (selectYear !== "") {
      getTerm({ year_id: selectYear });
    }
  }, [selectYear]);

  React.useEffect(() => {
    let arr = [{ value: "", label: "All terms" }];
    if (dataTerm) {
      dataTerm.forEach((term) => {
        arr.push({
          value: term.id,
          label: term.name,
        });
      });
      setTermOptions(arr);
    }
  }, [dataTerm]);

  React.useEffect(() => {
    if (user?.role === "teacher") {
      getTeacherCourses({
        teacher_id: user?.id,
        year_id: selectYear,
        grade: selectGrade,
      });
      getTeacherCoursesWithout({
        teacher_id: user?.id,
        year_id: selectYear,
        grade: "",
      });
    } else if (user?.role === "manager") {
      getSchoolCourses({
        school_id: user?.school_id,
        year_id: selectYear,
        grade: selectGrade,
      });
    }
  }, [user, selectYear, selectGrade]);

  React.useEffect(() => {
    let arr = [];
    if (user?.role === "teacher") {
      if (teacherData && !teacherIsLoading) {
        teacherData.forEach((item) => {
          arr.push({
            value: item?.id,
            label: item?.subject?.name,
          });
        });
        setCourseOptions(arr);
      }
    } else if (user?.role === "manager") {
      if (schoolCoursesData && !schoolCoursesIsLoading) {
        schoolCoursesData.forEach((item) => {
          arr.push({
            value: item?.id,
            label: item?.subject?.name,
          });
        });
        setCourseOptions(arr);
      }
    }
  }, [teacherData, schoolCoursesData]);

  React.useEffect(() => {
    let gradearr = [{ value: "", label: "All grades" }];
    if (user?.role === "teacher") {
      if (teacherWithoutData && !teacherWithoutIsLoading) {
        teacherWithoutData.forEach((item) => {
          const existingItem = gradearr.find(
            (gradearr) =>
              gradearr.value === item?.group?.grade?.id &&
              gradearr.label === item?.group?.grade?.name
          );
          if (!existingItem) {
            gradearr.push({
              value: item?.group?.grade?.id,
              label: item?.group?.grade?.name,
            });
          }
        });
        setGradeOptions(gradearr);
      }
    } else if (user?.role === "manager") {
      if (dataGrades && !isLoadingGrades) {
        // console.log(dataGrades);
        dataGrades?.forEach((item) => {
          gradearr.push({
            value: item?.id,
            label: item?.name,
          });
        });
        setGradeOptions(gradearr);
      }
    }
  }, [
    teacherWithoutData,
    teacherWithoutIsLoading,
    dataGrades,
    isLoadingGrades,
  ]);

  // React.useEffect(() => {
  //   let gradearr = [{ value: "", label: "All grades" }];

  //   if (dataGrades && !isLoadingGrades) {
  //     dataGrades?.forEach((item) => {
  //       gradearr.push({
  //         value: item?.group?.grade?.id,
  //         label: item?.group?.grade?.name,
  //       });
  //     });
  //   }
  // }, [dataGrades, isLoadingGrades]);

  React.useEffect(() => {
    if (mark) {
      getAssignment({
        assignment_id: mark?.assignment,
      });
      if (user?.role === "manager") getUser(mark?.last_edited_by);
    }
  }, [mark]);

  const handleUpdateMark = async () => {
    if (!newNumber) {
      setError(true);
      setErrorText("This field is required");
      return;
    }
    if (newNumber > 5) {
      setError(true);
      setErrorText("Ensure this value is less than or equal to 5.");
      return;
    }
    if (newNumber < 1) {
      setError(true);
      setErrorText("Ensure this value is greater than or equal to 1.");
      return;
    }
    try {
      await updateMark({
        mark_id: mark.id,
        number: newNumber,
        comment: newComment,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark updated");
          refetch();
          setShow(false);
          setError(false);
        });
    } catch (err) {
      console.log(err);
      toastify("error", "Error");
    }
  };

  const handleDeleteMark = async () => {
    try {
      await deleteMark({
        mark_id: mark?.id,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark deleted");
          refetch();
          setShow(false);
          setError(false);
        });
    } catch (err) {
      if (err.data.detail?.__all__[0]) {
        toastify("error", err.data.detail?.__all__[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

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
            <div
              key={el.id}
              onClick={() => {
                setMark(el);
                setShow(true);
                setNewComment(el.comment);
                setNewNumber(el.number);
              }}
              style={{ cursor: "pointer" }}
            >
              <Tooltip
                color="white"
                title={() => {
                  return (
                    <div style={{ padding: 5 }}>
                      {el?.comment && (
                        <div>
                          <div
                            style={{
                              ...styles.commentTitle,
                              color: renderColor(el?.number),
                            }}
                          >
                            Comment
                          </div>
                          <div style={styles.comment}>{el?.comment}</div>
                        </div>
                      )}
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
        return <>Average Mark</>;
      },
      width: "10%",
      render: (item) => <div style={styles.avr}>{item.average_mark}</div>,
    },
  ];

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
                setSelectCourse("");
                setSelectGrade("");
              }}
              value={selectYear || yearOptions[yearOptions?.length - 1]}
            />
            <SelectStyled
              size={"middle"}
              style={{ width: 140 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={termOptions}
              defaultValue={termOptions[0]}
              onChange={(val) => setSelect(val)}
              value={select}
            />
            <SelectStyled
              size={"middle"}
              style={{ width: 150 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={gradeOptions}
              defaultValue={gradeOptions[0]}
              onChange={(val) => setSelectGrade(val)}
              value={selectGrade}
            />
            <SelectStyled
              size={"middle"}
              style={{ width: 180 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={courseOptions}
              defaultValue={courseOptions[0]}
              onChange={(val) => setSelectCourse(val)}
              value={selectCourse || courseOptions[0]}
            />
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
        title="Update Mark"
        style={{ fontSize: 25 }}
        open={show}
        onOk={() => handleUpdateMark()}
        onCancel={() => setShow(false)}
        maskClosable={false}
        okText={"Update"}
        footer={null}
      >
        <div style={styles.assCont}>
          <div style={styles.assTitle}>Assignment</div>
          <div>{dataAssignment?.name}</div>
        </div>

        <div style={styles.select}>
          <div style={styles.title}>Number:</div>
          <Input
            placeholder="Number"
            value={newNumber}
            disabled={user?.role === "manager"}
            onChange={(e) => {
              setNewNumber(e.target.value);
              setError(false);
            }}
          />
          {error && <div style={{ color: "#E74C3C" }}>{errorText}</div>}
        </div>
        <div style={styles.select}>
          <div style={styles.title}>Comment:</div>
          <Input
            placeholder="Comment"
            value={newComment}
            disabled={user?.role === "manager"}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
        {user?.role === "manager" && (
          <div style={{ ...styles.date, color: "#4A4D58" }}>
            Last updated by: {dataUser?.last_name} {dataUser?.first_name}
          </div>
        )}
        <div style={styles.date}>
          Created date: {moment(mark?.created_at).format("DD MMM YYYY")}
        </div>
        <div style={styles.date}>
          Updated date: {moment(mark?.updated_at).format("DD MMM YYYY")}
        </div>
        {user?.role !== "manager" && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginTop: 15,
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="primary"
              style={styles.btnDelete}
              onClick={() => handleDeleteMark()}
            >
              Delete
            </Button>
            <Button
              type="primary"
              style={styles.btnAdd}
              onClick={() => handleUpdateMark()}
            >
              Update
            </Button>
          </div>
        )}
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

export default MarksByCourses;
