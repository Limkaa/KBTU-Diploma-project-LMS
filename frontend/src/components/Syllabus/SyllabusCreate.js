import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { Checkbox } from "antd";

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

const SyllabusCreate = ({
  setShowAddSyllabus,
  showAddSyllabus,
  handleAddSyllabus,
}) => {
  const [hours, setHours] = React.useState(1);
  const [isCompleted, setIsCompleted] = React.useState(false);

  return (
    <div style={{ ...styles.wrapper, right: showAddSyllabus ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Create Syllabus Point</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddSyllabus(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          name: "",
          description: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setShowAddSyllabus(false);

          handleAddSyllabus(values, hours, isCompleted);
          resetForm({
            values: {
              name: "",
              description: "",
            },
          });
          setHours(1);
          setIsCompleted(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Syllabus Point</p>
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
            <div style={styles.contHour}>
              <div style={styles.hourTitle}>Hours</div>
              <div style={styles.cnt}>
                <button
                  type="button"
                  style={styles.btnCnt}
                  onClick={() => setHours(hours - 1)}
                  disabled={hours === 1}
                >
                  -
                </button>
                <div style={styles.hour}>{hours}</div>
                <button
                  type="button"
                  onClick={() => setHours(hours + 1)}
                  style={styles.btnCnt}
                >
                  +
                </button>
              </div>
            </div>
            <br />
            <div>
              <Checkbox
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
                style={{ fontWeight: 400, fontSize: 15 }}
              >
                Completed
              </Checkbox>
            </div>
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create syllabus point
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
  hourTitle: {
    fontWeight: 600,
    color: "#4A4D58",
    fontSize: 14,
  },
  contentTitle: {
    fontWeight: 600,
    color: "#4A4D58",
    fontSize: 15,
    marginBottom: 20,
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
  contHour: {
    display: "flex",
    justifyContent: "space-between",
  },
  cnt: {
    display: "flex",
  },
  btnCnt: {
    border: "none",
    borderRadius: 12,
    backgroundColor: "#163A61",
    fontWeight: 500,
    color: "white",
    fontSize: 18,
    width: 25,
  },
  hour: {
    fontWeight: 500,
    fontSize: 16,
    padding: "0px 10px",
  },
};

export default SyllabusCreate;
