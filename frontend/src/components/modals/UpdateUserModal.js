import React from "react";
import Cancel from "../../assets/icons/close.svg";
import InputMask from "react-input-mask";
import "./Modals.css";
import TextField from "@mui/material/TextField";
import { Checkbox } from "antd";

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

const UpdateUserModal = ({
  showUpdateUser,
  setShowUpdateUser,
  user,
  setUser,
  handleUpdateUser,
}) => {
  const [values, setValues] = React.useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    telegram_id: "",
    date_of_birth: "",
    role: "",
    gender: "",
    avatar: "",
    is_active: "",
  });

  const {
    email,
    first_name,
    last_name,
    phone,
    telegram_id,
    date_of_birth,
    role,
    gender,
    avatar,
    is_active,
  } = values;

  React.useEffect(() => {
    if (user) {
      setValues({ ...user });
    }
  }, [user]);

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    if (name === "is_active") {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  return (
    <div style={{ ...styles.wrapper, right: showUpdateUser ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>{"Update User"}</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowUpdateUser(false);
            setUser();
          }}
        />
      </div>
      <div style={styles.form} onSubmit={handleUpdateUser}>
        <p style={styles.contentTitle}>User</p>
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="First Name"
          variant="outlined"
          type="text"
          className="input"
          name="first_name"
          value={first_name}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Last Name"
          variant="outlined"
          type="text"
          className="input"
          name="last_name"
          value={last_name}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Email"
          variant="outlined"
          type="text"
          className="input"
          name="email"
          value={email}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Phone"
          variant="outlined"
          type="text"
          className="input"
          name="phone"
          value={phone}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            inputComponent: NumericFormatCustom,
          }}
        />
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Telegram ID"
          variant="outlined"
          type="text"
          className="input"
          name="telegram_id"
          value={telegram_id}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label="Date of birth"
          variant="outlined"
          type="text"
          className="input"
          name="date_of_birth"
          value={date_of_birth}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            inputComponent: DateMask,
          }}
        />
        <br />
        <div>
          <Checkbox
            checked={is_active}
            onChange={handleInputChange}
            name="is_active"
            style={{ fontWeight: 400, fontSize: 16 }}
          >
            Active
          </Checkbox>
        </div>
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateUser(values)}
        >
          Update user
        </button>
      </div>
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
    borderRadius: 3,
    padding: "10px",
    marginTop: 15,
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
  },
};

export default UpdateUserModal;
