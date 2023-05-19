import React, {useEffect, useState} from 'react';
import {styles} from "../../components/Users/AddingUserModal";
import Cancel from "../../assets/icons/close.svg";
import {InputStyled} from "../GroupsPage/UpdateGroupModal";
import {Checkbox, Button} from "antd";
import {useUpdateCommunityMutation} from "../../redux/communities/communitiesApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";

const UpdateCommunityModal = ({show, setShow, refetch, community }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [link, setLink] = useState("");
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [linkError, setLinkError] = useState(false);

    const [updateCommunity] = useUpdateCommunityMutation();

    useEffect(() => {
        if (community) {
            setName(community.name);
            setDesc(community.description);
            setIsActive(community.is_active);
            setLink(community.link);
        }
    }, [community, show])

    const handleSubmit = () => {
        if (!linkError && !nameError && !descError)
        updateCommunity({commId: community.id, name, description: desc, link, is_active: isActive})
            .then(() => {
                refetch();
                toastify("success", "Community updated");
            })
            .catch(err => {
                toastify("error", err.message);
            })
            .finally(() => setShow(false))
    }

    return (
        <div id="add-modal" style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
            <div style={styles.header}>
                <div style={styles.headerTitle}>Update Community</div>
                <img
                    alt="cancel"
                    src={Cancel}
                    style={styles.close}
                    onClick={() => {
                        setNameError(false);
                        setDescError(false);
                        setShow(false);
                    }}
                />
            </div>
            <div className="modal" style={styles.form}>
                <br/>
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
                        shrink: link !== "",
                    }}
                    label="Link"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                    value={link}
                    onChange={(e) => {
                        setLink(e.target.value);
                        if (e.target.value !== "" && !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{2,5})?([\/\w.-]*)*$/.test(e.target.value)) {
                            setLinkError(true);
                        } else {
                            setLinkError(false);
                        }
                    }}
                />
                <div className={linkError ? "error" : "hidden"}>
                    Invalid url
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
                        if (e.target.value.trim() === "") {
                            setDescError(true);
                        }
                        else {
                            setDescError(false);
                        }
                    }}
                />
                <div className={descError ? "error" : "hidden"}>
                    Description can not be empty
                </div>
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
                <button type="submit" style={styles.btn} onClick={handleSubmit}
                        disabled={linkError || nameError || descError}>
                    Update community
                </button>
            </div>
        </div>
    );
};

export default UpdateCommunityModal;