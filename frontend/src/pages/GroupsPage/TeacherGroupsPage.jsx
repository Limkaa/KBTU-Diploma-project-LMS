import React, {useEffect, useState} from 'react';
import "./GroupsPage.css";
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useGetGroupsQuery} from "../../redux/groups/groupsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Table, Spin, Tag, Input, Radio, Space} from 'antd';
import Search from "../../assets/icons/search.svg";
import {Link} from "react-router-dom";

const TeacherGroupsPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState("");
    const {data: teacherGroupsData, isLoading} = useGetGroupsQuery(
        {groupType: "teacher",
            school_id: user.school_id,
            grade_id: null,
            teacher_id: user.user_id,
            page, search, isActive});
    const [groups, setGroups] = useState();
    const [total, setTotal] = useState();

    useEffect(() => {
        if (teacherGroupsData && !isLoading) {
            if (page === 1) setTotal(teacherGroupsData?.count);
            setGroups(teacherGroupsData?.results);
        }
    }, [teacherGroupsData, isLoading, page]);

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
                    <Link
                        style={{ color: "#45B764", fontWeight: 500, padding: 0 }}
                        to={`${record.id}/students`}>Students</Link>
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
                        <Radio.Group size={"large"} style={{marginRight: 10}} value={isActive}
                                     onChange={(e) => setIsActive(e.target.value)}>
                            <Radio.Button value="">All</Radio.Button>
                            <Radio.Button value="true">Active</Radio.Button>
                            <Radio.Button value="false">Not active</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <Input
                            size={"large"}
                            placeholder="Search..."
                            prefix={
                                <img alt="" src={Search} style={{ height: 15, width: 15 }} />
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
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