import React, {useState} from 'react';
import Cancel from "../../assets/icons/close.svg";
import {Field, Form, Formik} from "formik";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {toastify} from "../../components/shared/Toast/Toast";
import {styles} from "../../components/Users/AddingUserModal";
import {useCreateTodoMutation} from "../../redux/todo/todoApiSlice";
import {Slider} from "antd";
import "./ToDo.css";

const InputStyled = styled(TextField)(() => ({
    "& fieldset": {
        borderRadius: "10px",
    },
    "& input": {
        fontFamily: "Open Sans",
        fontSize: 14,
        fontWeight: 500,
    },
}));


const AddTodoModal = ({ show, setShow, refetch }) => {
    const [createTodo] = useCreateTodoMutation();
    const gradientColors = ['#00899E','#2EB873', '#F2B824', '#EA5A0C'];
    const [priority, setPriority] = useState(0);

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

    const handleSubmit = async (values) => {
        createTodo({...values, priority})
            .unwrap()
            .then(() => {
                toastify("success", "ToDo added");
                refetch();
            })
            .catch(() => toastify("error", "ToDo failed to add"))
    }

    return (
        <div id="add-modal" style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
            <div style={styles.header}>
                <div style={styles.headerTitle}>New Community</div>
                <img
                    alt="cancel"
                    src={Cancel}
                    style={styles.close}
                    onClick={() => {
                        setShow(false);
                    }}
                />
            </div>
            <Formik
                initialValues={{
                    name: "",
                    description: "",
                    is_done: false,
                }}
                validate={(values) => {
                    const errors = {};
                    if (values.name === "") {
                        errors.name = "Name is required";
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(false);
                    setShow(false);
                    handleSubmit(values);
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="modal" style={styles.form}>
                        <p style={styles.contentTitle}>Name</p>
                        <Field name="name">
                            {({ field, form: { touched, errors } }) => (
                                <>
                                    <InputStyled
                                        {...field}
                                        label="Name"
                                        variant="outlined"
                                        type="text"
                                        className="input"
                                        size="small"
                                    />
                                    <div
                                        className={
                                            touched[field.name] && errors[field.name]
                                                ? "error"
                                                : "hidden"
                                        }
                                    >
                                        {errors[field.name]}
                                    </div>
                                </>
                            )}
                        </Field>
                        <Field name="description">
                            {({ field, form: { touched, errors } }) => (
                                <>
                                    <InputStyled
                                        {...field}
                                        label="Description"
                                        variant="outlined"
                                        type="text"
                                        className="input"
                                        size="small"
                                        multiline
                                        rows={4}
                                    />
                                    <div
                                        className={
                                            touched[field.name] && errors[field.name]
                                                ? "error"
                                                : "hidden"
                                        }
                                    >
                                        {errors[field.name]}
                                    </div>
                                </>
                            )}
                        </Field>
                        <label>
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
                        </label>
                        <label>
                            <Field type="checkbox" name="is_done" />
                            Is done
                        </label>
                        <button type="submit" disabled={isSubmitting} style={styles.btn}>
                            Create community
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddTodoModal;