import React from 'react';
import Cancel from "../../assets/icons/close.svg";
import {Field, Form, Formik} from "formik";
import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {useCreateCommunityMutation} from "../../redux/communities/communitiesApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {styles} from "../../components/Users/AddingUserModal";
import "./CommunitiesPage.css";

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


const AddCommunityModal = ({ show, setShow, refetch }) => {
    const user = useSelector(selectCurrentUser);
    const [addCommunity] = useCreateCommunityMutation();

    const handleSubmit = async (values) => {
        console.log(values);
        await addCommunity({schoolId: user.school_id, ...values})
            .unwrap()
            .then(() => {
                refetch();
                toastify("success", "Community added");
            })
            .catch(err => toastify("error", err.message))
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
                    link: "",
                    is_active: false,
                }}
                validate={(values) => {
                    const errors = {};
                    if (values.name === "") {
                        errors.name = "Name is required";
                    }
                    if (values.description === "") {
                        errors.description = "Description is required";
                    }
                    if (values.link !== "" && !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{2,5})?([\/\w.-]*)*$/.test(values.link)) {
                        errors.link = "Invalid url";
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
                        <br/>
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
                        <Field name="link">
                            {({ field, form: { touched, errors } }) => (
                                <>
                                    <InputStyled
                                        {...field}
                                        label="Link"
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
                            <Field type="checkbox" name="is_active" />
                                Is active
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

export default AddCommunityModal;