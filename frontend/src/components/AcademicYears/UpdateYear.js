import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Checkbox } from "antd";
import InputMask from "react-input-mask";

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

const UpdateYear = ({
  year,
  setYear,
  showUpdateYear,
  setShowUpdateYear,
  handleUpdateYear,
}) => {
  const [values, setValues] = React.useState({
    name: "",
    is_active: "",
    is_opened_to_marks: "",
  });

  const { name, is_active, is_opened_to_marks } = values;

  React.useEffect(() => {
    if (year) {
      setValues({ ...year });
    }
  }, [year]);

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    if (name === "is_active") {
      setValues({ ...values, [name]: checked });
    } else if (name === "is_opened_to_marks") {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };
  return (
    <div style={{ ...styles.wrapper, right: showUpdateYear ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Update Academic Year</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowUpdateYear(false);
          }}
        />
      </div>
      <div style={styles.form}>
        <p style={styles.contentTitle}>Academic Year</p>
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Name"
          variant="outlined"
          type="text"
          className="input"
          name="name"
          value={name || ""}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            inputComponent: YearMask,
          }}
        />
        <br />
        <div>
          <Checkbox
            checked={is_active || false}
            onChange={handleInputChange}
            name="is_active"
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Active
          </Checkbox>
        </div>
        <div>
          <Checkbox
            checked={is_opened_to_marks || false}
            onChange={handleInputChange}
            name="is_opened_to_marks"
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Opened to marks
          </Checkbox>
        </div>
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateYear(values)}
        >
          Update year
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
  btn: {
    border: "1px solid #163A61",
    borderRadius: 10,
    padding: "10px",
    marginTop: 15,
    fontWeight: 600,
    color: "white",
    fontSize: 16,
    backgroundColor: "#163A61",
    cursor: "pointer",
  },
};

export default UpdateYear;
