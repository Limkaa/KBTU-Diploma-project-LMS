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

const InputStyled = styled(TextField)(({ theme }) => ({
  "& fieldset": {
    borderRadius: "10px",
  },
  "& input": {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: 500,
  },
}));

const CoursesSchoolAdd = ({
  showAddCourse,
  setShowAddCourse,
  years,
  groups,
  teachers,
  subjects,
}) => {
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
          is_active: true,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.grade) {
            errors.grade = "Required";
          }
          if (!values.name) {
            errors.name = "Required";
          }
          if (!values.code) {
            errors.code = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          setShowAddCourse(false);
          //   handleAddSubject(values);
          resetForm({
            values: {
              year: "",
              subject: "",
              teacher: "",
              group: "",
              is_active: true,
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Subject</p>
            <div style={{ margin: 6 }} />
            <Field name="grade">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="grade">Grade</InputLabel>
                    <Select labelId="grade" id="grade" label="Grade" {...field}>
                      <MenuItem value="" disabled>
                        <em>Choose grade</em>
                      </MenuItem>
                      {/* {grades?.map((item) => (
                        <MenuItem value={item.id} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))} */}
                    </Select>
                  </FormControl>
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create subject
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
