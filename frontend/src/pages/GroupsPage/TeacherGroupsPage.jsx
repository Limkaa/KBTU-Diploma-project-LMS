import React, {useEffect, useState} from 'react';
import "./GroupsPage.css";
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useGetGroupsQuery} from "../../redux/groups/groupsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Table, Spin, Tag, Button, Input, Radio, Space} from 'antd';
import Search from "../../assets/icons/search.svg";
import {Link} from "react-router-dom";

const TeacherGroupsPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const {data: teacherGroupsData, isLoading} = useGetGroupsQuery(
        {groupType: "teacher", school_id: user.school_id, grade_id: null, teacher_id: user.user_id, page});
    const [groups, setGroups] = useState();
    const [isActive, setIsActive] = useState("all");
    const [total, setTotal] = useState();

    useEffect(() => {
        if (teacherGroupsData && !isLoading) {
            if (page === 1) setTotal(teacherGroupsData?.count);
            setGroups(teacherGroupsData?.results);
        }
    }, [teacherGroupsData, isLoading]);

    const handleStatusChange = (e) => {
        let value = e.target.value;
        setIsActive(value);
        console.log(value);
        if (value === 'all') {
            setGroups(teacherGroupsData?.results);
        }
        else if (value === 'active') {
            console.log(teacherGroupsData?.results.filter(group => group.is_active === true));
            setGroups(teacherGroupsData?.results.filter(group => group.is_active === true));
        }
        else if (value === 'inactive') {
            console.log(teacherGroupsData?.results.filter(group => group.is_active === false));
            setGroups(teacherGroupsData?.results.filter(group => group.is_active === false));
        }
    };

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
                    <Link to={`${record.id}/students`}>Students</Link>
                </Space>
            ),
        },
    ];

    return (
        <main className="groups">
            <header className="header">
                <Header text={"GroupsPage"} />
                <Profile />
            </header>
            <div style={styles.tableCont}>
                <div style={styles.filter}>
                    <div style={{marginRight: "auto"}}>
                        <Radio.Group style={{marginRight: 10}} value={isActive} onChange={handleStatusChange}>
                            <Radio.Button value="all">All</Radio.Button>
                            <Radio.Button value="active">Active</Radio.Button>
                            <Radio.Button value="inactive">Not active</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <Input
                            size="default size"
                            placeholder="Search..."
                            prefix={<img alt='' src={Search} style={{ height: 20, width: 20 }} />}
                            style={{
                                height: 40,
                                width: 280,
                                border: "none",
                                borderRadius: 8,
                            }}
                            // onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                    </div>
                </div>
                <Spin spinning={isLoading}>
                    <Table
                        dataSource={groups}
                        columns={columns}
                        rowKey={(item) => item?.id}
                        pagination={{
                            total: total,
                            current: page,
                            onChange: (page) => {
                                console.log(page);
                                setPage(page);
                                window.scrollTo(0,0);
                            },
                            showSizeChanger: false,
                        }}
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

export default TeacherGroupsPage;