import React, { useState } from "react";
import Cancel from "../../assets/icons/close.svg";
import { Formik, Form, Field } from "formik";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCreateGroupMutation } from "../../redux/groups/groupsApiSlice";
import "./GroupsPage.css";
import { useGetTeachersQuery } from "../../redux/users/usersApiSlice";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import { toastify } from "../../components/shared/Toast/Toast";

const InputStyled = styled(TextField)(() => ({
  "& fieldset": {
    borderRadius: "10px",
  },
  "& input": {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: 500,
  },
}));

const CreateGroupModal = ({ show, setShow, refetch }) => {
  const user = useSelector(selectCurrentUser);
  const { data: teachers } = useGetTeachersQuery(user.school_id);
  const { data: grades } = useGetSchoolGradesWithoutPageQuery({
    school_id: user.school_id,
  });
  const [teacher, setTeacher] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState(false);

  const [addGroup] = useCreateGroupMutation();

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      await addGroup({
        school: user.school_id,
        grade: grade,
        teacher: teacher,
        code: values.code,
        is_active: values.isActive,
      })
        .unwrap()
        .then(() => {
          refetch();
          toastify("success", "Group added");
        });
    } catch (err) {
      let message = err.data.detail?.non_field_errors[0] ?? "Error";
      toastify("error", message);
    }
  };

  return (
    <div style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>New Group</div>
        <img
          alt="cancel"
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShow(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          code: "",
          isActive: false,
        }}
        validate={(values) => {
          const errors = {};
          if (!/^[a-zA-Z\d]+$/.test(values.code)) {
            errors.code = "Code allows only letters and numbers";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          if (teacher !== "" && grade !== "" && values.code !== "") {
            setShow(false);
            handleSubmit(values);
            resetForm();
            setTeacher("");
            setGrade("");
          } else {
            setError(true);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="modal" style={styles.form}>
            <p style={styles.contentTitle}>Group</p>
            <Field name="code">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Code"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                  />
                  <div
                    className={
                      touched[field.name] && errors[field.name]
                        ? "error"
                        : "hidden"
                    }
                  >
                    {errors[field.name]}
                  </div>
                </>
              )}
            </Field>
            <FormControl
              sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
              size="small"
            >
              <InputLabel id="grade">Grade</InputLabel>
              <Select
                labelId="grade"
                id="grade"
                // defaultValue={teacherOptions[0]}
                value={grade}
                label="Grade"
                onChange={(e) => {
                  setGrade(e.target.value);
                }}
              >
                {grades?.map((grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
              </Select>
              <div style={{ height: 10 }}></div>
            </FormControl>
            <FormControl
              sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
              size="small"
            >
              <InputLabel id="teacher">Teacher</InputLabel>
              <Select
                labelId="teacher"
                id="teacher"
                // defaultValue={teacherOptions[0]}
                value={teacher}
                label="Teacher"
                onChange={(e) => {
                  setTeacher(e.target.value);
                }}
              >
                {teachers?.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {`${teacher.first_name} ${teacher.last_name}`}
                  </MenuItem>
                ))}
              </Select>
              <div className={error ? "error" : "hidden"}>
                All fields are required
              </div>
            </FormControl>
            <label>
              <Field type="checkbox" name="isActive" />
              Is active
            </label>
            <button type="submit" disabled={isSubmitting} style={styles.btn}>
              Create group
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
    marginTop: 30,
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default CreateGroupModal;
