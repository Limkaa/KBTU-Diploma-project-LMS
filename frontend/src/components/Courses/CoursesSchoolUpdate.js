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

const CoursesSchoolUpdate = ({
  showUpdateCourse,
  setShowUpdateCourse,
  course,
  teachers,
  handleUpdateCourse,
}) => {
  const [teacherId, setTeacherId] = React.useState("");
  const [isActive, setIsActive] = React.useState("");

  React.useEffect(() => {
    if (course) {
      setIsActive(course?.is_active);
    }
    if (course?.teacher) {
      setTeacherId(course?.teacher?.id);
    }
  }, [course]);

  return (
    <div style={{ ...styles.wrapper, right: showUpdateCourse ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Update Course</div>
        <img
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShowUpdateCourse(false);
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
          label="Subject"
          variant="outlined"
          type="text"
          className="input"
          value={
            course?.subject?.name + " " + "(" + course?.subject?.code + ")" ||
            ""
          }
          size="small"
          disabled
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Year"
          variant="outlined"
          type="text"
          className="input"
          value={course?.year?.name || ""}
          size="small"
          disabled
        />
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Group"
          variant="outlined"
          type="text"
          className="input"
          value={
            course?.group?.grade?.name +
              " " +
              "(" +
              course?.group?.code +
              ")" || ""
          }
          size="small"
          disabled
        />
        <br />
        <FormControl
          sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
          size="small"
        >
          <InputLabel id="teacher">Teacher</InputLabel>
          <Select
            labelId="teacher"
            id="teacher"
            label="Teacher"
            name="teacher"
            value={teacherId || ""}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <MenuItem value="" disabled>
              <em>Choose teacher</em>
            </MenuItem>
            {teachers?.map((item) => (
              <MenuItem value={item?.id} key={item?.id}>
                {item?.first_name} {item?.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <div>
          <Checkbox
            checked={isActive || false}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ fontWeight: 400, fontSize: 15 }}
          >
            Active
          </Checkbox>
        </div>
        <br />
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateCourse(isActive, teacherId)}
        >
          Update course
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

export default CoursesSchoolUpdate;
