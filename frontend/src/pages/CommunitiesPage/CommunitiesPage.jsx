import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {Button, Card, Divider, Empty, Input, Pagination, Radio} from "antd";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {
    useGetSchoolCommunitiesQuery,
    useGetStudentMembershipsQuery,
    useJoinCommunityMutation, useLeaveCommunityMutation
} from "../../redux/communities/communitiesApiSlice";
import "./CommunitiesPage.css";
import {CheckCircleTwoTone, CloseCircleTwoTone, EditOutlined} from "@ant-design/icons";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import AddCommunityModal from "./addCommunityModal";
import UpdateCommunityModal from "./updateCommunityModal";
import {useGetStudentQuery} from "../../redux/students/studentsApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";
import {Link} from "react-router-dom";

const TitleWithIcon = ({ icon, comm }) => (
    <Link to={`${comm.id}`} className="card-title">
        <span>{comm.name} </span>
        {icon}
    </Link>
);

const CommunitiesPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [isActive, setIsActive] = useState("");
    const [order, setOrder] = useState("");
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const {data: communitiesData, isLoading, isSuccess, refetch} = useGetSchoolCommunitiesQuery(
        {schoolId: user.school_id, page, isActive, order, search,});
    const [selectedComm, setSelectedComm] = useState();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [joinCommunity] = useJoinCommunityMutation();
    const [leaveCommunity] = useLeaveCommunityMutation();
    const [student, setStudent] = useState();
    const {data: myCommunitiesData, isSuccess: isMyCommSuccess, isLoading: isMyCommsLoading, refetch: myCommRefetch}
        = useGetStudentMembershipsQuery(student?.id);
    const {data: studentData, isSuccess: isStudentSuccess} = useGetStudentQuery(user.user_id);

    useEffect(() => {
        if (isSuccess) {
            setCommunities(communitiesData.results);
            if (page === 1) setTotal(Math.ceil(communitiesData.count/6));
        }
    }, [communitiesData, isSuccess])

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

    const handleJoin = (commId) => {
        joinCommunity(commId)
            .unwrap()
            .then(() => {
                toastify("success", "You joined community");
                refetch();
                myCommRefetch();
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
                myCommRefetch();
            })
            .catch(err => {
                toastify("error", err.data.detail.__all__[0]);
            })
    }

    return (
        <main id="communities">
            <header className="header">
                <Header text={"Communities"} />
                <Profile />
            </header>
            <section>
                <div className="inputs">
                    <div>
                        <Input
                            className="search"
                            placeholder="Search community"
                            prefix={
                                <img alt="" src={Search} style={{ height: 15, width: 15 }} />
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                    </div>
                    <Pagination
                        current={page}
                        onChange={(page) => {
                            setPage(page);
                            window.scrollTo(0, 0);
                        }}
                        total={total * 6} />
                    {user.role === "manager" &&
                        <Button
                            type="primary"
                            style={{
                                alignItems: "center",
                                display: "flex",
                                fontWeight: 500,
                                marginLeft: 16,
                            }}
                            icon={<img alt="" src={Plus} style={{ paddingRight: 5 }} />}
                            onClick={() => setShowAddModal(true)}
                        >
                            Add community
                        </Button>
                    }
                </div>
                <div className="container">
                    <div className="comm-cards">
                        {
                            communities.map((comm) => {
                                const match = myCommunities.find((item) => item.community === comm.id);
                                const isJoined = match !== undefined;
                                return (
                                    <Card
                                        className="comm-card"
                                        key={comm.id}
                                        title={
                                            <TitleWithIcon
                                                icon={comm.is_active ? (
                                                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                                                ) : (
                                                    <CloseCircleTwoTone twoToneColor="#eb4034" />
                                                )}
                                                comm={comm}
                                            />
                                        }
                                        loading={isLoading}
                                    >
                                        <div className="card-content">
                                            <div>
                                                <p>
                                                    <b>{comm.members_count}</b> members
                                                </p>
                                                <p className="link">
                                                    <a href={comm.link}>Link</a>
                                                </p>
                                                <p className="description">{comm.description}</p>
                                            </div>
                                            {user.role === "student" && (
                                                isJoined ? (
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
                                                        onClick={() => handleJoin(comm.id)}
                                                        loading={isMyCommsLoading}
                                                    >
                                                        Join
                                                    </Button>
                                                )
                                            )}
                                            {user.role === "manager" && (
                                                <Button
                                                    className="btn"
                                                    onClick={() => {
                                                        setSelectedComm(comm);
                                                        setShowUpdateModal(true);
                                                    }}
                                                >
                                                    <EditOutlined
                                                        className="icon"
                                                    />
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })
                        }
                        {!isLoading && !communities.length && <Empty className="empty" description="No Data" />}
                    </div>
                    <aside>
                        <h3>Sort by:</h3>
                        <Radio.Group name="order"
                                     value={order}
                                     onChange={(e) => setOrder(e.target.value)}
                        >
                            <Radio className="radio" value={""}>Default</Radio>
                            <Radio className="radio" value={"is_active"}>Is active</Radio>
                            <Radio className="radio" value={"created_at"}>Creation</Radio>
                            <Radio className="radio" value={"updated_at"}>Update</Radio>
                        </Radio.Group>
                        <Divider/>
                        <h3>Status:</h3>
                        <Radio.Group name="status"
                                     value={isActive}
                                     onChange={(e) => setIsActive(e.target.value)}
                        >
                            <Radio className="radio" value={""}>All</Radio>
                            <Radio className="radio" value={"true"}>Active</Radio>
                            <Radio className="radio" value={"false"}>Not active</Radio>
                        </Radio.Group>
                    </aside>
                </div>
            </section>
            <AddCommunityModal
                show={showAddModal}
                setShow={setShowAddModal}
                refetch={refetch}
            />
            <UpdateCommunityModal
                show={showUpdateModal}
                setShow={setShowUpdateModal}
                refetch={refetch}
                community={selectedComm}
            />
        </main>
    );
};

export default CommunitiesPage;