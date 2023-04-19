import React, {useEffect, useState} from 'react';
import "./StudentsPage.css";
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useParams} from "react-router-dom";
import {useGetOneGroupQuery} from "../../redux/groups/groupsApiSlice";
import {useGetGroupStudentsQuery} from "../../redux/students/studentsApiSlice";
import {Spin, Table, Alert} from "antd";

const StudentsPage = () => {
    const {groupId} = useParams();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const {data: groupData, isLoading: isGroupLoading, isSuccess: isGroupSuccess, error} = useGetOneGroupQuery(groupId);
    const {data: studentsData, isLoading: isStudentsLoading, isSuccess: isStudentsSuccess} =
        useGetGroupStudentsQuery({groupId, page});
    const [err, setErr] = useState(false);
    const [group, setGroup] = useState();
    const [students, setStudents] = useState();

    useEffect(() => {
        console.log(error);
        if (error?.status === 403) {
            setErr(true);
        }
        else {
            setErr(false);
        }
    }, [error]);

    useEffect(() => {
        if (isGroupSuccess) {
            setGroup(groupData);
        }
    }, [isGroupSuccess, groupData]);

    useEffect(() => {
        if (isStudentsSuccess) {
            if (page === 1) setTotal(studentsData?.count);
            setStudents(studentsData?.results);
        }
    }, [isStudentsSuccess, page, studentsData]);

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (student) => (
                <span>
                    {student.user.first_name} {student.user.last_name}
                </span>
            ),
        },
        {
            title: 'Email',
            key: 'email',
            render: (student) => (
                <span>
                    {student.user.email}
                </span>
            ),
        },
    ];

    return (
        <main>
            <header className="header">
                <Header text={"Group students"} />
                <Profile />
            </header>
            {err ?
                <Alert
                    style={{marginTop: 20, width: "50%"}}
                    message="Error"
                    description="Invalid group. You cannot interact with other schools and all related to them objects"
                    type="error"
                    showIcon
                />
                :
                <section id="students">
                    <div className="students">
                        <Spin spinning={isStudentsLoading}>
                            <Table className="table"
                                   rowKey={(record) => record.id}
                                   columns={columns}
                                   dataSource={students}
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
                    <div className="group-info">
                        <Spin spinning={isGroupLoading}>
                            <h2>Group information</h2>
                            <div className="card">
                                <div className={group?.is_active ? "flex green" : "flex red"}>
                                    <div className="head">
                                        <h4>Group</h4>
                                    </div>
                                    <hr/>
                                    <div className="info">
                                        <p>{group?.code}</p>
                                        {group?.is_active ? 'active' : 'inactive'}
                                    </div>
                                </div>
                                <div className={group?.grade.is_active ? "flex green" : "flex red"}>
                                    <div className="head">
                                        <h4>Grade</h4>
                                    </div>
                                    <hr/>
                                    <div className="info">
                                        <p>{group?.grade.name}</p>
                                        <p>
                                            {group?.grade.is_active ? 'active' : 'inactive'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex green">
                                    <div className="head">
                                        <h4>Teacher</h4>
                                    </div>
                                    <hr/>
                                    <div className="info">
                                        <p>{group?.teacher.first_name} {group?.teacher.last_name}</p>
                                        <p>{group?.teacher.email}</p>
                                    </div>
                                </div>
                            </div>
                        </Spin>
                    </div>
                </section>
            }
        </main>
    );
};

export default StudentsPage;