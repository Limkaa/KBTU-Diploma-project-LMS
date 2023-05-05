import React, {useEffect, useState} from 'react';
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
import {Button, Input, Modal, Spin, Table, Select as AntSelect, Radio} from "antd";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {useGetAllSchoolCoursesQuery} from "../../redux/courses/coursesApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";
import {MinusOutlined} from "@ant-design/icons";
import Search from "../../assets/icons/search.svg";
import {useGetAllRoomsQuery} from "../../redux/timeline/roomsApiSlice";
import {useGetAllTimeBoundsQuery} from "../../redux/timeline/timeboundsApiSlice";

const TimeTable = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [weekday, setWeekday] = useState("");
    const [timeBound, setTimeBound] = useState("");
    const [courseId, setCourseId] = useState("");
    const [room, setRoom] = useState("");
    const [noCourse, setNoCourse] = useState("");
    const [search, setSearch] = useState("");
    const {data: timetableData, isSuccess, isLoading, refetch} = useGetSchoolTimeTableQuery(
        {schoolId: user.school_id, weekday, timeBound, courseId, room, noCourse, search, page});
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState();
    const {data: coursesData, isSuccess: isCoursesSuccess} = useGetAllSchoolCoursesQuery(user.school_id);
    const [updateTimeSlot] = useUpdateTimeSlotMutation();
    const [coursesOptions, setCoursesOptions] = useState([]);
    const [roomsOptions, setRoomsOptions] = useState([]);
    const [tbOptions, setTBOptions] = useState([]);
    const [course, setCourse] = useState({});
    const [selectedRow, setSelectedRow] = useState([]);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const {data: roomsData, isSuccess: isRoomsSuccess} = useGetAllRoomsQuery(user.school_id);
    const {data: tbData, isSuccess: isTBSuccess} = useGetAllTimeBoundsQuery(user.school_id);

    useEffect(() => {
        if (isSuccess) {
            if (page === 1) setTotal(timetableData.count);
            setEvents(timetableData.results);
        }
    }, [timetableData, isSuccess])

    useEffect(() => {
        let arr = [{ value: "", label: "All courses" }];
        if (isCoursesSuccess) {
            coursesData.forEach((course) => {
                arr.push({ value: course.id, label: `${course?.subject.name}(${course?.subject.code})` });
            });
            setCoursesOptions(arr);
        }
    }, [coursesData, isCoursesSuccess])

    useEffect(() => {
        let arr = [{ value: "", label: "All rooms" }];
        if (isRoomsSuccess) {
            roomsData.forEach(room => {
                arr.push({ value: room.id, label: `${room.name}` });
            });
            setRoomsOptions(arr);
        }
    }, [roomsData, isRoomsSuccess])

    useEffect(() => {
        let arr = [{ value: "", label: "All time bounds" }];
        if (isTBSuccess) {
            tbData.forEach(tb => {
                arr.push({ value: tb.id, label: `${tb.from_time.slice(0, -3)} - ${tb.to_time.slice(0, -3)}`});
            });
            setTBOptions(arr);
        }
    }, [tbData, isTBSuccess])

    const columns = [
        {
            title: 'Time',
            key: 'time',
            width: "10%",
            render: (slot) => (
                <div>
                    {slot.timebound.from_time.slice(0, -3)} {slot.timebound.to_time.slice(0, -3)}
                </div>
            ),
        },
        {
            title: "Weekday",
            key: "weekday",
            width: "17%",
            render: (slot) => (
                <div>
                    {weekdays[slot.weekday]}
                </div>
            )
        },
        {
            title: "Room",
            key: "room",
            width: "9%",
            render: (slot) => (
                <div>
                    {slot.room.name}
                </div>
            ),
        },
        {
            title: "Subject",
            key: "subject",
            width: "21%",
            render: (slot) => (
                <div>
                    {slot.course?.subject?.name ?
                        `${slot.course.subject.name} (${slot.course.subject.code})` : <MinusOutlined />}
                </div>
            )
        },
        {
            title: "Grade",
            key: "grade",
            width: "13%",
            render: (slot) => (
                <div>
                    {slot.course?.subject?.grade?.name??<MinusOutlined />}
                </div>
            )
        },
        {
            title: "Teacher",
            key: "teacher",
            width: "30%",
            render: (slot) => (
                <div>
                    {slot.course !== null && slot.course.teacher !== null ?
                        `${slot.course.teacher?.first_name} ${slot.course.teacher?.last_name}`
                        : <MinusOutlined />}
                </div>
            )
        },
    ];

    const rowSelection = {
        type: "radio",
        selectedRow,
        onChange: (keys, selectedRows) => {
            setSelectedRow(selectedRows[0]);
        },
    };

    const handleCourseChange = async () => {
        updateTimeSlot({slotId: selectedRow.id, course})
            .unwrap()
            .then(() => {
                refetch();
                toastify("success", "Time slot course updated");
            })
            .catch((err) => {
                toastify("error", "This course already has lesson at that time and weekday");
            })
    }

    return (
        <section>
            <div className="group slots">
                <Spin spinning={isLoading}>
                    <Table
                        rowKey={(record) => record.id}
                        columns={columns}
                        dataSource={events}
                        pagination={{
                            total: total,
                            current: page,
                            onChange: (page) => {
                                setPage(page);
                                window.scrollTo(0,0);
                            },
                            showSizeChanger: false,
                        }}
                        rowSelection={rowSelection}
                    />
                </Spin>
            </div>
            <aside>
                <div className="search">
                    <Input
                        placeholder="Search code"
                        prefix={
                            <img alt="" src={Search} style={{ height: 15, width: 15 }} />
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    />
                </div>
                <div className="group add">
                    <h2>Change time slots' course</h2>
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
                                    <MenuItem key={course?.value} value={course?.value}>
                                        {course?.label})
                                    </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <Button type={"primary"} className="btn"
                            onClick={handleCourseChange}
                    >Update group</Button>
                </div>
                <div className="group add filters">
                    <div className="select">
                        <Radio.Group name="order"
                                     size={"small"}
                                     style={{width: '100%', marginBottom: 7}}
                                     value={noCourse}
                                     onChange={(e) => setNoCourse(e.target.value)}
                        >
                            <Radio.Button className="radio" value={""}>All</Radio.Button>
                            <Radio.Button className="radio" value={"False"}>With course</Radio.Button>
                            <Radio.Button className="radio" value={"True"}>No course</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="select">
                        <h3>Weekday:</h3>
                        <AntSelect
                            size={"small"}
                            style={{width: '100%'}}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                            onChange={(val) => setWeekday(val)}
                            options={(() => {
                                let arr = [{ value: "", label: "All weekdays" }];
                                for (let i = 0; i < weekdays.length; i++) {
                                    arr.push({label: weekdays[i], value: String(i)})
                                }
                                return arr;
                            })()}
                            defaultValue={""}
                            value={weekday}
                        />
                    </div>
                    <div className="select">
                        <h3>Course:</h3>
                        <AntSelect
                            size={"small"}
                            style={{width: '100%'}}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                            onChange={(val) => setCourseId(val)}
                            options={coursesOptions}
                            defaultValue={""}
                            value={courseId}
                        />
                    </div>
                    <div className="select">
                        <h3>Room:</h3>
                        <AntSelect
                            size={"small"}
                            style={{width: '100%'}}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                            onChange={(val) => setRoom(val)}
                            options={roomsOptions}
                            defaultValue={""}
                            value={room}
                        />
                    </div>
                    <div className="select">
                        <h3>Time:</h3>
                        <AntSelect
                            size={"small"}
                            style={{width: '100%'}}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                            onChange={(val) => setTimeBound(val)}
                            options={tbOptions}
                            defaultValue={""}
                            value={timeBound}
                        />
                    </div>
                </div>
            </aside>
        </section>
    );
};

export default TimeTable;