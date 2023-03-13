import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { Input, Select } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
const AddingUserModal = ({ showAddUser, setShowAddUser }) => {
  return (
    <div style={{ ...styles.wrapper, right: showAddUser ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>New User</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => setShowAddUser(false)}
        />
      </div>
      <div style={styles.content}>
        <div>
          <p style={styles.contentTitle}>User</p>
          <Input placeholder="First name" style={styles.input} />
          <Input placeholder="Last name" style={styles.input} />
          <Input placeholder="Phone number" style={styles.input} />
          <Input placeholder="Username" style={styles.input} />
        </div>
        <div>
          <p style={styles.contentTitle}>Role</p>
          <Select
            defaultValue="student"
            style={{
              width: "100%",
            }}
            size={"middle"}
            options={[
              {
                value: "student",
                label: "Student",
              },
              {
                value: "teacher",
                label: "Teacher",
              },
              {
                value: "manager",
                label: "Manager",
              },
            ]}
          />
        </div>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            <button type="submit" disabled={isSubmitting}>
              Submit
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
  input: {
    marginBottom: 10,
  },
};

export default AddingUserModal;
