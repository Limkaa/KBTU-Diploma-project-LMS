import React, { useContext } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Input, Select, DatePicker } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import InputMask from "react-input-mask";
import AuthContext from "../../context/AuthProvider";
import "./Modals.css";
import moment from "moment-timezone";

import { createUser } from "../../api";

const AddingUserModal = ({ showAddUser, setShowAddUser, user, setUser }) => {
  console.log(user);
  const [role, setRole] = React.useState(user ? user.role : "");
  const [gender, setGender] = React.useState(user ? user.gender : "");
  const [date, setDate] = React.useState(user ? user.date_of_birth : "");
  const { userInfo, authToken } = useContext(AuthContext);
  const [avatar, setAvatar] = React.useState(null);
  const [error, setError] = React.useState(false);
  const removeSpecSymbols = (str) => str.replace(/[^A-Z0-9]/gi, "");
  return (
    <div style={{ ...styles.wrapper, right: showAddUser ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          {user ? "Update User" : "New User"}
        </div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddUser(false);
            // setUser();
          }}
        />
      </div>
      <Formik
        initialValues={{
          email: user ? user?.email : "",
          password: user ? user?.password : "",
          first_name: user ? user?.first_name : "",
          last_name: user ? user?.last_name : "",
          phone: user ? user?.phone : "",
          telegram_id: user ? user?.telegram_id : "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          if (!values.first_name) {
            errors.first_name = "Required";
          }
          if (!values.last_name) {
            errors.last_name = "Required";
          }
          if (!values.phone) {
            errors.phone = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const phoneFormat = `8${removeSpecSymbols(values.phone)}`;
          setSubmitting(false);
          if (gender && role && date) {
            createUser(
              userInfo?.school_id,
              authToken,
              values,
              phoneFormat,
              role,
              gender,
              moment(date).format("YYYY-MM-DD"),
              avatar
            );
          } else {
            setError(true);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>User</p>
            <Field
              name="first_name"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <Input
                    {...field}
                    placeholder="First name"
                    defaultValue={field.value}
                    style={styles.input}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <Field
              name="last_name"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <Input
                    {...field}
                    placeholder="Last name"
                    defaultValue={field.value}
                    style={styles.input}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <Field
              name="email"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email"
                    style={styles.input}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <Field
              name="password"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Password"
                    style={styles.input}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <Field
              name="phone"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <InputMask
                    {...field}
                    style={styles.input}
                    className="phone_input"
                    placeholder="+7"
                    mask="+7 (999)-999-99-99"
                    maskChar={null}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <Field
              name="telegram_id"
              render={({ field, form: { touched, errors } }) => (
                <div>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Telegram ID"
                    style={styles.input}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </div>
              )}
            />
            <div>
              <DatePicker
                style={{ width: "100%" }}
                onChange={(value) => setDate(value)}
                placeholder="Date of birth"
              />
              {error && <div className="error">{"Required"}</div>}
            </div>
            <div>
              <p style={styles.contentTitle}>Role</p>
              <Select
                onChange={(value) => setRole(value)}
                style={{
                  width: "100%",
                }}
                defaultValue={role}
                size={"middle"}
                options={[
                  {
                    value: "student",
                    label: "Student",
                  },
                  {
                    value: "manager",
                    label: "Manager",
                  },
                  {
                    value: "teacher",
                    label: "Teacher",
                  },
                ]}
              />
              {error && <div className="error">{"Required"}</div>}
            </div>
            <div>
              <p style={styles.contentTitle}>Gender</p>
              <Select
                onChange={(value) => setGender(value)}
                style={{
                  width: "100%",
                }}
                size={"middle"}
                defaultValue={gender}
                options={[
                  {
                    value: "female",
                    label: "Female",
                  },
                  {
                    value: "male",
                    label: "Male",
                  },
                ]}
              />
              {error && <div className="error">{"Required"}</div>}
            </div>
            <label
              for="upload-photo"
              style={{ ...styles.contentTitle, marginTop: 15 }}
            >
              Upload avatar
            </label>
            <input
              type="file"
              name="photo"
              id="upload-photo"
              onChange={(event) => {
                setAvatar(event.target.files[0]);
              }}
            />
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create user
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
    borderRadius: 8,
    padding: "8px 10px",
    marginTop: 15,
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default AddingUserModal;