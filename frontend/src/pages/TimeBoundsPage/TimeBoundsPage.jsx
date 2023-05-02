import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {
    useAddTimeBoundMutation,
    useDeleteTimeBoundMutation,
    useGetTimeBoundsQuery, useUpdateTimeBoundMutation
} from "../../redux/timeline/timeboundsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import {Table, TimePicker, Button, Radio, Spin} from "antd";
import "./TimeBoundsPage.css";
import {DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {toastify} from "../../components/shared/Toast/Toast";

const TimeBoundsPage = () => {
    const user = useSelector(selectCurrentUser);
    const [order, setOrder] = useState("from_time");
    const {data: timeBoundsData, isLoading, isSuccess, refetch} =
        useGetTimeBoundsQuery({schoolId: user.school_id, order});
    const [timeBounds, setTimeBounds] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [timePickerKey, setTimePickerKey] = useState(0);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [defaultStartTime, setDefaultStartTime] = useState(null);
    const [defaultEndTime, setDefaultEndTime] = useState(null);
    const [selectedRow, setSelectedRow] = useState();
    const [addTimeBound] = useAddTimeBoundMutation();
    const [deleteTimeBound] = useDeleteTimeBoundMutation();
    const [updateTimeBound] = useUpdateTimeBoundMutation();

    useEffect(() => {
        if (isSuccess) {
            setTimeBounds(timeBoundsData);
        }
    }, [timeBoundsData, isSuccess])

    const columns = [
        {
            title: 'From',
            key: 'from',
            render: (time) => (
                <div>
                    {time.from_time}
                </div>
            ),
        },
        {
            title: 'To',
            key: 'to',
            render: (time) => (
                <div>
                    {time.to_time}
                </div>
            ),
        },
        {
            title: "Delete",
            key: "delete",
            render: (_, time) => (
                <DeleteOutlined
                    className="delete"
                    key="delete"
                    onClick={() => handleTimeBoundDelete(time.id)}
                />
            ),
        },
    ]

    const rowSelection = {
        type: "radio",
        selectedRow,
        onChange: (keys, selectedRows) => {
            setTimePickerKey(timePickerKey + 2);
            const sr = selectedRows[0];
            setSelectedRow(sr);
            const startMoment = dayjs(sr.from_time, "HH:mm:ss");
            const endMoment = dayjs(sr.to_time, "HH:mm:ss");
            setDefaultStartTime(startMoment);
            setDefaultEndTime(endMoment);
        },
    };

    const handleTimeBoundAdd = async () => {
        addTimeBound({schoolId: user.school_id, from_time: startTime, to_time: endTime})
            .unwrap()
            .then(() => {
                refetch();
                setStartTime(null);
                setEndTime(null);
                toastify("success", "Time bound added");
            })
            .catch((err) => {
                console.log(err);
                toastify("error", err.data.detail.__all__[0])
            })
            .finally(() => {
                setStartTime(null);
                setEndTime(null);
            })
    }

    const handleTimeBoundUpdate = async () => {
        const from_time = selectedStartTime??dayjs(defaultStartTime.$d).format("HH:mm:ss");
        const to_time = selectedEndTime??dayjs(defaultEndTime.$d).format("HH:mm:ss");
        console.log(from_time, to_time);
        updateTimeBound({id: selectedRow.id, from_time, to_time})
            .unwrap()
            .then(() => {
                refetch();
                setStartTime(null);
                setEndTime(null);
                toastify("success", "Time bound updated");
            })
            .catch((err) => {
                console.log(err);
                toastify("error", err.data.detail.__all__[0])
            })
    }

    const handleTimeBoundDelete = async (id) => {
        deleteTimeBound(id)
            .unwrap()
            .then(() => {
                refetch();
                toastify("success", "Time bound removed");
            })
            .catch((err) => {
                console.log(err);
                toastify("error", "Time bound delete failed");
            })
    }

    return (
        <main id="timebounds">
            <header className="header">
                <Header text={"Time bounds"} />
                <Profile />
            </header>
            <section>
                <div className="table">
                    <Spin spinning={isLoading}>
                        <Table
                            rowKey={(record) => record.id}
                            columns={columns}
                            dataSource={timeBounds}
                            pagination={false}
                            rowSelection={rowSelection}
                        >
                        </Table>
                    </Spin>
                </div>
                <div className="forms">
                    <div className="add-form">
                        <h3>Add new time bound</h3>
                        <TimePicker.RangePicker
                            value={[startTime ? dayjs(startTime, "HH:mm:ss") : undefined, endTime ? dayjs(endTime, "HH:mm:ss") : undefined]}
                            onChange={([st, et]) => {
                                setStartTime(st ? dayjs(st.$d).format("HH:mm:ss") : null);
                                setEndTime(et ? dayjs(et.$d).format("HH:mm:ss") : null);
                            }}
                            format="HH:mm"
                            showTime={{ format: 'HH:mm' }}
                            allowClear={false}
                        />
                        <Button type={"primary"} onClick={handleTimeBoundAdd}>Add</Button>
                    </div>
                    <div className="edit-form">
                        <h3>Change time bound</h3>
                        <div className="pickers">
                            <TimePicker
                                key={timePickerKey}
                                disabled={defaultStartTime===null}
                                defaultValue={defaultStartTime}
                                // value={selectedStartTime}
                                onChange={(st) => {
                                    setSelectedStartTime(dayjs(st.$d).format("HH:mm:ss"));
                                }}
                                format="HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                allowClear={false}
                            />
                            <TimePicker
                                key={timePickerKey+1}
                                disabled={defaultEndTime===null}
                                defaultValue={defaultEndTime}
                                // value={selectedEndTime}
                                onChange={(et) => {
                                    setSelectedEndTime(dayjs(et.$d).format("HH:mm:ss"));
                                }}
                                format="HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                allowClear={false}
                            />
                        </div>

                        <Button type={"primary"} onClick={handleTimeBoundUpdate}>Change</Button>
                    </div>
                </div>

                <div className="sort">
                    <h3>Sort by:</h3>
                    <Radio.Group name="order"
                                 value={order}
                                 onChange={(e) => setOrder(e.target.value)}
                    >
                        <Radio className="radio" value={"from_time"}>From time ascending</Radio>
                        <Radio className="radio" value={"-from_time"}>From time descending</Radio>
                        <Radio className="radio" value={"to_time"}>To time descending</Radio>
                        <Radio className="radio" value={"-to_time"}>To time ascending</Radio>
                        <Radio className="radio" value={"created_at"}>Creation</Radio>
                        <Radio className="radio" value={"updated_at"}>Update</Radio>
                    </Radio.Group>
                </div>
            </section>
        </main>
    );
};

export default TimeBoundsPage;