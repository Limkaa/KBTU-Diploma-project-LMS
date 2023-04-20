import React from "react";
import { useParams } from "react-router-dom";
import { useGetAssignmentQuery } from "../../redux/assignments/assignmentsApiSlice";
import Header from "../shared/Header/Header";
import Profile from "../Dashboard/Profile";
import { Button, Spin, Input, DatePicker, Checkbox } from "antd";
import moment from "moment-timezone";
import { useGetCourseQuery } from "../../redux/courses/coursesApiSlice";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import styled from "styled-components";
import dayjs from "dayjs";
import Cancel from "../../assets/icons/close.svg";
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

  const [values, setValues] = React.useState({
    name: "",
    description: "",
    is_active: "",
  });
  const { name, description, is_active } = values;

  const { data, isLoading } = useGetAssignmentQuery({
    assignment_id,
  });
  const { data: courseData, isLoading: isLoadingCourse } = useGetCourseQuery({
    id: assignment?.course,
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

  console.log(datetime);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Header text={"Assignment"} />
        <Profile />
      </div>
      <div style={styles.main}>
        <Spin spinning={isLoading} size="large">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
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
                {!edit && (
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
                    maxLength={6}
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
              <Button style={styles.btn1}>Save</Button>
              <Button style={styles.btn2}>Delete</Button>
            </div>
          )}
        </Spin>
      </div>
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
  main: {
    backgroundColor: "white",
    marginTop: 25,
    padding: 20,
    borderRadius: 8,
    minHeight: "60%",
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
    fontSize: 14,
    marginBottom: 6,
  },
  desText: {
    fontWeight: 400,
    fontSize: 14,
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
