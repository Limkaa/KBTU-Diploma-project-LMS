import React, {useEffect, useState} from 'react';
import "./GroupsPage.css";
import Header from "../../components/shared/Header";
import Profile from "../../components/Dashboard/Profile";
import {
    useGetGradeGroupsQuery, useGetGroupsQuery,
    useGetSchoolGroupsQuery,
    useGetTeacherGroupsQuery
} from "../../redux/groups/groupsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Table, Spin, Tag, Button, Input, Space, Radio, Select} from 'antd';
import Plus from "../../assets/icons/plus.svg";
import Search from "../../assets/icons/search.svg";

const GroupsPage = () => {
    const user = useSelector(selectCurrentUser);
    const [limit, setLimit] = useState("");
    const [groupType, setGroupType] = useState("school");
    const [options, setOptions] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [grade, setGrade] = useState(1);
    const [teacher, setTeacher] = useState(11);
    const {data: groups, isLoading} = useGetGroupsQuery({groupType, school_id: user.school_id, grade_id: grade, teacher_id: teacher, limit})

    const handleGroupTypeChange = (e) => {
        let value = e.target.value;
        setGroupType(value);
        if (value === 'school') {
            setGroupType(value);
            setDisabled(true);
        }
        else if (value === 'teacher') {
            setDisabled(false);
            setOptions([
                {
                    value: 11,
                    label: 'Torin Meddings',
                },
            ])
            // setTeacher()
        }
        else if (value === 'grade') {
            setDisabled(false);
            setOptions([
                { value: 1, label: '1', },
                { value: 2, label: '2', },
                { value: 3, label: '3', },
                { value: 4, label: '4', },
                { value: 5, label: '5', },
                { value: 6, label: '6', },
                { value: 7, label: '7', },
                { value: 8, label: '8', },
                { value: 9, label: '9', },
                { value: 10, label: '10', },
                { value: 11, label: '11', },
            ])
        }
    };

    const handleSelectChange = (value) => {
        if (groupType === "grade"){
            setGrade(value);
            console.log("select grade change", grade);
        }
        else if (groupType === "teacher"){
            setTeacher(value);
            console.log("select teacher change", teacher);
        }
    }


    const columns = [
        {
            title: 'Code',
            width: "15%",
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Grade',
            width: "15%",
            render: (group) => (
                <span>
                    {group.grade.name}
                </span>
            ),
        },
        {
            title: 'Teacher',
            width: "15%",
            render: (group) => (
                <span>
                    {group.teacher.first_name} {group.teacher.last_name}
                </span>
            ),
        },
        {
            title: 'Status',
            width: "15%",
            render: (group) => (
                <Tag
                    style={{minWidth: 70, textAlign: "center"}}
                    color={group.is_active ? 'green' : 'volcano'}>
                    {group.is_active ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            width: "15%",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        style={{ color: "#00899E", fontWeight: 500, padding: 0 }}
                        type={"link"}
                        onClick={() => {
                            // setSelectedUser(record);
                            // setShowUpdateUser(true);
                        }}
                    >
                        Change
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <main className="groups">
            <header className="header">
                <Header text={"Groups"} />
                <Profile />
            </header>
            <div style={styles.tableCont}>
                <div style={styles.filter}>
                    <div style={{marginRight: "auto"}}>
                        <Radio.Group style={{marginRight: 10}} value={groupType} onChange={handleGroupTypeChange}>
                            <Radio.Button value="school">School</Radio.Button>
                            <Radio.Button value="teacher">Teacher</Radio.Button>
                            <Radio.Button value="grade">Grade</Radio.Button>
                        </Radio.Group>
                        {groupType === "teacher" &&
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                onChange={handleSelectChange}
                                disabled={disabled}
                                options={options}
                                defaultValue={options[0]}
                            />
                        }
                        {groupType === "grade" &&
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                onChange={handleSelectChange}
                                disabled={disabled}
                                options={options}
                                defaultValue={options[0]}
                            />
                        }
                    </div>
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <Input
                            size="default size"
                            placeholder="Search..."
                            prefix={<img src={Search} style={{ height: 20, width: 20 }} />}
                            style={{
                                height: 40,
                                width: 280,
                                border: "none",
                                borderRadius: 8,
                            }}
                            // onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#163A61",
                                height: 40,
                                borderRadius: 8,
                                alignItems: "center",
                                display: "flex",
                                fontWeight: 500,
                                marginLeft: 16,
                            }}
                            icon={<img src={Plus} style={{ paddingRight: 5 }} />}
                            // onClick={() => setShowAddUser(true)}
                        >
                            Add group
                        </Button>
                    </div>
                </div>
                <Spin spinning={isLoading}>
                    <Table
                        pagination={false}
                        dataSource={groups}
                        columns={columns}
                        rowKey={(item) => item?.id}
                    />
                </Spin>
            </div>
        </main>
    );
};

const styles = {
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: "#FAFAFA",
        padding: 16,
    },
    header: {
        display: "flex",
    },
    tableCont: {
        marginTop: 20,
        borderRadius: 8,
        border: "1px solid #0000000D",
        borderBottom: "none",
        marginBottom: 20,
    },
    filter: {
        padding: 8,
        justifyContent: "flex-end",
        display: "flex",
    },
};

export default GroupsPage;