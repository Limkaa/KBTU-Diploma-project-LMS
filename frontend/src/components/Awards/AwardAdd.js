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
  "& .MuiOutlinedInput-root": {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: 500,
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #163A61",
    },
  },
}));

const AwardAdd = ({ setShow, show, handle }) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Create Award</div>
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
          name: "",
          description: "",
          points: 0,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "Required";
          }
          if (!values.points) {
            errors.points = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setShow(false);
          handle(values, isActive);
          resetForm({
            values: {
              name: "",
              description: "",
              points: 0,
            },
          });
          setIsActive(false);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>New Award</p>
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
            <Field name="points">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    type="number"
                    label="Points"
                    variant="outlined"
                    className="input"
                    size="small"
                  />
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
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create award
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
    boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.06)",
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
    fontSize: 15,
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

export default AwardAdd;
