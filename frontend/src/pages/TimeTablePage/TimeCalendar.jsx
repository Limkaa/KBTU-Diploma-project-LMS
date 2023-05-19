import React from 'react';
import {useGetTimeTableQuery} from "../../redux/timeline/timetableApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {useEffect, useState} from "react";
import moment from "moment";
import {Alert, Spin, Button} from "antd";
import {Calendar, momentLocalizer} from "react-big-calendar";
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useGetStudentQuery} from "../../redux/students/studentsApiSlice";

const TimeCalendar = (props) => {
    const user = useSelector(selectCurrentUser);
    const {id} = useParams();
    const navigate = useNavigate();
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const {data: studentData, isSuccess: isStudentSuccess, error} = useGetStudentQuery(user.user_id);
    const [student, setStudent] = useState();
    const {data: timetableData, isSuccess, isLoading} = useGetTimeTableQuery(
        {type: props.type, schoolId: user.school_id,
            courseId: id,
            roomId: id,
            groupId: id,
            teacherId: user.user_id,
            studentGroupId: student?.group?.id,
        });
    const [isGroup, setIsGroup] = useState(true);

    useEffect(() => {
        if (isStudentSuccess) {
            setStudent(studentData);
        }
    }, [studentData, isStudentSuccess])

    useEffect(() => {
        if (error && props.type === "student") {
            console.log(error);
            setIsGroup(false);
        }
        else {
            setIsGroup(true);
        }
    }, [error])

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        if (isSuccess) {
            console.log(timetableData);
            const arr = timetableData?.map(event => ({
                id: event.id,
                title: event.course ? `${event.course?.subject?.name} ${event.course?.subject?.grade?.name}` : 'No course',
                start: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.from_time.split(':')[0])).minute(Number(event.timebound.from_time.split(':')[1])).toDate(),
                end: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.to_time.split(':')[0])).minute(Number(event.timebound.to_time.split(':')[1])).toDate(),
                room: event.room.name,
                timeBound: `${event.timebound.from_time} - ${event.timebound.to_time}`,
                course: event.course,
                teacher: event.course ? `${event.course?.teacher?.first_name} ${event.course?.teacher?.last_name}` : "No teacher",
            }))
            setEvents(arr);
        }
    }, [timetableData, isSuccess])

    const formats = {
        dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dddd', culture),
        timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
        eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
            const timeFormat = 'HH:mm';
            return `${localizer.format(start, timeFormat, culture)} - ${localizer.format(
                end,
                timeFormat,
                culture
            )}`;
        },
    };

    const goBack = () => {
        navigate(-1);
    }

    return (
        <main id="timetable">
            <header className="header">
                <Header text={"Time table"} />
                <Profile />
            </header>
            {isGroup &&
                <section className="schedule">
                    <Button onClick={goBack} className="back"><ArrowLeftOutlined /></Button>
                    <div className="calendar">
                        <Spin spinning={isLoading}>
                            <Calendar
                                // className="calendar"
                                localizer={localizer}
                                events={events}
                                formats={formats}
                                defaultView="week"
                                views={['week', 'day']}
                                toolbar={{
                                    views: ['day', 'week'],
                                }}
                                min={moment().hour(6).minute(0).toDate()}
                                max={moment().hour(23).minute(0).toDate()}
                                step={60}
                                timeslots={1}
                                firstDay={1}
                                eventPropGetter={() => {
                                    const style = {
                                        backgroundColor: '#00899E',
                                        borderRadius: '3px',
                                        color: 'white',
                                        border: '1px solid white',
                                        display: 'block',
                                    };
                                    return {
                                        style,
                                    };
                                }}
                                components={{
                                    event: (props) => {
                                        return (
                                            <div>
                                                <div>{props.event.title}</div>
                                                <div>{props.event.room}</div>
                                                <div>{props.event.teacher}</div>
                                            </div>
                                        );
                                    },
                                }}
                                eventOverlap="overlap"
                            />
                        </Spin>
                    </div>
                </section>
            }
            {!isGroup &&
                <Alert style={{margin: "20px 0"}} message="You don't have a group yet" type="info" showIcon/>
            }
        </main>

    );
};

export default TimeCalendar;