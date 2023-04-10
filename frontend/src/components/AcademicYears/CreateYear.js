import React, { useContext } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
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

const YearMask = React.forwardRef(function NumericFormatCustom(props, ref) {
  return (
    <InputMask
      {...props}
      placeholder="YYYY-YYYY"
      mask="9999-9999"
      maskChar={null}
    />
  );
});

const CreateYear = ({ setShowAddYear, showAddYear, handleAddYear }) => {
  return (
    <div style={{ ...styles.wrapper, right: showAddYear ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Create Academic Year</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddYear(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          name: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          setShowAddYear(false);
          handleAddYear(values);
          resetForm({
            values: {
              name: "",
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Academic Year</p>
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
                    InputProps={{
                      inputComponent: YearMask,
                    }}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create year
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
};

export default CreateYear;
