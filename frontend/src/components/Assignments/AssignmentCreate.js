import React, { useContext } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Checkbox, TimePicker, DatePicker, Tag } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";
import moment from "moment-timezone";

const InputStyled = styled(TextField)`
  .MuiInputBase-root {
    border-radius: 8px;
  }
  .MuiFormLabel-root {
    font-family: "Open Sans";
    font-weight: 400;
    font-size: 15px;
  }
  .MuiInputBase-input {
    font-family: "Open Sans";
    font-weight: 400;
    font-size: 15px;
  }
`;

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
    font-weight: 400;
  }
  &.ant-picker-focused {
    border: 1px solid #277ed4;
    box-shadow: none;
  }
`;

const AssignmentCreate = ({
  show,
  setShow,
  handleAdd,
  terms,
  selectedYear,
  years,
  courses,
  setSelectedYear,
}) => {
  console.log("courses", courses);
  const [isActive, setIsActive] = React.useState(true);
  const [datetime, setDatetime] = React.useState(dayjs());
  return (
    <div style={{ ...styles.wrapper, right: show ? "0" : "-35%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Create Assignment</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShow(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          course: "",
          term: "",
          name: "",
          description: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.term) {
            errors.term = "Required";
          }
          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          handleAdd(values, isActive, datetime);
          resetForm({
            values: {
              course: "",
              term: "",
              name: "",
              description: "",
            },
          });
          setIsActive(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Assignment</p>
            {years && (
              <>
                <FormControl
                  sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                  size="small"
                >
                  <InputLabel id="year">Year</InputLabel>
                  <Select
                    labelId="year"
                    id="year"
                    value={selectedYear || ""}
                    label="Year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <MenuItem value="" disabled>
                      <em>Choose year</em>
                    </MenuItem>
                    {years?.map((item) => (
                      <MenuItem value={item.id} key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div style={{ margin: 6 }} />
              </>
            )}

            <Field name="term">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{
                      width: "100%",
                      fontSize: 15,
                      fieldset: { borderRadius: "10px" },
                    }}
                    size="small"
                  >
                    <InputLabel id="term">Term</InputLabel>
                    <Select labelId="term" id="term" label="Term" {...field}>
                      <MenuItem value="" disabled>
                        <em>Choose term</em>
                      </MenuItem>
                      {terms?.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          <div>
                            {item.name}{" "}
                            <Tag color={"geekblue"}>
                              From{" "}
                              {moment(item.from_date).format("DD MMM YYYY")} to{" "}
                              {moment(item.to_date).format("DD MMM YYYY")}
                            </Tag>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <div style={{ margin: 6 }} />
            {courses && (
              <>
                <Field name="course">
                  {({ field, form: { touched, errors } }) => (
                    <>
                      <FormControl
                        sx={{
                          width: "100%",
                          fontSize: 15,
                          fieldset: { borderRadius: "10px" },
                        }}
                        size="small"
                      >
                        <InputLabel id="course">Course</InputLabel>
                        <Select
                          labelId="course"
                          id="course"
                          label="Course"
                          {...field}
                        >
                          <MenuItem value="" disabled>
                            <em>Choose course</em>
                          </MenuItem>
                          {courses?.map((item) => (
                            <MenuItem value={item.id} key={item.id}>
                              <div>
                                {item?.subject?.name}{" "}
                                <Tag color={"geekblue"}>
                                  {item?.subject?.grade?.name}
                                </Tag>
                              </div>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched[field.name] && errors[field.name] && (
                        <div className="error">{errors[field.name]}</div>
                      )}
                    </>
                  )}
                </Field>
                <div style={{ margin: 6 }} />
              </>
            )}
            <Field name="name">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Name"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <div style={{ margin: 6 }} />
            <Field name="description">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    type="description"
                    label="Description"
                    variant="outlined"
                    className="input"
                    size="small"
                    multiline
                    minRows={4}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <div style={{ margin: 6 }} />
            <Picker
              value={datetime}
              onChange={(value) => setDatetime(value)}
              showTime
            />
            <div style={{ margin: 6 }} />
            <div>
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ fontWeight: 400, fontSize: 15 }}
              >
                Active
              </Checkbox>
            </div>
            <br />
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create assignment
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "white",
    padding: "20px 0 0 0",
    position: "fixed",
    transition: "all 0.3s",
    top: 0,
    width: "35%",
    height: "100%",
    zIndex: 1,
    borderTopLeftRadius: 20,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 16px 16px 16px",
    borderBottom: "1px solid #0000000D",
  },
  headerTitle: {
    fontWeight: 600,
    color: "#4A4D58",
    fontSize: 24,
  },
  close: {
    cursor: "pointer",
    padding: 5,
  },
  content: {
    padding: "0 16px 16px 16px",
  },
  contentTitle: {
    fontWeight: 600,
    color: "#4A4D58",
    fontSize: 15,
  },
  form: {
    flexDirection: "column",
    display: "flex",
    padding: "0 16px 16px 16px",
  },
  input: {
    border: "1px solid #DFDFDF",
    borderRadius: 8,
    padding: "8px 10px",
    marginBottom: 5,
    marginTop: 5,
  },
  inputTitle: {
    fontWeight: 500,
    color: "#B6C3D8",
    fontSize: 13,
    marginBottom: 5,
  },
  select: {
    width: "100%",
    padding: "8px 5px",
    border: "1px solid #DFDFDF",
    borderRadius: 8,
  },
  option: {
    padding: 10,
  },
  btn: {
    border: "1px solid #163A61",
    borderRadius: 10,
    padding: "10px",
    marginTop: 15,
    fontWeight: 500,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default AssignmentCreate;
