import React, {useEffect, useState} from 'react';
import {styles} from "../../components/Users/AddingUserModal";
import Cancel from "../../assets/icons/close.svg";
import {InputStyled} from "../GroupsPage/UpdateGroupModal";
import {Checkbox, Slider} from "antd";
import {toastify} from "../../components/shared/Toast/Toast";
import {useUpdateTodoMutation} from "../../redux/todo/todoApiSlice";

const UpdateTodoModal = ({show, setShow, refetch, todo }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [nameError, setNameError] = useState(false);
    const gradientColors = ['#00899E','#2EB873', '#F2B824', '#EA5A0C'];

    const sectionStyle = {
        display: 'flex',
        flexBasis: `${100 / gradientColors.length}%`,
        backgroundColor: '#d9dbdb',
        border: 'none',
    };

    const trackStyle = {
        background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
        border: 'none',
        height: '4px',
        width: '100%'
    };

    const handleStyle = {
        borderColor: gradientColors[0],
        backgroundColor: gradientColors[0],
        boxShadow: 'none',
    };

    const [updateTodo] = useUpdateTodoMutation();

    useEffect(() => {
        if (todo) {
            setName(todo.name);
            setDesc(todo.description);
            setIsDone(todo.is_done);
            setPriority(todo.priority);
        }
    }, [todo, show])

    const handleSubmit = () => {
        updateTodo({todoId: todo.id, name, description: desc, is_done: isDone, priority})
            .unwrap()
            .then(() => {
                refetch();
                toastify("success", "Todo updated");
            })
            .catch(() => {
                toastify("error", "Failed to update");
            })
            .finally(() => setShow(false))
    }

    return (
        <div id="update-todo" style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
            <div style={styles.header}>
                <div style={styles.headerTitle}>Update Todo</div>
                <img
                    alt="cancel"
                    src={Cancel}
                    style={styles.close}
                    onClick={() => {
                        setNameError(false);
                        setShow(false);
                    }}
                />
            </div>
            <div className="modal" style={styles.form}>
                <p style={styles.contentTitle}>Name</p>
                <InputStyled
                    InputLabelProps={{
                        shrink: true,
                    }}
                    label="Name"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim() === "") {
                            setNameError(true);
                        }
                        else {
                            setNameError(false);
                        }
                    }}
                />
                <div className={nameError ? "error" : "hidden"}>
                    Name can not be empty
                </div>
                <InputStyled
                    InputLabelProps={{
                        shrink: desc !== "",
                    }}
                    label="Description"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                    multiline
                    rows={4}
                    value={desc}
                    onChange={(e) => {
                        setDesc(e.target.value);
                    }}
                />
                <Slider
                    style={{width: "98%"}}
                    min={0}
                    max={gradientColors.length - 1}
                    handleStyle={handleStyle}
                    trackStyle={trackStyle}
                    railStyle={sectionStyle}
                    activeDotStyle={handleStyle}
                    onChange={(value) => setPriority(value)}
                    value={priority}
                />
                <Checkbox
                    checked={isDone}
                    onChange={() => {
                        setIsDone(!isDone);
                    }}
                    name="is_done"
                    style={{ fontWeight: 400, fontSize: 16 }}
                >
                    Is active
                </Checkbox>
                <button type="submit" style={styles.btn} onClick={handleSubmit}>
                    Update todo
                </button>
            </div>
        </div>
    );
};

export default UpdateTodoModal;