import React, { useEffect, useState } from "react";
import Cancel from "../../assets/icons/close.svg";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useUpdateGroupMutation } from "../../redux/groups/groupsApiSlice";
import "./GroupsPage.css";
import { Checkbox } from "antd";
import { useGetTeachersQuery } from "../../redux/users/usersApiSlice";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useGetSchoolGradesWithoutPageQuery } from "../../redux/schoolGrades/schoolGradesApiSlice";
import { toastify } from "../../components/shared/Toast/Toast";

export const InputStyled = styled(TextField)(() => ({
  "& fieldset": {
    borderRadius: "10px",
  },
  "& input": {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: 500,
  },
}));

const UpdateGroupModal = ({
  show,
  setShow,
  selectedGroup,
  setSelectedGroup,
  refetch,
}) => {
  const user = useSelector(selectCurrentUser);
  const { data: teachers } = useGetTeachersQuery(user.school_id);
  const { data: grades } = useGetSchoolGradesWithoutPageQuery({
    school_id: user.school_id,
  });
  const [teacher, setTeacher] = useState();
  const [grade, setGrade] = useState();
  const [error, setError] = useState(false);
  const [group, setGroup] = useState(selectedGroup);
  const [code, setCode] = useState(selectedGroup?.code);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setGroup(selectedGroup);
      setTeacher(selectedGroup?.teacher.id);
      setGrade(selectedGroup?.grade.id);
      setCode(selectedGroup?.code);
      setIsActive(selectedGroup?.is_active);
    }
  }, [selectedGroup]);

  const [updateGroup] = useUpdateGroupMutation();

  const handleUpdateGroup = async () => {
    try {
      updateGroup({
        groupId: group.id,
        school: user.school_id,
        grade: grade,
        teacher: teacher,
        code: code,
        is_active: isActive,
      })
        .unwrap()
        .then(() => {
          refetch();
          setShow(false);
          toastify("success", "Group successfully updated");
        });
    } catch (e) {
      toastify("error", "Group update failed");
    }
  };

  return (
    <div style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>Update Group</div>
        <img
          alt="cancel"
          src={Cancel}
          style={styles.close}
          onClick={() => {
            setShow(false);
            setSelectedGroup();
          }}
        />
      </div>
      <div className="modal" style={styles.form}>
        <p style={styles.contentTitle}>Group</p>
        <br />
        <InputStyled
          InputLabelProps={{
            shrink: true,
          }}
          label="Code"
          variant="outlined"
          type="text"
          className="input"
          name="first_name"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (!/^[a-zA-Z\d]+$/.test(e.target.value)) {
              setError(true);
            } else {
              setError(false);
            }
          }}
          size="small"
        />
        <div className={error ? "error" : "hidden"}>
          Code allows only letters and numbers
        </div>
        <FormControl
          sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
          size="small"
        >
          <InputLabel id="grade">Grade</InputLabel>
          <Select
            labelId="grade"
            id="grade"
            // defaultValue={teacherOptions[0]}
            // defaultValue={group?.grade.id}
            value={`${group?.grade.id}`}
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
            // defaultValue={group?.teacher.id}
            value={`${group?.teacher.id}`}
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
        </FormControl>
        <br />
        <Checkbox
          checked={isActive}
          onChange={() => {
            setIsActive(!isActive);
          }}
          name="is_active"
          style={{ fontWeight: 400, fontSize: 16 }}
        >
          Is active
        </Checkbox>
        <button
          type="submit"
          style={styles.btn}
          onClick={() => handleUpdateGroup()}
        >
          Update group
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
    boxShadow: "0 0 3px 0 rgb(202 202 202)",
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

export default UpdateGroupModal;
