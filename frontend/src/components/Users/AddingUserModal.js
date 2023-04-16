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

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  return (
    <InputMask
      {...props}
      placeholder="8 (___) - __ - __ - __"
      mask="9 (999)-999-99-99"
      maskChar={null}
    />
  );
});

const DateMask = React.forwardRef(function NumericFormatCustom(props, ref) {
  return (
    <InputMask
      {...props}
      placeholder="YYYY-MM-DD"
      mask="9999-99-99"
      maskChar={null}
    />
  );
});

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

const AddingUserModal = ({
  showAddUser,
  setShowAddUser,
  user,
  refetch,
  refetchUser,
}) => {
  const [role, setRole] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [avatar, setAvatar] = React.useState(null);
  const [error, setError] = React.useState(false);
  const removeSpecSymbols = (str) => str.replace(/[^A-Z0-9]/gi, "");

  const [addUser] = useAddUserMutation();

  const handleSubmit = async (values, phone) => {
    try {
      await addUser({
        school_id: user?.school_id,
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        date_of_birth: values.date_of_birth,
        telegram_id: values.telegram_id,
        phone,
        role,
        gender,
        avatar,
      })
        .unwrap()
        .then((payload) => {
          refetch();
          refetchUser();
          toast.success("User Added", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            theme: "colored",
          });
        });
    } catch (err) {
      console.log(err);
      toast.error("Error", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        theme: "colored",
      });
    }
  };

  return (
    <div style={{ ...styles.wrapper, right: showAddUser ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>{"New User"}</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddUser(false);
          }}
        />
      </div>
      <Formik
        initialValues={{
          email: "",
          password: "",
          first_name: "",
          last_name: "",
          phone: "",
          telegram_id: "",
          date_of_birth: "",
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
          if (!values.date_of_birth) {
            errors.date_of_birth = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const phoneFormat = `8${removeSpecSymbols(values.phone)}`;
          setSubmitting(false);
          if (gender && role) {
            setShowAddUser(false);
            handleSubmit(values, phoneFormat);
          } else {
            setError(true);
          }
          resetForm();
          setRole("");
          setGender("");
        }}
      >
        {({ isSubmitting }) => (
          <Form style={styles.form}>
            <p style={styles.contentTitle}>User</p>
            <Field name="first_name">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="First Name"
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
            <Field name="last_name">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Last Name"
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
            <Field name="email">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    type="email"
                    label="Email"
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
            <div style={{ margin: 6 }} />
            <Field name="password">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Password"
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
            <div style={{ margin: 6 }} />
            <Field name="phone">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Phone"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                    InputProps={{
                      inputComponent: NumericFormatCustom,
                    }}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <div style={{ margin: 6 }} />
            <Field name="telegram_id">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Telegram ID"
                    variant="outlined"
                    type="text"
                    size="small"
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>
            <div style={{ margin: 6 }} />
            <Field name="date_of_birth">
              {({ field, form: { touched, errors } }) => (
                <>
                  <InputStyled
                    {...field}
                    label="Date of birth"
                    variant="outlined"
                    type="text"
                    size="small"
                    InputProps={{
                      inputComponent: DateMask,
                    }}
                  />
                  {touched[field.name] && errors[field.name] && (
                    <div className="error">{errors[field.name]}</div>
                  )}
                </>
              )}
            </Field>

            <div style={{ margin: 6 }} />
            <FormControl
              sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
              size="small"
            >
              <InputLabel id="role">Role</InputLabel>
              <Select
                labelId="role"
                id="role"
                value={role}
                label="Role"
                defaultValue={""}
                onChange={(event) => setRole(event.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>Choose role</em>
                </MenuItem>
                <MenuItem value={"student"}>Student</MenuItem>
                <MenuItem value={"manager"}>Manager</MenuItem>
                <MenuItem value={"teacher"}>Teacher</MenuItem>
              </Select>
              {error && <div className="error">{"Required"}</div>}
            </FormControl>
            <div style={{ margin: 6 }} />
            <FormControl
              sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
              size="small"
            >
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender"
                id="gender"
                value={gender}
                label="Gender"
                defaultValue={""}
                onChange={(event) => setGender(event.target.value)}
              >
                <MenuItem value="" disabled>
                  <em>Choose gender</em>
                </MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"male"}>Male</MenuItem>
              </Select>
              {error && <div className="error">{"Required"}</div>}
            </FormControl>
            {/* <label
              htmlFor="upload-photo"
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
            /> */}
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
    borderRadius: 10,
    padding: "10px",
    marginTop: 15,
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default AddingUserModal;
