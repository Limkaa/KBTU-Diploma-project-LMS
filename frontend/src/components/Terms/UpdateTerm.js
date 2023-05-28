import React from "react";
import Cancel from "../../assets/icons/close.svg";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Checkbox } from "antd";
import InputMask from "react-input-mask";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

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

const UpdateTerm = ({
  years,
  showUpdateTerm,
  setShowUpdateTerm,
  term,
  handleUpdateTerm,
}) => {
  const [values, setValues] = React.useState({
    name: "",
    year: "",
    from_date: "",
    to_date: "",
    is_closed: "",
    // is_finished: "",
    // is_opened_to_final_marks: "",
  });

  const {
    name,
    year,
    from_date,
    to_date,
    is_closed,
    // is_finished,
    // is_opened_to_final_marks,
  } = values;

  React.useEffect(() => {
    if (term) {
      setValues({ ...term });
    }
  }, [term]);

  const handleInputChange = (e, title) => {
    if (title) {
      setValues({ ...values, [title]: dayjs(e).format("YYYY-MM-DD") });
    } else {
      let { name, value, checked } = e.target;
      if (name === "is_closed") {
        setValues({ ...values, [name]: checked });
      }
      // if (name === "is_finished") {
      //   setValues({ ...values, [name]: checked });
      // }
      // if (name === "is_opened_to_final_marks") {
      //   setValues({ ...values, [name]: checked });
      else {
        setValues({ ...values, [name]: value });
      }
    }
  };
  return (
    <div style={{ ...styles.wrapper, right: showUpdateTerm ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Update Term</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowUpdateTerm(false);
          }}
        />
      </div>
      <div style={styles.form}>
        <p style={styles.contentTitle}>Term</p>
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerStyled
            label={"Start Date"}
            format="YYYY-MM-DD"
            value={dayjs(from_date)}
            name="from_date"
            onChange={(value) => handleInputChange(value, "from_date")}
          />
        </LocalizationProvider>
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePickerStyled
            label={"End Date"}
            format="YYYY-MM-DD"
            value={dayjs(to_date)}
            name="to_date"
            onChange={(value) => handleInputChange(value, "to_date")}
          />
        </LocalizationProvider>
        <br />
        <FormControl
          sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
          size="small"
        >
          <InputLabel id="year">Academic Year</InputLabel>
          <Select
            labelId="year"
            id="year"
            label="Academic Year"
            value={year || ""}
            onChange={handleInputChange}
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
        <br />
        <div>
          <Checkbox
            checked={is_closed || false}
            onChange={handleInputChange}
            name="is_closed"
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Closed
          </Checkbox>
        </div>
        <br />

        {/* <div>
          <Checkbox
            checked={is_finished || false}
            onChange={handleInputChange}
            name="is_finished"
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Finished
          </Checkbox>
        </div>
        <br />

        <div>
          <Checkbox
            checked={is_opened_to_final_marks || false}
            onChange={handleInputChange}
            name="is_opened_to_final_marks"
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Opened to final marks
          </Checkbox>
        </div> */}
        <br />
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateTerm(values)}
        >
          Update term
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

export default UpdateTerm;
