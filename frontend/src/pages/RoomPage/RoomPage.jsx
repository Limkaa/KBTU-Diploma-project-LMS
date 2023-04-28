import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import './RoomPage.css';
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {Button, Card, Checkbox, Divider, Input, Modal, Pagination, Radio, Spin, Tag} from "antd";
import {
    useAddRoomMutation,
    useDeleteRoomMutation,
    useGetRoomsQuery,
    useUpdateRoomMutation
} from "../../redux/rooms/roomsApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import {toastify} from "../../components/shared/Toast/Toast";

const RoomPage = () => {
    const user = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("name");
    const [search, setSearch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState({});
    const [name, setName] = useState();
    const [isActive, setIsActive] = useState(true);
    const [total, setTotal] = useState();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {data: roomsData, isLoading: isRoomsLoading, isSuccess: isRoomsSuccess, refetch} =
        useGetRoomsQuery({schoolId: user.school_id, page, order, search});
    const [rooms, setRooms] = useState([]);
    const [updateRoom] = useUpdateRoomMutation();
    const [addRoom] = useAddRoomMutation();
    const [deleteRoom] = useDeleteRoomMutation();

    useEffect(() => {
        if (isRoomsSuccess) {
            if (page === 1) setTotal(roomsData?.count);
            setRooms(roomsData.results);
        }
    }, [roomsData, isRoomsSuccess]);

    const saveRoom = async () => {
        console.log(selectedRoom);
        updateRoom({roomId: selectedRoom.id, ...selectedRoom})
            .unwrap()
            .then(() => {
                setShowModal(false);
                refetch();
                toastify("success", "Room updated");
            })
            .catch((err) => {
                setShowModal(false);
                console.log(err);
                toastify("error", err.data.detail.__all__[0]);
            })
    }

    const handleAddRoom = async () => {
        addRoom({schoolId: user.school_id, name, is_active: isActive})
            .unwrap()
            .then(() => {
                setShowAddModal(false);
                refetch();
                toastify("success", `Room "${name}" added`);
            })
            .catch((err) => {
                setShowAddModal(false);
                toastify("error", err.data.detail.__all__[0]);
            })
    }

    const handleDeleteRoom = async (id) => {
        deleteRoom(id)
            .unwrap()
            .then(() => {
                refetch();
                toastify("success", `Room deleted`);
            })
            .catch(() => {
                toastify("error", "Room deleting failed");
            })
    }

    return (
        <main id="room">
            <header className="header">
                <Header text={"Rooms"} />
                <Profile />
            </header>
            <section>
                <div className="inputs">
                    <div>
                        <Input
                            className="search"
                            placeholder="Search room"
                            prefix={
                                <img alt="" src={Search} style={{ height: 15, width: 15 }} />
                            }
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                        <Radio.Group name="order"
                                     value={order}
                                     onChange={(e) => setOrder(e.target.value)}
                        >
                            <Radio.Button className="radio" value={"name"}>Name</Radio.Button>
                            <Radio.Button className="radio" value={"created_at"}>Creation</Radio.Button>
                            <Radio.Button className="radio" value={"updated_at"}>Update</Radio.Button>
                        </Radio.Group>
                    </div>
                    <Button
                        type="primary"
                        style={{
                            alignItems: "center",
                            display: "flex",
                            fontWeight: 500,
                            marginLeft: 16,
                        }}
                        icon={<img alt="" src={Plus} style={{ paddingRight: 5 }} />}
                        onClick={() => {
                            setShowAddModal(true);
                        }}
                    >
                        Add room
                    </Button>
                </div>
                <Spin spinning={isRoomsLoading}>
                    <div className="cards">
                        {rooms.map((room) =>
                            <Card className="card"
                                  key={room.id}
                                  actions={[
                                      <EditOutlined
                                          key="edit"
                                          onClick={() => {
                                              setSelectedRoom(room);
                                              setShowModal(true);
                                          }}
                                      />,
                                      <DeleteOutlined
                                          className="delete"
                                          key="delete"
                                          onClick={() => handleDeleteRoom(room.id)}
                                      />,
                                  ]}
                            >
                                <div className="card-content">
                                    {room.name}
                                    {room.is_active ?
                                        <Tag style={{minWidth: 60, textAlign: "center", margin: 0}}
                                             color="green">
                                            active
                                        </Tag> :
                                        <Tag style={{ minWidth: 60, textAlign: "center", margin: 0}}
                                             color="volcano">
                                            inactive
                                        </Tag>}
                                </div>
                            </Card>
                        )}
                    </div>
                    <div className="pagination">
                        <Pagination
                            current={page}
                            onChange={(page) => {
                                setPage(page);
                                window.scrollTo(0, 0);
                            }}
                            total={total} />
                    </div>
                    <Modal
                        width={250}
                        title="Enter new room name"
                        open={showModal}
                        onCancel={() => setShowModal(false)}
                        footer={
                            <Button type={"primary"} key="update" onClick={saveRoom}>
                                Update
                            </Button>}
                    >
                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <Input
                                value={selectedRoom.name}
                                onChange={(e) => setSelectedRoom({...selectedRoom, name: e.target.value})}
                                placeholder="Enter room name"/>
                            <Checkbox
                                defaultChecked={selectedRoom.is_active}
                                onChange={(e) => setSelectedRoom({...selectedRoom, is_active: e.target.checked})}
                                checked={selectedRoom.is_active}
                            >Is active
                            </Checkbox>
                        </div>
                    </Modal>
                    <Modal
                        width={250}
                        title="Enter new room name"
                        open={showAddModal}
                        onCancel={() => setShowAddModal(false)}
                        footer={
                            <Button type={"primary"} key="add" onClick={handleAddRoom}>
                                Add
                            </Button>}
                    >
                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter room name"/>
                            <Checkbox
                                onChange={(e) => setIsActive(e.target.checked)}
                                checked={isActive}
                            >Is active
                            </Checkbox>
                        </div>
                    </Modal>
                </Spin>
            </section>
        </main>
    );
};

export default RoomPage;