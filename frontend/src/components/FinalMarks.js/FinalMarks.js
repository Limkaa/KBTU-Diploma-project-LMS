import React from "react";
import {
  Spin,
  Table,
  Input,
  Tooltip,
  Modal,
  Button,
  Select,
  Space,
} from "antd";
import Search from "../../assets/icons/search.svg";
import moment from "moment";
import { useLazyGetUserQuery } from "../../redux/users/usersApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import { toastify } from "../shared/Toast/Toast";
import styled from "styled-components";
import {
  useLazyGetTermQuery,
  useLazyGetTermsWithoutPageQuery,
} from "../../redux/terms/termsApiSlice";
import {
  useLazyGetSchoolCoursesWithoutQuery,
  useLazyGetTeacherCoursesWithoutQuery,
} from "../../redux/courses/coursesApiSlice";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { useGetYearsWithoutPageQuery } from "../../redux/academicYears/academicYearsApiSlice";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import { useGetFinalMarksOfCourseQuery } from "../../redux/finalmarks/finalMarksApiSlice";
import {
  useCreateTermMarkMutation,
  useDeleteTermMarkMutation,
  useUpdateTermMarkMutation,
} from "../../redux/finalmarks/termMarks/termMarksApiSlice";
import {
  useCreateYearMarkMutation,
  useDeleteYearMarkMutation,
  useUpdateYearMarkMutation,
} from "../../redux/finalmarks/yearMarks/yearMarksApiSlice";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

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

const FinalMarks = () => {
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState();
  const [search, setSearch] = React.useState("");
  const [marks, setMarks] = React.useState([]);
  const [mark, setMark] = React.useState();
  const [row, setRow] = React.useState();
  const [term, setTerm] = React.useState();
  const [terms, setTerms] = React.useState();

  const [show, setShow] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [showCreateYear, setShowCreateYear] = React.useState(false);

  const { data: user } = useGetAuthUserQuery();
  const [selectYear, setSelectYear] = React.useState();
  const [selectTerm, setSelectTerm] = React.useState();

  const [selectCourse, setSelectCourse] = React.useState("");
  const [selectGrade, setSelectGrade] = React.useState("");
  const [yearOptions, setYearOptions] = React.useState([]);
  const [courseOptions, setCourseOptions] = React.useState([]);
  const [gradeOptions, setGradeOptions] = React.useState([]);
  const [termOptions, setTermOptions] = React.useState([]);

  const [newNumber, setNewNumber] = React.useState();

  const [createMark] = useCreateTermMarkMutation();
  const [updateMark] = useUpdateTermMarkMutation();
  const [deleteMark] = useDeleteTermMarkMutation();

  const [createYearMark] = useCreateYearMarkMutation();
  const [updateYearMark] = useUpdateYearMarkMutation();
  const [deleteYearMark] = useDeleteYearMarkMutation();

  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState();

  const { data, isLoading, refetch } = useGetFinalMarksOfCourseQuery({
    course_id: selectCourse || courseOptions[0]?.value,
    page,
    search,
  });

  const { data: dataYears, isLoading: isLoadingYears } =
    useGetYearsWithoutPageQuery({
      school_id: user?.school_id,
    });

  const [getUser, { data: dataUser, isLoadingUser }] = useLazyGetUserQuery();
  const [getTerm, { data: dataTerm, isLoadingTerm }] = useLazyGetTermQuery();

  const [
    getTeacherCourses,
    { data: teacherData, isLoading: teacherIsLoading },
  ] = useLazyGetTeacherCoursesWithoutQuery();

  const [getTerms, { data: dataTerms, isLoading: isLoadingTerms }] =
    useLazyGetTermsWithoutPageQuery();

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
    if (dataTerm && !isLoadingTerm) {
      setTerm(dataTerm);
    }
  }, [dataTerm, isLoadingTerm]);

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

  React.useEffect(() => {
    if (selectYear !== "")
      getTerms({
        year_id: selectYear,
      });
  }, [selectYear]);

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

  React.useEffect(() => {
    if (mark) {
      if (user?.role === "manager") getUser(mark?.el?.last_edited_by);
      if (mark?.el?.term) {
        getTerm({ term_id: mark?.el?.term });
      }
    }
  }, [mark]);

  React.useEffect(() => {
    let arr = [];
    if (dataTerms && !isLoadingTerms) {
      dataTerms.forEach((term, index) => {
        arr.push({
          value: term.id,
          label: term.name,
          index: index,
        });
      });
      setTermOptions(arr);
      setSelectTerm(arr[0]?.value);
      setTerms(dataTerms);
    }
  }, [dataTerms]);

  const handleCreateMark = async () => {
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
      await createMark({
        course_id: selectCourse || courseOptions[0]?.value,
        enrollment: row?.id,
        term: selectTerm,
        number: newNumber,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark created");
          refetch();
          setShowCreate(false);
          setError(false);
          setNewNumber();
        });
    } catch (err) {
      console.log(err);
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  const handleCreateYearMark = async () => {
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
      await createYearMark({
        course_id: selectCourse || courseOptions[0]?.value,
        enrollment: row?.id,
        number: newNumber,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Mark created");
          refetch();
          setShowCreateYear(false);
          setError(false);
          setNewNumber();
        });
    } catch (err) {
      console.log(err);
      if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

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
    if (mark?.el?.term) {
      try {
        await updateMark({
          mark_id: mark?.el?.id,
          number: newNumber,
        })
          .unwrap()
          .then((payload) => {
            toastify("success", "Mark updated");
            refetch();
            setShow(false);
            setError(false);
            setNewNumber();
          });
      } catch (err) {
        console.log(err);
        toastify("error", "Error");
      }
    } else {
      try {
        await updateYearMark({
          mark_id: mark?.el?.id,
          number: newNumber,
        })
          .unwrap()
          .then((payload) => {
            toastify("success", "Mark updated");
            refetch();
            setShow(false);
            setError(false);
            setNewNumber();
          });
      } catch (err) {
        console.log(err);
        toastify("error", "Error");
      }
    }
  };

  const handleDeleteMark = async () => {
    if (mark?.el?.term) {
      try {
        await deleteMark({
          mark_id: mark?.el?.id,
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
    } else {
      try {
        await deleteYearMark({
          mark_id: mark?.el?.id,
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

  // for (let i = 0; i < terms?.length; i++) {
  //   let sortedEvents = {};

  //   let term = terms[i];
  //   marks?.map((mark) => {
  //     mark.terms_marks?.map((item) => {
  //       if (item.term === term.id) {
  //         console.log("gggg", item, term);
  //       }
  //     });
  //   });
  // }

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
                    setNewNumber(el.number);
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
          title: "Action",
          key: "action",
          width: "10%",
          render: (_, record) => (
            <div
              style={{
                color: "#F18D58",
                fontWeight: 500,
                padding: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                setRow(record);
                setShowCreate(true);
                getTerms({
                  year_id: record?.year?.id,
                });
              }}
            >
              Create
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
          {item?.year_mark?.number ? (
            <div
              onClick={() => {
                setMark({ el: item?.year_mark, year: item?.year });
                setShow(true);
                setNewNumber(item?.year_mark?.number);
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
          ) : (
            <div
              style={{
                color: "#163A61",
                fontWeight: 500,
                padding: 0,
                cursor: "pointer",
              }}
              onClick={() => {
                setRow(item);
                setShowCreateYear(true);
              }}
            >
              Create
            </div>
          )}
        </div>
      ),
    },
  ];

  const columnsForManager = [
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
                    setNewNumber(el.number);
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
                setNewNumber(item?.year_mark?.number);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Final marks"} />
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
              value={selectYear}
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
            columns={user?.role === "teacher" ? columns : columnsForManager}
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
        maskClosable={false}
        onCancel={() => setShow(false)}
        okText={"Update"}
        footer={null}
      >
        {mark?.el?.term ? (
          <div
            style={{
              ...styles.assCont,
              backgroundColor: term?.is_opened_to_final_marks
                ? "#E4F4E6"
                : "#FBE6DA",
            }}
          >
            <div
              style={{
                ...styles.assTitle,
                color: term?.is_opened_to_final_marks ? "#4EBF59" : "#EA5A0C",
                marginBottom: 5,
              }}
            >
              {term?.is_opened_to_final_marks
                ? "Term is opened to marks"
                : "Term is closed to marks"}
            </div>
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
              backgroundColor: mark?.year?.is_opened_to_marks
                ? "#E4F4E6"
                : "#FBE6DA",
            }}
          >
            <div
              style={{
                ...styles.assTitle,
                color: mark?.year?.is_opened_to_marks ? "#4EBF59" : "#EA5A0C",
                marginBottom: 5,
              }}
            >
              {mark?.year?.is_opened_to_marks
                ? "Year is opened to marks"
                : "Year is closed to marks"}
            </div>
            <div style={styles.assTitle}>{mark?.year?.name}</div>
          </div>
        )}

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
        {user?.role === "manager" && (
          <div style={{ ...styles.date, color: "#4A4D58" }}>
            Last updated by: {dataUser?.last_name} {dataUser?.first_name}
          </div>
        )}
        <div style={styles.date}>
          Created date: {moment(mark?.el?.created_at).format("DD MMM YYYY")}
        </div>
        <div style={styles.date}>
          Updated date: {moment(mark?.el?.updated_at).format("DD MMM YYYY")}
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
              disabled={
                mark?.el?.term
                  ? !term?.is_opened_to_final_marks
                  : !mark?.year?.is_opened_to_marks
              }
              onClick={() => handleDeleteMark()}
            >
              Delete
            </Button>
            <Button
              type="primary"
              style={styles.btnAdd}
              disabled={
                mark?.el?.term
                  ? !term?.is_opened_to_final_marks
                  : !mark?.year?.is_opened_to_marks
              }
              onClick={() => handleUpdateMark()}
            >
              Update
            </Button>
          </div>
        )}
      </Modal>
      <Modal
        title="Create Mark"
        style={{ fontSize: 25 }}
        open={showCreate}
        maskClosable={false}
        onCancel={() => setShowCreate(false)}
        okText={"Create"}
        footer={null}
      >
        <div>
          <div
            style={{
              ...styles.assCont,
              backgroundColor: terms?.find((item) => selectTerm === item.id)
                ?.is_opened_to_final_marks
                ? "#E4F4E6"
                : "#FBE6DA",
            }}
          >
            <div
              style={{
                ...styles.assTitle,
                color: terms?.find((item) => selectTerm === item.id)
                  ?.is_opened_to_final_marks
                  ? "#4EBF59"
                  : "#EA5A0C",
                marginBottom: 5,
              }}
            >
              {terms?.find((item) => selectTerm === item.id)
                ?.is_opened_to_final_marks
                ? "Term is opened to marks"
                : "Term is closed to marks"}
            </div>
            <div style={styles.assTitle}>{term?.name}</div>
            <div style={styles.assDate}>
              {moment(
                terms?.find((item) => selectTerm === item.id)?.from_date
              ).format("DD.MM.YYYY")}
              {"-"}
              {moment(
                terms?.find((item) => selectTerm === item.id)?.to_date
              ).format("DD.MM.YYYY")}
            </div>
          </div>
          <div style={styles.select}>
            <SelectStyled
              size={"middle"}
              style={{ width: "100%", marginBottom: 10 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={termOptions}
              defaultValue={termOptions[0]}
              onChange={(val) => setSelectTerm(val)}
              value={selectTerm}
            />
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
              style={styles.btnAdd}
              disabled={
                !terms?.find((item) => selectTerm === item.id)
                  ?.is_opened_to_final_marks
              }
              onClick={() => handleCreateMark()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Create Year Mark"
        style={{ fontSize: 25 }}
        open={showCreateYear}
        maskClosable={false}
        onCancel={() => setShowCreateYear(false)}
        okText={"Create"}
        footer={null}
      >
        <div>
          <div
            style={{
              ...styles.assCont,
              backgroundColor: row?.year?.is_opened_to_marks
                ? "#E4F4E6"
                : "#FBE6DA",
            }}
          >
            <div
              style={{
                ...styles.assCont,
                backgroundColor: row?.year?.is_opened_to_marks
                  ? "#E4F4E6"
                  : "#FBE6DA",
              }}
            >
              <div
                style={{
                  ...styles.assTitle,
                  color: row?.year?.is_opened_to_marks ? "#4EBF59" : "#EA5A0C",
                  marginBottom: 5,
                }}
              >
                {row?.year?.is_opened_to_marks
                  ? "Year is opened to marks"
                  : "Year is closed to marks"}
              </div>
              <div style={styles.assTitle}>{row?.year?.name}</div>
            </div>
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
              style={styles.btnAdd}
              disabled={!row?.year?.is_opened_to_marks}
              onClick={() => handleCreateYearMark()}
            >
              Create
            </Button>
          </div>
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
  action: {
    color: "#00899E",
    fontWeight: 500,
    padding: 0,
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
  assDate: {
    fontWeight: 500,
    fontSize: 13,
    color: "#969696",
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

export default FinalMarks;
