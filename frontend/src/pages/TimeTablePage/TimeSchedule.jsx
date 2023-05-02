import React from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useEffect, useState} from "react";
import {useGetTimeTableQuery} from "../../redux/timeline/timetableApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";

const TimeSchedule = (props) => {
    const user = useSelector(selectCurrentUser);
    const localizer = momentLocalizer(moment);
    const {data: timetableData, isSuccess} = useGetTimeTableQuery(
        {type: props.type, schoolId: user.school_id, courseId: props.courseId, roomId: props.roomId, groupId: props.groupId});
    const [events, setEvents] = useState([]);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        if (isSuccess) {
            const arr = timetableData?.map(event => ({
                id: event.id,
                title: event.course ? `${event.course.subject.name} ${event.course.subject.grade.name}` : 'No course',
                start: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.from_time.split(':')[0])).minute(Number(event.timebound.from_time.split(':')[1])).toDate(),
                end: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.to_time.split(':')[0])).minute(Number(event.timebound.to_time.split(':')[1])).toDate(),
                room: event.room.name,
                timeBound: `${event.timebound.from_time} - ${event.timebound.to_time}`,
                course: event.course,
            }))
            setEvents(arr);
            console.log(arr);
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
    return (
        <div>
            <Calendar
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
                            </div>
                        );
                    },
                }}
                eventOverlap="overlap"
            />
        </div>
    );
};
TimeSchedule.defaultProps = {
    groupId: "",
    courseId: "",
    roomId: "",
}

export default TimeSchedule;

