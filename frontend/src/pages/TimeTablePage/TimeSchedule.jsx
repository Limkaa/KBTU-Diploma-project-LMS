import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useEffect, useState} from "react";
import {useGetTimeTableQuery} from "../../redux/timeline/timetableApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {useGetAllSchoolCoursesQuery} from "../../redux/courses/coursesApiSlice";
import {useGetAllRoomsQuery} from "../../redux/timeline/roomsApiSlice";
import {Radio, Select, Select as AntSelect, Spin} from "antd";
import {useGetAllActiveGroupsQuery} from "../../redux/groups/groupsApiSlice";
import {useGetTeachersQuery} from "../../redux/users/usersApiSlice";

const TimeSchedule = (props) => {
    const user = useSelector(selectCurrentUser);
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [tbType, setTBType] = useState("course");

    const {data: coursesData, isSuccess: isCoursesSuccess} = useGetAllSchoolCoursesQuery(user.school_id);
    const {data: roomsData, isSuccess: isRoomsSuccess} = useGetAllRoomsQuery(user.school_id);
    const {data: groupsData, isSuccess: isGroupsSuccess} = useGetAllActiveGroupsQuery(user.school_id);
    const { data: teachersData, isSuccess: isTeachersSuccess } = useGetTeachersQuery(user.school_id);

    const [courseId, setCourseId] = useState();
    const [roomId, setRoomId] = useState();
    const [groupId, setGroupId] = useState();
    const [teacherId, setTeacherId] = useState();

    const {data: timetableData, isSuccess, isLoading} = useGetTimeTableQuery(
        {type: tbType, schoolId: user.school_id,
            courseId,
            roomId,
            groupId,
            teacherId,
        });

    const [coursesOptions, setCoursesOptions] = useState([]);
    const [roomsOptions, setRoomsOptions] = useState([]);
    const [groupsOptions, setGroupsOptions] = useState([]);
    const [teachersOptions, setTeachersOptions] = useState([]);

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        if (isSuccess) {
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

    useEffect(() => {
        if (coursesOptions !== undefined) {
            setCourseId(coursesOptions[0]?.value);
        }
    }, [coursesOptions])

    useEffect(() => {
        let arr = [];
        if (isCoursesSuccess) {
            coursesData.forEach((course) => {
                arr.push({ value: course.id, label: `${course?.subject.name}(${course?.subject.code})` });
            });
            setCoursesOptions(arr);
        }
    }, [coursesData, isCoursesSuccess])

    useEffect(() => {
        let arr = [];
        if (isRoomsSuccess) {
            roomsData.forEach(room => {
                arr.push({ value: room.id, label: `${room.name}` });
            });
            setRoomsOptions(arr);
        }
    }, [roomsData, isRoomsSuccess])

    useEffect(() => {
        let arr = [];
        if (isGroupsSuccess) {
            groupsData.forEach((group) => {
                arr.push({ value: group.id, label: `${group.code}` });
            });
            setGroupsOptions(arr);
        }
    }, [groupsData, isGroupsSuccess])

    useEffect(() => {
        let arr = [];
        if (isTeachersSuccess) {
            teachersData.forEach((user) => {
                arr.push({
                    value: user.id,
                    label: `${user.first_name} ${user.last_name}`,
                });
            });
            setTeachersOptions(arr);
        }
    }, [isTeachersSuccess, teachersData]);

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

    const handleTypeChange = (e) => {
        let value = e.target.value;
        setTBType(value);
        if (value === "course") {
            setCoursesOptions(coursesOptions);
            setCourseId(coursesOptions[0].value);
        } else if (value === "teacher") {
            setTeachersOptions(teachersOptions);
            setTeacherId(teachersOptions[0].value)
        } else if (value === "group") {
            setGroupsOptions(groupsOptions);
            setGroupId(groupsOptions[0].value);
        } else if (value === "room") {
            setRoomsOptions(roomsOptions);
            setRoomId(roomsOptions[0].value);
        }
    };

    const handleSelectChange = (value) => {
        if (tbType === "group") {
            setGroupId(value);
        } else if (tbType === "teacher") {
            setTeacherId(value);
        } else if (tbType === "room") {
            setRoomId(value);
        } else if (tbType === "course") {
            setCourseId(value);
        }
    };

    return (
        <section className="schedule">
            {user.role === "manager" &&
                <div className="filters">
                    <Radio.Group
                        size={"small"}
                        style={{ marginRight: 10 }}
                        value={tbType}
                        onChange={handleTypeChange}
                    >
                        <Radio.Button value="course">Course</Radio.Button>
                        <Radio.Button value="room">Room</Radio.Button>
                        <Radio.Button value="group">Group</Radio.Button>
                        <Radio.Button value="teacher">Teacher</Radio.Button>
                    </Radio.Group>
                    <div>
                        {tbType === "teacher" && (
                            <AntSelect
                                size={"small"}
                                style={{width: '150px'}}
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={handleSelectChange}
                                options={teachersOptions}
                                defaultValue={teachersOptions[0]}
                                value={teacherId}
                            />
                        )}
                        {tbType === "course" && (
                            <AntSelect
                                size={"small"}
                                style={{width: '150px'}}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={handleSelectChange}
                                options={coursesOptions}
                                defaultValue={coursesOptions[0]}
                                value={courseId}
                            />
                        )}
                        {tbType === "room" &&
                            <AntSelect
                                size={"small"}
                                style={{width: '150px'}}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={handleSelectChange}
                                options={roomsOptions}
                                defaultValue={roomsOptions[0]}
                                value={roomId}
                            />
                        }
                        {tbType === "group" &&
                            <AntSelect
                                size={"small"}
                                style={{width: '150px'}}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").includes(input)
                                }
                                onChange={handleSelectChange}
                                options={groupsOptions}
                                defaultValue={groupsOptions[0]}
                                value={groupId}
                            />
                        }
                    </div>
                </div>
            }
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
    );
};
// TimeSchedule.defaultProps = {
//     type: "course",
//     groupId: "",
//     courseId: "",
//     roomId: "",
// }

export default TimeSchedule;

