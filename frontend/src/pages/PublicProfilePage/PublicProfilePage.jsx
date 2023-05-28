import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {useGetLeaderBoardQuery, useGetStudentQuery} from "../../redux/students/studentsApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import "./PublicProfilePage.css";
import {Alert, Card, Spin} from "antd";
import RatingChart from "./Chart";
import {useGetStudentAwardsQuery} from "../../redux/awards/awardsApiSlice";
import {useGetStudentMembershipsQuery} from "../../redux/communities/communitiesApiSlice";
import {ArrowRightOutlined} from "@ant-design/icons";

const PublicProfilePage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data: studentData, isSuccess: isStudentSuccess} = useGetStudentQuery(id);
    const [student, setStudent] = useState();
    const [students, setStudents] = useState([]);
    const [awards, setAwards] = useState([]);
    const [comms, setComms] = useState([]);
    const {data: studentsData, isSuccess, isLoading} =
        useGetLeaderBoardQuery(student?.user?.school_id)
    const [place, setPlace] = useState(0);
    const {data: awardsData, isSuccess: isAwardsSuccess, isLoading: isAwLoading} = useGetStudentAwardsQuery(student?.id);
    const {data: commsData, isSuccess: isCommsSuccess, isLoading: isCommsLoading} = useGetStudentMembershipsQuery(student?.id);

    useEffect(() => {
        if (isStudentSuccess) {
            setStudent(studentData);
        }
    }, [studentData, isStudentSuccess])

    useEffect(() => {
        if (isAwardsSuccess) {
            setAwards(awardsData.results);
        }
    }, [awardsData, isAwardsSuccess])

    useEffect(() => {
        if (isCommsSuccess) {
            setComms(commsData.results);
        }
    }, [commsData, isCommsSuccess])

    useEffect(() => {
        let arr = [];
        if (isSuccess) {
            let cnt = 1;
            for (let s of studentsData) {
                if (s.user.id === student.user.id) {
                    setPlace(cnt);
                }
                arr.push({rating: s.user.rating, name: cnt} )
                cnt++;
            }
            setStudents(arr);
        }
    }, [studentsData, isSuccess])


    return (
        <main id="profile">
            <header className="header">
                <Header text={"Student Profile"} />
                <Profile />
            </header>
            <section>
                <div className="top">
                    <div className="main">
                        <div className="img-con">
                            <img
                                src={
                                    student.user?.avatar
                                        ? student.user?.avatar
                                        : student.user?.gender === "male"
                                            ? require("../../assets/icons/boy.png")
                                            : require("../../assets/icons/girl.png")
                                }
                            />
                            <h2>{student?.user?.first_name} {student?.user?.last_name}</h2>
                        </div>
                    </div>
                    <div className="group">
                        <h3>School rating</h3>
                        <RatingChart students={students} currentStudent={place} />
                    </div>
                </div>
                <div className="bottom">
                    <div className="double">
                        <div className="group info">
                            <Spin spinning={isLoading}>
                                {
                                    student?.group === null &&
                                    <Alert message={"This student doesn't have group yet"} />
                                }
                                {
                                    student?.group !== null &&
                                    <div>
                                        <p>Group: <span>{student?.group?.code}</span></p>
                                        <p>Grade: <span>{student?.group?.grade?.name}</span></p>
                                        <p>Teacher: <span>{student?.group?.teacher?.first_name} {student?.group?.teacher?.last_name}</span></p>
                                    </div>
                                }
                            </Spin>
                        </div>
                        {
                            student?.group !== null &&
                            <div className="group comm">
                                <h3>Communities</h3>
                                <Spin spinning={isCommsLoading}>
                                    {
                                        comms.map(c => (
                                            <div className="comm-item">
                                                <p>{c.community.name}</p>
                                                <ArrowRightOutlined onClick={() => navigate(`../communities/${c.community.id}`, { replace: true })}/>
                                            </div>
                                        ))
                                    }
                                    {
                                        !isCommsLoading && !comms.length &&
                                        <Alert message={"There are no joined communities yet"} />
                                    }
                                </Spin>
                            </div>
                        }
                    </div>
                    {
                        student?.group !== null &&
                        <div className="group">
                            <h3>Awards</h3>
                            <Spin spinning={isAwLoading}>
                                {
                                    awards.map(aw => (
                                        <div className="award">
                                            <p style={{cursor: "pointer"}} onClick={() => navigate(`../awards/${aw.award.id}/winners`, { replace: true })}>{aw.award.name}</p>
                                            <span>+{aw.award.points}</span>
                                        </div>
                                    ))
                                }
                                {
                                    !isAwLoading && !awards.length &&
                                    <Alert message={"There are no awards yet"} />
                                }
                            </Spin>
                        </div>
                    }
                </div>
            </section>
        </main>
    );
};

export default PublicProfilePage;