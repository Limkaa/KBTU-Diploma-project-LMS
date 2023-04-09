import React, { useContext } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import InputMask from "react-input-mask";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { toast } from "react-toastify";
import { useAddUserMutation } from "../../redux/users/usersApiSlice";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Checkbox } from "antd";
import dayjs from "dayjs";
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

const DatePickerStyled = styled(DatePicker)(({ theme }) => ({
  "& fieldset": {
    borderRadius: "10px",
  },
  "& input": {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: 500,
  },
}));

const AddTerm = ({ showAddTerm, setShowAddTerm, years, handleAddTerm }) => {
  const [start, setStart] = React.useState(dayjs());
  const [end, setEnd] = React.useState(dayjs());

  return (
    <div style={{ ...styles.wrapper, right: showAddTerm ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Add Term</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddTerm(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          year: "",
          name: "",
          is_closed: false,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.year) {
            errors.year = "Required";
          }
          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          setShowAddTerm(false);
          handleAddTerm(values, start, end);
          resetForm({
            values: {
              year: "",
              name: "",
              is_closed: false,
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>Term</p>
            <div style={{ margin: 6 }} />
            <Field name="name">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Name"
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
            <div style={{ margin: 10 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePickerStyled
                label={"Start Date"}
                format="YYYY-MM-DD"
                value={start}
                onChange={(value) => setStart(value)}
              />
            </LocalizationProvider>

            <div style={{ margin: 10 }} />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePickerStyled
                label={"End Date"}
                format="YYYY-MM-DD"
                value={end}
                onChange={(value) => setEnd(value)}
              />
            </LocalizationProvider>
            <div style={{ margin: 6 }} />
            <Field name="year">
              {({ field, form: { touched, errors } }) => (
                <>
                  <FormControl
                    sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                    size="small"
                  >
                    <InputLabel id="year">Academic Year</InputLabel>
                    <Select
                      labelId="year"
                      id="year"
                      label="Academic Year"
                      {...field}
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
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create term
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

export default AddTerm;
