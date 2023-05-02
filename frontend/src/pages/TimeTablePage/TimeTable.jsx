import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./TimeTablePage.css";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {
    useGetSchoolTimeTableQuery,
    useGetTimeTableQuery,
    useUpdateTimeSlotMutation
} from "../../redux/timeline/timetableApiSlice";
import {Button, Modal, Spin} from "antd";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {useGetAllSchoolCoursesQuery} from "../../redux/courses/coursesApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";

const TimeTable = () => {
    // const localizer = momentLocalizer(moment);
    const user = useSelector(selectCurrentUser);
    const [weekday, setWeekday] = useState("");
    const [timeBound, setTimeBound] = useState("");
    const [courseId, setCourseId] = useState("");
    const [room, setRoom] = useState("");
    const [noCourse, setNoCourse] = useState("");
    const [search, setSearch] = useState("");
    const {data: timetableData, isSuccess, isLoading, refetch} = useGetSchoolTimeTableQuery(
        {schoolId: user.school_id, weekday, timeBound, courseId, room, noCourse, search});
    // const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();
    const {data: coursesData, isSuccess: isCoursesSuccess} = useGetAllSchoolCoursesQuery(user.school_id);
    const [updateTimeSlot] = useUpdateTimeSlotMutation();
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [course, setCourse] = useState({});



    // useEffect(() => {
    //     if (isSuccess) {
    //         const arr = timetableData?.map(event => ({
    //             id: event.id,
    //             title: event.course ? `${event.course.subject.name} ${event.course.subject.grade.name}` : 'No course',
    //             start: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.from_time.split(':')[0])).minute(Number(event.timebound.from_time.split(':')[1])).toDate(),
    //             end: moment().day(weekdays[event.weekday]).hour(Number(event.timebound.to_time.split(':')[0])).minute(Number(event.timebound.to_time.split(':')[1])).toDate(),
    //             room: event.room.name,
    //             timeBound: `${event.timebound.from_time} - ${event.timebound.to_time}`,
    //             course: event.course,
    //         }))
    //         setEvents(arr);
    //         console.log(arr);
    //     }
    // }, [timetableData, isSuccess])

    useEffect(() => {
        if (isCoursesSuccess) {
            setCoursesOptions(coursesData);
        }
    }, [coursesData, isCoursesSuccess])

    // const formats = {
    //     dayFormat: (date, culture, localizer) =>
    //         localizer.format(date, 'dddd', culture),
    //     timeGutterFormat: (date, culture, localizer) =>
    //         localizer.format(date, 'HH:mm', culture),
    //     eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
    //         const timeFormat = 'HH:mm';
    //         return `${localizer.format(start, timeFormat, culture)} - ${localizer.format(
    //             end,
    //             timeFormat,
    //             culture
    //         )}`;
    //     },
    // };

    const saveTimeSlot = async () => {
        updateTimeSlot({slotId: selectedEvent.id, course})
            .unwrap()
            .then(() => {
                setIsModalOpen(false);
                refetch();
                toastify("success", "Time slot course updated");
            })
            .catch((err) => {
                setIsModalOpen(false);
                console.log(err);
                toastify("error", "Time slot update failed");
            })
    }

    return (
        <main id="timetable">
            <header className="header">
                <Header text={"Time table"} />
                <Profile />
            </header>
            <section>
                <Spin spinning={isLoading}>

                    {/*<Calendar*/}
                    {/*    localizer={localizer}*/}
                    {/*    events={events}*/}
                    {/*    formats={formats}*/}
                    {/*    defaultView="week"*/}
                    {/*    views={['week', 'day']}*/}
                    {/*    toolbar={{*/}
                    {/*        views: ['day', 'week'],*/}
                    {/*    }}*/}
                    {/*    min={moment().hour(6).minute(0).toDate()}*/}
                    {/*    max={moment().hour(23).minute(0).toDate()}*/}
                    {/*    step={60}*/}
                    {/*    timeslots={1}*/}
                    {/*    firstDay={1}*/}
                    {/*    eventPropGetter={(event, start, end, isSelected) => {*/}
                    {/*        const style = {*/}
                    {/*            backgroundColor: '#00899E',*/}
                    {/*            borderRadius: '3px',*/}
                    {/*            color: 'white',*/}
                    {/*            border: '1px solid white',*/}
                    {/*            display: 'block',*/}
                    {/*        };*/}
                    {/*        return {*/}
                    {/*            style,*/}
                    {/*        };*/}
                    {/*    }}*/}
                    {/*    components={{*/}
                    {/*        event: (props) => {*/}
                    {/*            return (*/}
                    {/*                <div*/}
                    {/*                    onClick={() => {*/}
                    {/*                        setSelectedEvent(props.event);*/}
                    {/*                        setIsModalOpen(true);*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    <div>{props.event.title}</div>*/}
                    {/*                    <div>{props.event.room}</div>*/}
                    {/*                </div>*/}
                    {/*            );*/}
                    {/*        },*/}
                    {/*    }}*/}
                    {/*    eventOverlap="overlap"*/}
                    {/*/>*/}
                </Spin>
                <Modal title="Time table event" open={isModalOpen}
                       onCancel={() => setIsModalOpen(false)}
                       footer={
                           <Button type={"primary"} key="update" onClick={saveTimeSlot}>
                               Update
                           </Button>
                       }>
                    <div>{selectedEvent?.timeBound}</div>
                    <div>{selectedEvent?.title}</div>
                    <div>{selectedEvent?.room}</div>
                    <FormControl
                        sx={{ width: "100%", fieldset: { borderRadius: "10px" } }}
                        size="small"
                    >
                        <InputLabel id="course">Course</InputLabel>
                        <Select
                            labelId="Course"
                            id="course"
                            defaultValue={selectedEvent?.course??""}
                            label="Course"
                            onChange={(e) => {
                                setCourse(e.target.value);
                            }}
                        >
                            {
                                coursesOptions?.map(course =>
                                    <MenuItem key={course?.id} value={course?.id}>
                                        {course?.subject.name}({course?.subject.code})
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <div style={{height: 10}}></div>
                    </FormControl>
                </Modal>
            </section>
        </main>
    );
};

export default TimeTable;