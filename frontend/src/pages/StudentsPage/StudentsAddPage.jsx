import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useGetSchoolStudentsQuery, useUpdateStudentGroupMutation} from "../../redux/students/studentsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Alert, Spin, Table, Tag, Button} from "antd";
import "./StudentsAddPage.css";
import {useGetAllActiveGroupsQuery, useGetGroupsQuery} from "../../redux/groups/groupsApiSlice";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {toastify} from "../../components/shared/Toast/Toast";

const StudentsAddPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [order, setOrder] = useState("");
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("");
    const [students, setStudents] = useState([]);
    const {data: studentsData, isLoading, isSuccess} = useGetSchoolStudentsQuery({
        schoolId: user.school_id,
        page, order, search, gender
    });
    const [groupsOptions, setGroupsOptions] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const {data: groupsData, isLoading: isGroupsLoading ,isSuccess: isGroupsSuccess} = useGetAllActiveGroupsQuery(user.school_id);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updateGroup] = useUpdateStudentGroupMutation();
    useEffect(() => {
        if (isSuccess) {
            setStudents(studentsData?.results);
            if (page === 1) setTotal(studentsData?.count);
        }
    }, [studentsData, isSuccess]);
    useEffect(() => {
        if (isGroupsSuccess) {
            setGroupsOptions(groupsData);
        }
    }, [groupsData, isGroupsSuccess]);

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (student) => (
                <span>
                    {student.first_name} {student.last_name}
                </span>
            ),
        },
        {
            title: 'Email',
            key: 'email',
            render: (student) => (
                <span>
                    {student.email}
                </span>
            ),
        },
        {
            title: 'Gender',
            key: 'gender',
            render: (student) => (
                <Tag
                    style={{ minWidth: 70, textAlign: "center" }}
                    color={student.gender === "male" ? "blue" : "pink"}>
                    {student.gender}
                </Tag>
            ),
        }
    ];

    const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
        setSelectedRows(selectedRows);
    };

    const rowSelection = {
        selectedRows,
        onChange: handleRowSelectionChange,
    };

    const handleGroupChange = async () => {
        for (let row of selectedRows) {
            try {
                await updateGroup({
                   studentId: row.id,
                   group: selectedGroup,
                });
            } catch (err) {
                toastify("error", `Failed to update group for ${row.first_name} ${row.last_name}`);
                return;
            }
        }
        toastify("success", "Groups updated");
    }

    return (
        <main>
            <header className="header">
                <Header text={"Group students"} />
                <Profile />
            </header>
            <section id="students">
                <div className="students">
                    <Spin spinning={isLoading}>
                        <Table className="table"
                               rowKey={(record) => record.id}
                               columns={columns}
                               dataSource={students}
                               rowSelection={rowSelection}
                               pagination={{
                                   total: total,
                                   current: page,
                                   onChange: (page) => {
                                       setPage(page);
                                       window.scrollTo(0,0);
                                   },
                                   showSizeChanger: false,
                               }}
                        >
                        </Table>
                    </Spin>
                </div>
                <div className="form">
                    <h2>Add students to selected group</h2>
                    <Alert
                        style={{marginBottom: 14}}
                        message="If you will add student with existing group, the group will change"
                        type="info"
                        showIcon
                        closable
                    />
                    <FormControl
                        sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                        size={"small"}
                    >
                        <InputLabel id="group">Group</InputLabel>
                        <Select
                            labelId="group"
                            id="group"
                            value={selectedGroup}
                            label="Group"
                            onChange={(e) => {
                                setSelectedGroup(e.target.value);
                            }}
                            loading={isGroupsLoading}
                        >
                            {
                                groupsOptions.map(group =>
                                    <MenuItem key={group.id} value={group.id}>
                                        <Tag style={{minWidth: "20%", textAlign: 'center'}}>{group.code}</Tag>
                                        {group.grade.name} | {group.teacher.first_name} {group.teacher.last_name}
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <div style={{height: 10}}></div>
                    </FormControl>
                    <Button className="btn"
                            onClick={handleGroupChange}
                    >Update group</Button>
                </div>
            </section>
        </main>
    );
};

export default StudentsAddPage;