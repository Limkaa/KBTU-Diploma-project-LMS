import React from "react";
import Cancel from "../../assets/icons/close.svg";
import InputMask from "react-input-mask";
import "../modals/Modals.css";
import TextField from "@mui/material/TextField";
import { Checkbox } from "antd";
import { styled } from "@mui/material/styles";
import { styles } from "./AddingUserModal";

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
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #163A61",
    },
  },
}));

const UpdateUserModal = ({
  showUpdateUser,
  setShowUpdateUser,
  selectedUser,
  setSelectedUser,
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
    if (selectedUser) {
      setValues({ ...selectedUser });
    }
  }, [selectedUser]);

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
            setSelectedUser();
          }}
        />
      </div>
      <div style={styles.form} onSubmit={handleUpdateUser}>
        <p style={styles.contentTitle}>User</p>
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="First Name"
          variant="outlined"
          type="text"
          className="input"
          name="first_name"
          value={first_name || ""}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Last Name"
          variant="outlined"
          type="text"
          className="input"
          name="last_name"
          value={last_name || ""}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Email"
          variant="outlined"
          type="text"
          className="input"
          name="email"
          value={email || ""}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Phone"
          variant="outlined"
          type="text"
          className="input"
          name="phone"
          value={phone || ""}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            inputComponent: NumericFormatCustom,
          }}
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Telegram ID"
          variant="outlined"
          type="text"
          className="input"
          name="telegram_id"
          value={telegram_id || ""}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Date of birth"
          variant="outlined"
          type="text"
          className="input"
          name="date_of_birth"
          value={date_of_birth || ""}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            inputComponent: DateMask,
          }}
        />
        <br />
        <div>
          <Checkbox
            checked={is_active || false}
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

export default UpdateUserModal;
