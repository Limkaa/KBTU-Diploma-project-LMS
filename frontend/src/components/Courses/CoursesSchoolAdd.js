import React, { useContext } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { Checkbox } from "antd";
const CoursesSchoolAdd = ({
  showAddCourse,
  setShowAddCourse,
  years,
  groups,
  teachers,
  subjects,
  handleAddCourse,
}) => {
  const [isActive, setIsActive] = React.useState(true);
  return (
    <div style={{ ...styles.wrapper, right: showAddCourse ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Add Course</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddCourse(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          year: "",
          subject: "",
          teacher: "",
          group: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.year) {
            errors.year = "Required";
          }
          if (!values.subject) {
            errors.subject = "Required";
          }
          if (!values.group) {
            errors.group = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          handleAddCourse(values, isActive);
          resetForm({
            values: {
              year: "",
              subject: "",
              teacher: "",
              group: "",
            },
          });
          setIsActive(true);
          setShowAddCourse(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Course</p>
            <br />
            <Field name="year">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="year">Year</InputLabel>
                    <Select labelId="year" id="year" label="Year" {...field}>
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
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <br />
            <Field name="subject">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="subject">Subject</InputLabel>
                    <Select
                      labelId="subject"
                      id="subject"
                      label="Subject"
                      {...field}
                    >
                      <MenuItem value="" disabled>
                        <em>Choose subject</em>
                      </MenuItem>
                      {subjects?.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name} ({item.code})
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
            <br />
            <Field name="teacher">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="teacher">Teacher</InputLabel>
                    <Select
                      labelId="teacher"
                      id="teacher"
                      label="Teacher"
                      {...field}
                    >
                      <MenuItem value="">
                        <em>Choose teacher</em>
                      </MenuItem>
                      {teachers?.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.first_name} {item.last_name}
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
            <br />
            <Field name="group">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="group">Group</InputLabel>
                    <Select labelId="group" id="group" label="Group" {...field}>
                      <MenuItem value="" disabled>
                        <em>Choose group</em>
                      </MenuItem>
                      {groups?.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.grade.name} ({item.code})
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
            <br />
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
              Create course
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
    width: "25%",
    height: "100%",
    zIndex: 1,
    borderTopLeftRadius: 20,
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
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default CoursesSchoolAdd;
