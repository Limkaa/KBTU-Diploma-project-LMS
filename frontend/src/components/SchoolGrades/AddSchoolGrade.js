import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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

const ButtonStyled = styled(Button)(({ theme }) => ({
  backgroundColor: "#163A61",
  borderRadius: "10px",
}));

const AddSchoolGrade = ({
  showAddSchoolGrade,
  setShowAddSchoolGrade,
  handleCreateGrade,
}) => {
  const [values, setValues] = React.useState({
    name: "",
  });

  const { name } = values;

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <div
      style={{ ...styles.wrapper, right: showAddSchoolGrade ? "0" : "-30%" }}
    >
      <div style={styles.header}>
        <div style={styles.headerTitle}>New Grade</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowAddSchoolGrade(false);
          }}
        />
      </div>
      <div style={styles.form}>
        <p style={styles.contentTitle}>Grade</p>
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
          value={name}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleCreateGrade(values)}
        >
          Create grade
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
  },
};

export default AddSchoolGrade;
