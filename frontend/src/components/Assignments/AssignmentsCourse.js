import React from "react";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Link, useLocation } from "react-router-dom";
import {
  useAddAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetCourseAssignmentsQuery,
  useUpdateAssignmentMutation,
} from "../../redux/assignments/assignmentsApiSlice";
import moment from "moment-timezone";
import { Button, Input, Spin } from "antd";
import Search from "../../assets/icons/search.svg";
import CourseAssignments from "../Courses/CourseAssignments";
import { useGetTermsWithoutPageQuery } from "../../redux/terms/termsApiSlice";
import Plus from "../../assets/icons/plus.svg";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import AssignmentCreate from "./AssignmentCreate";
import { toastify } from "../shared/Toast/Toast";

const AssignmentsCourse = () => {
  const location = useLocation();
  let courseId = location?.state?.courseId;
  const { data: user } = useGetAuthUserQuery();
  const [assignments, setAssignments] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [terms, setTerms] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [showAddAssignment, setShowAddAssignment] = React.useState();

  const {
    data: dataAssignments,
    isLoading: isLoadingAssignments,
    refetch,
  } = useGetCourseAssignmentsQuery({ course_id: courseId, search: search });

  const { data: course } = useGetCourseQuery({
    id: courseId,
  });

  const { data: dataTerm, isLoading } = useGetTermsWithoutPageQuery({
    year_id: course?.year?.id,
  });

  const [createAssignment] = useAddAssignmentMutation();

  React.useEffect(() => {
    if (dataTerm && !isLoading) {
      setTerms(dataTerm);
    }
  }, [dataTerm, isLoading]);

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    let sortedAssignmentss = {};
    if (dataAssignments && !isLoadingAssignments) {
      dataAssignments?.forEach((item) => {
        const time = moment(item?.datetime).format("MMM DD, YYYY");
        if (!sortedAssignmentss[time]) {
          sortedAssignmentss[time] = [];
          sortedAssignmentss[time].push(item);
        } else {
          sortedAssignmentss[time].push(item);
        }
      });
      setAssignments(sortedAssignmentss);
      setLoading(false);
    }
  }, [dataAssignments, isLoadingAssignments]);

  const returnDate = (date) => {
    let today = moment().format("DD MMM YYYY");
    let tomorrow = moment(today).add(1, "days").format("DD MMM YYYY");
    if (moment(date).format("DD MMM YYYY") === today) {
      return moment(date).format("HH:mm") + " Today";
    } else if (moment(date).format("DD MMM YYYY") === tomorrow) {
      return moment(date).format("HH:mm") + " Tomorrow";
    } else {
      return moment(date).format("HH:mm MMM DD, YYYY");
    }
  };

  const returnColor = (item) => {
    if (moment(item.datetime) < moment()) {
      return "#00889D";
    } else {
      return "#F18D58";
    }
  };

  const handleAddAssignment = async (values, isActive, datetime) => {
    try {
      await createAssignment({
        course_id: courseId,
        term: values.term,
        name: values.name,
        description: values.description,
        datetime: datetime.toISOString(),
        is_active: isActive,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          toastify("success", "Assignment Created");
          setShowAddAssignment(false);
        });
    } catch (err) {
      if (err?.data?.detail?.term[0]) {
        toastify("error", err?.data?.detail?.term[0]);
      } else if (err.data.detail?.non_field_errors[0]) {
        toastify("error", err.data.detail?.non_field_errors[0]);
      } else {
        toastify("error", "Error");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assignments"} />
        <Profile />
      </div>
      <div style={styles.filter}>
        <div style={{ alignItems: "center", display: "flex" }}>
          <Input
            size="default size"
            placeholder="Search by assignment title"
            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
            style={styles.search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
          {user?.role === "teacher" && (
            <Button
              type="primary"
              style={styles.btnAdd}
              icon={<img src={Plus} style={{ paddingRight: 5 }} />}
              onClick={() => setShowAddAssignment(true)}
            >
              Create assignment
            </Button>
          )}
        </div>
      </div>
      <Spin spinning={loading} size="large">
        <div style={{ minHeight: "70vh" }}>
          {assignments &&
            Object?.keys(assignments).map((time, index) => (
              <div key={index}>
                <div style={styles.timeCont}>
                  <div style={styles.dateTitle}>{time}</div>
                  <div style={styles.week}>{moment(time).format("dddd")}</div>
                </div>
                {assignments[time].map((item) => (
                  <Link
                    to={`/assignments/${item.id}`}
                    style={{ textDecoration: "none" }}
                    key={item.id}
                  >
                    <div style={styles.assItem}>
                      <div
                        style={{
                          ...styles.statusLine,
                          backgroundColor: returnColor(item),
                        }}
                      />
                      <div style={styles.assCont}>
                        <div style={{ display: "flex", flex: 1 }}>
                          <div>
                            <div style={styles.title}>{item?.name}</div>
                            {moment(item.datetime) < moment() ? (
                              <div style={styles.timeContainer}>
                                <div
                                  style={{
                                    ...styles.time,
                                    color: returnColor(item),
                                  }}
                                >
                                  Finished
                                </div>
                              </div>
                            ) : (
                              <div style={styles.timeContainer}>
                                <div style={styles.due}>Due</div>
                                <div
                                  style={{
                                    ...styles.time,
                                    color: returnColor(item),
                                  }}
                                >
                                  {returnDate(item.datetime)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <img
                          src={require("../../assets/icons/arrowcirlce.png")}
                          style={{ width: 20, height: 20 }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
        </div>
      </Spin>
      <AssignmentCreate
        show={showAddAssignment}
        setShow={setShowAddAssignment}
        handleAdd={handleAddAssignment}
        terms={terms}
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
  btnAdd: {
    backgroundColor: "#163A61",
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    display: "flex",
    fontWeight: 500,
    marginLeft: 16,
  },
  filter: {
    padding: 8,
    justifyContent: "flex-end",
    display: "flex",
  },
  assCont: {
    display: "flex",
    flex: 1,
    padding: "11px 20px 11px 10px",
    alignItems: "center",
  },
  timeContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 3,
    gap: 3,
  },
  dateTitle: {
    fontWeight: 600,
    fontSize: 18,
    color: "#4A4D58",
    marginRight: 5,
  },
  week: {
    fontWeight: 500,
    fontSize: 15,
    color: "#4A4D58A6",
  },
  timeCont: {
    display: "flex",
    alignItems: "center",
    paddingTop: 20,
  },
  statusLine: {
    width: 7,
    display: "flex",
    borderRadius: "8px 0px 0px 8px",
  },
  assItem: {
    display: "flex",
    borderRadius: 12,
    border: "1px solid #F1F1F1",
    justifyContent: "space-between",
    marginTop: 12,
    backgroundColor: "white",
  },
  assImg: {
    width: 34,
    height: 34,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    marginLeft: 12,
  },
  title: {
    fontWeight: 500,
    fontSize: 16,
    color: "#4A4D58",
    marginBottom: 8,
  },
  subtitle: {
    color: "#4A4D58A6",
    fontWeight: 400,
    fontSize: 14,
    textOverflow: "ellipsis",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 1,
    marginTop: 2,
  },
  turnIn: {
    color: "#F18D58",
    fontWeight: 700,
    fontSize: 14,
  },
  due: {
    color: "#A7A7A7",
    fontWeight: 600,
    fontSize: 13,
  },
  time: {
    fontWeight: 600,
    fontSize: 13,
  },
  deadline: {
    color: "#969696",
    fontWeight: 600,
    fontSize: 12,
  },
  search: {
    height: 40,
    width: 280,
    border: "1px solid #DADADA",
    borderRadius: 8,
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.07)",
  },
};
export default AssignmentsCourse;
