import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAssignmentQuery } from "../../redux/assignments/assignmentsApiSlice";
import { Button, Spin, Input, DatePicker, Checkbox, Tabs } from "antd";
import moment from "moment-timezone";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import styled from "styled-components";
import dayjs from "dayjs";
import Cancel from "../../assets/icons/close.svg";
import { toastify } from "../shared/Toast/Toast";
import {
  useDeleteAssignmentMutation,
  useUpdateAssignmentMutation,
} from "../../redux/assignments/assignmentsApiSlice";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import Back from "../shared/Back";
import "./Assignments.css";
import useWindowDimensions from "../shared/WindowDimensions";

const Picker = styled(DatePicker)`
  &.ant-picker .ant-picker-input > input::placeholder {
    color: #666666;
    font-size: 15px;
  }
  &.ant-picker .ant-picker-input > input {
    font-size: 15px;
  }
  &.ant-picker {
    border: 1px solid #cbcbcb;
    border-radius: 8px;
    padding: 8px 12px;
    font-family: "Open Sans";
    font-weight: 400px;
  }
  &.ant-picker-focused {
    border: 1px solid #277ed4;
    box-shadow: none;
  }
`;

const Assignment = () => {
  const { id: assignment_id } = useParams();
  const [assignment, setAssignment] = React.useState();
  const [edit, setEdit] = React.useState(false);
  const [datetime, setDatetime] = React.useState("");
  const navigate = useNavigate();
  const { data: user } = useGetAuthUserQuery();
  const { height, width } = useWindowDimensions();

  const [updateAssignment] = useUpdateAssignmentMutation();
  const [deleteAssignment] = useDeleteAssignmentMutation();

  const [values, setValues] = React.useState({
    name: "",
    description: "",
    is_active: "",
  });
  const { name, description, is_active } = values;

  const { data, isLoading, refetch } = useGetAssignmentQuery({
    assignment_id,
  });

  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery({
    id: assignment?.course?.id,
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      setAssignment(data);
    }
  }, [data, isLoading]);

  React.useEffect(() => {
    if (assignment) {
      setValues({ ...assignment });
      setDatetime(assignment?.datetime);
    }
  }, [assignment]);

  const handleUpdateAssignment = async () => {
    try {
      await updateAssignment({
        assignment_id: assignment.id,
        name: values.name,
        description: values.description,
        datetime:
          assignment.datetime === datetime ? datetime : datetime.toISOString(),
        is_active: values.is_active,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Assignment Updated");
          refetch();
          setEdit(false);
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

  const handleDeleteAssignment = async () => {
    try {
      await deleteAssignment({
        assignment_id: assignment.id,
      })
        .unwrap()
        .then((payload) => {
          toastify("success", "Assignment Deleted");
          refetch();
          navigate(-1);
          setEdit(false);
        });
    } catch (err) {
      toastify("error", "Error");
    }
  };

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    if (name === "is_active") {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

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

  return (
    <div style={{ ...styles.main, minHeight: height / 2 }}>
      <Spin spinning={isLoading} size="large">
        <Back />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: 16,
          }}
        >
          <div style={{ width: "100%" }}>
            <div style={styles.subject}>{courseData?.subject?.name}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div>
                {edit ? (
                  <Input
                    placeholder="Title"
                    style={{
                      ...styles.name,
                      border: "none",
                      borderBottom: "1px solid #00000038",
                      padding: 0,
                      boxShadow: "none",
                      borderRadius: 0,
                    }}
                    value={name}
                    name="name"
                    onChange={handleInputChange}
                  />
                ) : (
                  <div style={styles.name}>{assignment?.name}</div>
                )}
                {edit ? (
                  <Picker
                    onChange={(value) => setDatetime(value)}
                    showTime
                    defaultValue={dayjs(datetime)}
                    style={{
                      ...styles.due,
                      border: "none",
                      borderBottom: "1px solid #00000038",
                      padding: 0,
                      boxShadow: "none",
                      borderRadius: 0,
                      marginTop: 10,
                    }}
                  />
                ) : (
                  <div style={styles.due}>
                    Due {returnDate(assignment?.datetime)}
                  </div>
                )}
              </div>
              {!edit && user?.role === "teacher" && (
                <img
                  src={require("../../assets/icons/edit.png")}
                  style={styles.imgEdit}
                  onClick={() => setEdit(true)}
                />
              )}
            </div>
            <div style={styles.des}>
              <div style={styles.desTitle}>Description</div>
              {edit ? (
                <Input.TextArea
                  rows={4}
                  placeholder="Description"
                  value={description}
                  style={{ width: "80%" }}
                  name="description"
                  onChange={handleInputChange}
                />
              ) : (
                <div style={styles.desText}>{assignment?.description}</div>
              )}
            </div>
            {edit && (
              <Checkbox
                checked={is_active}
                style={{ fontWeight: 400, fontSize: 15, marginTop: 10 }}
                name="is_active"
                onChange={handleInputChange}
              >
                Active
              </Checkbox>
            )}
          </div>
          {edit && (
            <img
              src={Cancel}
              style={styles.close}
              onClick={() => {
                setEdit(false);
              }}
            />
          )}
        </div>

        {edit && (
          <div
            style={{
              marginTop: 40,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button style={styles.btn1} onClick={handleUpdateAssignment}>
              Save
            </Button>
            <Button style={styles.btn2} onClick={handleDeleteAssignment}>
              Delete
            </Button>
          </div>
        )}
      </Spin>
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
  sections: {
    display: "flex",
    flexFrow: 1,
  },
  close: {
    cursor: "pointer",
    padding: 5,
  },
  main: {
    backgroundColor: "white",
    marginTop: 15,
    padding: 20,
    borderRadius: 8,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.05)",
  },
  name: {
    fontWeight: 600,
    fontSize: 22,
    color: "#4A4D58",
    marginTop: 3,
  },
  due: {
    color: "#4A4D58A6",
    fontWeight: 500,
    fontSize: 14,
  },
  subject: {
    color: "#4A4D58",
    fontWeight: 500,
    fontSize: 15,
  },
  des: {
    marginTop: 25,
    width: "55%",
  },
  desTitle: {
    color: "#4A4D58A6",
    fontWeight: 500,
    fontSize: 15,
    marginBottom: 6,
  },
  desText: {
    fontWeight: 400,
    fontSize: 15,
    color: "#4A4D58",
  },
  imgEdit: {
    width: 25,
    height: 25,
    paddingTop: 5,
    cursor: "pointer",
  },
  btn1: {
    backgroundColor: "#163A61",
    color: "white",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
  btn2: {
    backgroundColor: "#F20303",
    color: "white",
    fontWeight: 500,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
    marginRight: 10,
  },
};

export default Assignment;
