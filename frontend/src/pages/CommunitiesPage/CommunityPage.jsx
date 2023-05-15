import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useNavigate, useParams} from "react-router-dom";
import {
    useGetCommunityMembersQuery,
    useGetCommunityQuery,
    useGetStudentMembershipsQuery,
    useJoinCommunityMutation, useLeaveCommunityMutation
} from "../../redux/communities/communitiesApiSlice";
import {Alert, Button, Input, Radio, Spin, Table, Tag} from "antd";
import './CommunitiesPage.css';
import {ArrowLeftOutlined, MinusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {toastify} from "../../components/shared/Toast/Toast";
import {useGetStudentQuery} from "../../redux/students/studentsApiSlice";
import Search from "../../assets/icons/search.svg";


const CommunityPage = () => {
    const user = useSelector(selectCurrentUser);
    const {commId} = useParams();
    const {data: communityData, isLoading, isSuccess, isError} = useGetCommunityQuery(commId);
    const [community, setCommunity] = useState();
    const navigate = useNavigate();

    const [student, setStudent] = useState();
    const {data: myCommunitiesData, isSuccess: isMyCommSuccess, isLoading: isMyCommsLoading, refetch}
        = useGetStudentMembershipsQuery(student?.id);
    const [myCommunities, setMyCommunities] = useState([]);
    const [joinCommunity] = useJoinCommunityMutation();
    const {data: studentData, isSuccess: isStudentSuccess} = useGetStudentQuery(user.user_id);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("");
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState();
    const {data: communityMembersData, isLoading: isMembersLoading, isSuccess: isMembersSuccess, refetch: membersRefetch}
        = useGetCommunityMembersQuery({commId, page, search, order});
    const [members, setMembers] = useState();
    const [leaveCommunity] = useLeaveCommunityMutation();

    useEffect(() => {
        if (isSuccess) {
            setCommunity(communityData);
        }
    }, [communityData, isSuccess])

    useEffect(() => {
        if (isMembersSuccess) {
            setMembers(communityMembersData.results);
            if (page === 1) setTotal(communityMembersData.count);
        }
    }, [communityMembersData, isMembersSuccess])

    useEffect(() => {
        if (user.role === "student" && isMyCommSuccess) {
            let arr = [];
            for (let comm of myCommunitiesData.results) {
                arr.push({community: comm.community.id, membership: comm.id});
            }
            setMyCommunities(arr);
        }
    }, [myCommunitiesData, isMyCommSuccess])

    useEffect(() => {
        if (isStudentSuccess) {
            setStudent(studentData);
        }
    }, [studentData, isStudentSuccess])

    if (isError) {
        return (
            <Alert type={"error"}>Community not found</Alert>
        )
    }

    const handleJoin = (commId) => {
        joinCommunity(commId)
            .unwrap()
            .then(() => {
                toastify("success", "You joined community");
                refetch();
                membersRefetch();
            })
            .catch(err => {
                toastify("error", err.data.detail.__all__[0]);
            })
    }

    const handleLeave = (memId) => {
        leaveCommunity(memId)
            .unwrap()
            .then(() => {
                toastify("success", "You leaved community");
                refetch();
                membersRefetch();
            })
            .catch(err => {
                toastify("error", err.data.detail.__all__[0]);
            })
    }

    const columns = [
        {
            title: 'Member',
            key: 'student',
            // width: "35%",
            render: (member) => (
                <div className="rating">
                        <span className="name">
                            {member.student.user.first_name} {member.student.user.last_name}
                        </span>
                    <span className="email">
                            {member.student.user.email}
                        </span>
                </div>
            ),
        },
        {
            title: 'Grade',
            key: 'grade',
            // width: "15%",
            render: (member) => (
                <span>
                    {member.student.group?.grade?.name ? member.student.group?.grade?.name : <MinusOutlined />}
                </span>
            ),
        },
        {
            title: 'Gender',
            key: 'gender',
            // width: "15%",
            render: (member) => (
                <Tag
                    style={{ minWidth: 50, textAlign: "center" }}
                    color={member.student.user.gender === "male" ? "blue" : "pink"}>
                    {member.student.user.gender}
                </Tag>
            ),
        },
        {
            title: 'Group',
            key: 'group',
            // width: "15%",
            render: (member) => {
                if (member.student.group === null) {
                    return <MinusOutlined />;
                }
                else {
                    return (
                        <Tag
                            style={{ minWidth: 53, textAlign: "center" }}
                        >
                            {member.student.group.code??"-"}
                        </Tag>)
                }

            },
        },
    ];

    return (
        <main id="community">
            <header className="header">
                <Header text={"Communities"} />
                <Profile />
            </header>
            <section>
                <Button onClick={() => navigate(-1)} className="back">
                    <ArrowLeftOutlined />
                </Button>
                <div className="flex-container">
                    <div className="table">
                        <Spin spinning={isMembersLoading}>
                            <Table
                                rowKey={(record) => record.id}
                                columns={columns}
                                dataSource={members}
                                pagination={{
                                    total: total,
                                    current: page,
                                    onChange: (page) => {
                                        setPage(page);
                                        window.scrollTo(0,0);
                                    },
                                    showSizeChanger: false,
                                }}
                            />
                        </Spin>
                    </div>
                    <aside>
                        <div>
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
                            <div className="card-modal-content">
                                <Spin spinning={isLoading}>
                                    <div>
                                        <h2>{community?.name}</h2>
                                        <p>{community?.members_count} members</p>
                                        <p className="description">{community?.description}</p>
                                        <p className="link"><a href={community?.link}>Link</a></p>
                                    </div>
                                    {
                                        user.role === "student" && (
                                            (() => {
                                                const match = myCommunities.find((item) => item.community === community.id);
                                                return (
                                                    <React.Fragment>
                                                        {match !== undefined ? (
                                                            <Button
                                                                className="joined"
                                                                onClick={() => handleLeave(match.membership)}
                                                                loading={isMyCommsLoading}
                                                            >
                                                                Joined
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                className="join"
                                                                onClick={() => handleJoin(community.id)}
                                                                loading={isMyCommsLoading}
                                                            >
                                                                Join
                                                            </Button>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })()
                                        )
                                    }
                                </Spin>
                            </div>
                        </div>
                        <div className="sort">
                            <h2>Sort by:</h2>
                            <Radio.Group name="order"
                                         value={order}
                                         onChange={(e) => setOrder(e.target.value)}
                            >
                                <Radio className="radio" value={""}>Default</Radio>
                                <Radio className="radio" value={"created_at"}>Creation</Radio>
                                <Radio className="radio" value={"updated_at"}>Update</Radio>
                            </Radio.Group>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

export default CommunityPage;