import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useGetSchoolStudentsQuery, useUpdateStudentGroupMutation} from "../../redux/students/studentsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Spin, Table, Tag, Button, Radio, Divider, Select, Input} from "antd";
import "./StudentsPage.css";
import {useGetAllActiveGroupsQuery} from "../../redux/groups/groupsApiSlice";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {Select as Select2} from "@mui/material";
import {toastify} from "../../components/shared/Toast/Toast";
import {useGetSchoolGradesWithoutPageQuery} from "../../redux/schoolGrades/schoolGradesApiSlice";
import {useGetTeachersQuery} from "../../redux/users/usersApiSlice";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import {MinusOutlined} from "@ant-design/icons";

const StudentsPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [order, setOrder] = useState("created_at");
    const [search, setSearch] = useState("");
    const [gender, setGender] = useState("");
    const [groupId, setGroupId] = useState("");
    const [teacherId, setTeacherId] = useState("");
    const [gradeId, setGradeId] = useState("");
    const [noGroup, setNoGroup] = useState("");
    const [students, setStudents] = useState([]);
    const {data: studentsData, isLoading, isSuccess, refetch} = useGetSchoolStudentsQuery({
        schoolId: user.school_id,
        page, order, search, gender, groupId, teacherId, gradeId, noGroup
    });
    const [groups, setGroups] = useState([]);
    const [gradesOptions, setGradesOptions] = useState([]);
    const [teacherOptions, setTeacherOptions] = useState([]);
    const [groupsOptions, setGroupsOptions] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const { data: grades, isSuccess: isGradesLoaded } =
        useGetSchoolGradesWithoutPageQuery({ school_id: user.school_id });
    const { data: teachers, isSuccess: isTeachersLoaded } = useGetTeachersQuery(
        user.school_id
    );
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
        let arr = [{ value: "", label: "All grades" }];
        if (isGradesLoaded) {
            grades.forEach((grade) => {
                arr.push({ value: grade.id, label: grade.name });
            });
            setGradesOptions(arr);
            // setGradeId(arr[0].value);
        }
    }, [isGradesLoaded, grades]);

    useEffect(() => {
        let arr = [{ value: "", label: "All teachers" }];
        if (isTeachersLoaded) {
            teachers.forEach((user) => {
                arr.push({
                    value: user.id,
                    label: `${user.first_name} ${user.last_name}`,
                });
            });
            setTeacherOptions(arr);
        }
    }, [isTeachersLoaded, teachers]);

    useEffect(() => {
        if (isGroupsSuccess) {
            setGroups(groupsData);
        }
    }, [groupsData, isGroupsSuccess]);

    useEffect(() => {
        let arr = [{ value: "", label: "All groups" }];
        if (groups) {
            groups.forEach((group) => {
                arr.push({
                    value: group.id,
                    label: group.code,
                });
            });
            setGroupsOptions(arr);
        }
    }, [groups]);

    const columns = [
        {
            title: 'Student',
            key: 'student',
            width: "35%",
            render: (student) => (
                <div>
                        <span className="name">
                            {student.user.first_name} {student.user.last_name}
                        </span>
                        <span className="email">
                            {student.user.email}
                        </span>
                </div>
            ),
        },
        {
            title: 'Grade',
            key: 'grade',
            width: "15%",
            render: (student) => (
                <span>
                    {student.group?.grade?.name ? student.group?.grade?.name : <MinusOutlined />}
                </span>
            ),
        },
        {
            title: 'Gender',
            key: 'gender',
            width: "15%",
            render: (student) => (
                <Tag
                    style={{ minWidth: 50, textAlign: "center" }}
                    color={student.user.gender === "male" ? "blue" : "pink"}>
                    {student.user.gender}
                </Tag>
            ),
        },
        {
            title: 'Group',
            key: 'group',
            width: "15%",
            render: (student) => {
                if (student.group === null) {
                    return <MinusOutlined />;
                }
                else {
                    return (
                        <Tag
                            style={{ minWidth: 53, textAlign: "center" }}
                        >
                            {student.group.code??"-"}
                        </Tag>)
                }

            },
        },
        {
            title: 'Rating',
            key: 'rating',
            width: "15%",
            render: (student) => (
                <span>
                    {student.user.rating}
                </span>
            ),
        },
    ];

    const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
        setSelectedRows(selectedRows);
    };

    const rowSelection = {
        selectedRows,
        onChange: handleRowSelectionChange,
        getCheckboxProps: (record) => ({
            disabled: record.group === null,
        }),
    };

    const handleGroupChange = async () => {
        console.log(selectedRows);
        let success = true;
        for (let row of selectedRows) {
            await updateGroup({studentId: row.user.id, group: selectedGroup,})
                .then(() => success = true)
                .catch(() => {
                    success = false;
                    toastify("error", `Failed to update group for ${row.user.first_name} ${row.user.last_name}`);
            })
        }
        if (success) {
            refetch();
            toastify("success", "Groups updated");
        }
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
                <aside>
                    <div className="search">
                        <Input
                            placeholder="Search code"
                            prefix={
                                <img alt="" src={Search} style={{ height: 25, width: 15 }} />
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                    </div>
                    <div className="form add">
                        <h2>Add students to selected group</h2>
                        <FormControl
                            sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                            size={"small"}
                        >
                            <InputLabel id="group">Group</InputLabel>
                            <Select2
                                labelId="group"
                                id="group"
                                value={selectedGroup}
                                label="Group"
                                onChange={(e) => {
                                    setSelectedGroup(e.target.value);
                                }}
                            >
                                {
                                    groups.map(group =>
                                        <MenuItem key={group.id} value={group.id}>
                                            <Tag style={{minWidth: "20%", textAlign: 'center'}}>{group.code}</Tag>
                                            {group.grade?.name} | {group.teacher?.first_name} {group.teacher?.last_name}
                                        </MenuItem>
                                    )
                                }
                            </Select2>
                            <div style={{height: 10}}></div>
                        </FormControl>
                        <Button type={"primary"} className="btn"
                                onClick={handleGroupChange}
                        >Update group</Button>
                    </div>
                    <div className="form filters">
                        <div className="group">
                            <Divider orientation={"left"} className="divider">Sort</Divider>
                            <Radio.Group name="order"
                                         value={order}
                                         onChange={(e) => setOrder(e.target.value)}
                            >
                                <Radio className="radio" value={"created_at"}>Creation</Radio>
                                <Radio className="radio" value={"updated_at"}>Update</Radio>
                                <Radio className="radio" value={"rating"}>Rating</Radio>
                            </Radio.Group>
                        </div>
                        <div className="group">
                            <Divider orientation={"left"} className="divider">Gender</Divider>
                            <Radio.Group name="gender"
                                         value={gender}
                                         onChange={(e) => setGender(e.target.value)}
                            >
                                    <Radio className="radio" value={""}>All</Radio>
                                    <Radio className="radio" value={"female"}>Female</Radio>
                                    <Radio className="radio" value={"male"}>Male</Radio>
                            </Radio.Group>
                        </div>
                        <div className="group">
                            <Divider orientation={"left"} className="divider">Group</Divider>
                            <Radio.Group name="noGroup"
                                         value={noGroup}
                                         onChange={(e) => setNoGroup(e.target.value)}
                            >
                                <Radio className="radio" value={""}>All</Radio>
                                <Radio className="radio" value={"False"}>With</Radio>
                                <Radio className="radio" value={"True"}>Without</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="form">
                        <div className="select">
                            <h3>Teacher:</h3>
                            <Select
                                size={"small"}
                                style={{width: '100%'}}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={(val) => setTeacherId(val)}
                                options={teacherOptions}
                                defaultValue={teacherOptions[0]}
                                value={teacherId}
                            />
                        </div>
                        <div className="select">
                            <h3>Grade:</h3>
                            <Select
                                size={"small"}
                                style={{width: '100%'}}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={(val) => setGradeId(val)}
                                options={gradesOptions}
                                defaultValue={gradesOptions[0]}
                                value={gradeId}
                            />
                        </div>
                        <div className="select">
                            <h3>Group:</h3>
                            <Select
                                size={"small"}
                                style={{width: '100%'}}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={(val) => setGroupId(val)}
                                options={groupsOptions}
                                value={groupId}
                            />
                        </div>
                    </div>
                </aside>

            </section>
        </main>
    );
};

export default StudentsPage;