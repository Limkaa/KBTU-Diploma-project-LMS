import React, {useEffect, useState} from 'react';
import {styles} from "../../components/Users/AddingUserModal";
import Cancel from "../../assets/icons/close.svg";
import {InputStyled} from "../GroupsPage/UpdateGroupModal";
import {Checkbox} from "antd";
import {useUpdateCommunityMutation} from "../../redux/communities/communitiesApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";

const UpdateCommunityModal = ({show, setShow, refetch, community }) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [link, setLink] = useState("");
    const [nameError, setNameError] = useState(false);
    const [descError, setDescError] = useState(false);

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
        console.log(community.id,name, desc, isActive, link);
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
        <div style={{ ...styles.wrapper, right: show ? "0" : "-30%" }}>
            <div style={styles.header}>
                <div style={styles.headerTitle}>New Community</div>
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
                        shrink: link !== "",
                    }}
                    label="Link"
                    variant="outlined"
                    type="text"
                    className="input"
                    size="small"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                />
                <div className="hidden"></div>
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
                <button type="submit" style={styles.btn} onClick={handleSubmit}>
                    Update community
                </button>
            </div>
        </div>
    );
};

export default UpdateCommunityModal;