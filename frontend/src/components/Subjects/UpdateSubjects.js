import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Checkbox } from "antd";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

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

const UpdateSubjects = ({
  subject,
  setSubject,
  showUpdateSubject,
  setShowUpdateSubject,
  handleUpdateSubject,
  grades,
}) => {
  const [values, setValues] = React.useState({
    name: "",
    code: "",
    description: "",
    grade: "",
    is_active: "",
  });

  const { name, code, description, is_active, grade } = values;

  React.useEffect(() => {
    if (subject) {
      setValues({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        grade: subject.grade.id,
        is_active: subject.is_active,
      });
    }
  }, [subject]);

  console.log("val", values);

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    if (name === "is_active") {
      setValues({ ...values, [name]: checked });
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  return (
    <div style={{ ...styles.wrapper, right: showUpdateSubject ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Update Subject</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowUpdateSubject(false);
            setSubject();
          }}
        />
      </div>
      <div style={styles.form}>
        <p style={styles.contentTitle}>Subject</p>
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
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Code"
          variant="outlined"
          type="text"
          className="input"
          name="code"
          value={code || ""}
          onChange={handleInputChange}
          size="small"
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Description"
          variant="outlined"
          type="text"
          className="input"
          name="description"
          value={description || ""}
          onChange={handleInputChange}
          size="small"
          multiline
          minRows={4}
        />
        <br />
        <FormControl
          sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
          size="small"
        >
          <InputLabel id="grade">Grade</InputLabel>
          <Select
            labelId="grade"
            id="grade"
            value={grade || ""}
            name="grade"
            label="Grade"
            onChange={handleInputChange}
          >
            <MenuItem value="" disabled>
              <em>Choose grade</em>
            </MenuItem>
            {grades?.map((item) => (
              <MenuItem value={item.id} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateSubject(values)}
        >
          Update subject
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

export default UpdateSubjects;
