import React, {useEffect, useState} from 'react';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import {Checkbox, Slider, Button, Input, Pagination, Radio, Divider, Empty, Spin} from 'antd';
import "./ToDo.css";
import {
    useDeleteTodoMutation,
    useGetAllTodosQuery,
    useUpdateTodoMutation
} from "../../redux/todo/todoApiSlice";
import {toastify} from "../../components/shared/Toast/Toast";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import AddTodoModal from "./addTodoModal";
import Search from "../../assets/icons/search.svg";
import Plus from "../../assets/icons/plus.svg";
import UpdateTodoModal from "./updateTodoModal";


const TodoPage = () => {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [order, setOrder] = useState("");
    const [search, setSearch] = useState("");
    const [isDone, setIsDone] = useState("");
    const [draggable, setDraggable] = useState(false);
    const [priority, setPriority] = useState("");
    const [todos, setTodos] = useState([]);
    const {data: todosData, isSuccess, isLoading, refetch} =
        useGetAllTodosQuery({page, order, search, isDone, priority});
    const [deleteTodo] = useDeleteTodoMutation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState();
    const [updateTodo] = useUpdateTodoMutation();

    const gradientColors = ['#00899E','#2EB873', '#F2B824', '#EA5A0C'];

    useEffect(() => {
        refetch();
    }, [])

    const sectionStyle = {
        display: 'flex',
        flexBasis: `${100 / gradientColors.length}%`,
        backgroundColor: '#d9dbdb',
        border: 'none',
    };

    const trackStyle = {
        background: `linear-gradient(to right, ${gradientColors.join(', ')})`,
        border: 'none',
        height: '4px',
        width: '100%'
    };

    const handleStyle = {
        borderColor: gradientColors[0],
        backgroundColor: gradientColors[0],
        boxShadow: 'none',
    };

    useEffect(() => {
        if (isSuccess) {
            setTodos(todosData.results);
            if (page === 1) setTotal(todosData.count);
        }
    }, [todosData, isSuccess])

    useEffect(() => {
        if (!draggable) {
            setPriority("");
        }
        else {
            setPriority("0");
        }
    }, [draggable])

    const handleCheck = (todo, value) => {
        updateTodo({todoId: todo.id,...todo, is_done: value})
            .unwrap()
            .then(() => {
                refetch();
            })
            .catch(() => {
                toastify("error", "Failed to update");
            })
    }

    const handleDelete = async (todoId) => {
        deleteTodo(todoId)
            .unwrap()
            .then(() => {
                refetch();
            })
            .catch(() => {
                toastify("error", "Delete failed")
            })
    }

    return (
        <main id="todo">
            <header className="header">
                <Header text={"ToDo"} />
                <Profile />
            </header>
            <section>
                <div className="container">
                    <div className="todos">
                        <div className="inputs">
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
                                Add todo
                            </Button>
                        </div>
                        <Spin spinning={isLoading}>
                            {
                                !todos.length && <Empty description={"No todos"} />
                            }
                            {
                                todos.map(todo =>
                                    <div key={todo.id} className="todo-item" style={{borderColor: gradientColors[todo.priority]}}>
                                        <div className="content">
                                            <Checkbox onChange={(e) => {
                                                // console.log(e.target.checked);
                                                handleCheck(todo, e.target.checked);
                                            }} className="check" checked={todo.is_done} />
                                            <div>
                                                <p className="name">{todo.name}</p>
                                                <p className="desc">{todo.description}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <EditOutlined key="edit" className="edit"
                                                          onClick={() => {
                                                              setSelectedTodo(todo);
                                                              setShowUpdateModal(true);
                                                          }}
                                            />
                                            <DeleteOutlined key="delete" className="delete"
                                                            onClick={() => handleDelete(todo.id)}
                                            />
                                        </div>
                                    </div>
                                )}
                        </Spin>
                        <Pagination
                            style={{marginLeft: "auto"}}
                            current={page}
                            onChange={(page) => {
                                setPage(page);
                                window.scrollTo(0, 0);
                            }}
                            total={total} />
                    </div>
                    <aside className="filters">
                        <h3>Sort by:</h3>
                        <Radio.Group name="order"
                                     value={order}
                                     onChange={(e) => setOrder(e.target.value)}
                        >
                            <Radio className="radio" value={""}>Default</Radio>
                            <Radio className="radio" value={"is_done"}>Is done</Radio>
                            <Radio className="radio" value={"priority"}>Priority</Radio>
                            <Radio className="radio" value={"created_at"}>Creation</Radio>
                            <Radio className="radio" value={"updated_at"}>Update</Radio>
                        </Radio.Group>
                        <Divider/>
                        <h3>Is done:</h3>
                        <Radio.Group name="is_done"
                                     value={isDone}
                                     onChange={(e) => setIsDone(e.target.value)}
                        >
                            <Radio className="radio" value={""}>All</Radio>
                            <Radio className="radio" value={"true"}>Done</Radio>
                            <Radio className="radio" value={"false"}>Not done</Radio>
                        </Radio.Group>
                        <Divider/>
                        <h3>Priority:</h3>
                        <Radio.Group name="priority"
                                     value={draggable}
                                     onChange={(e) => setDraggable(e.target.value)}
                        >
                            <Radio className="radio" value={false}>All</Radio>
                            <Radio className="radio" value={true}>Priority</Radio>
                        </Radio.Group>
                        {
                            draggable &&
                            <Slider
                                style={{width: "98%"}}
                                min={0}
                                max={gradientColors.length - 1}
                                handleStyle={handleStyle}
                                trackStyle={trackStyle}
                                railStyle={sectionStyle}
                                activeDotStyle={handleStyle}
                                onChange={(value) => setPriority(String(value))}
                                value={Number(priority)}
                            />
                        }
                    </aside>
                </div>
            </section>
            <AddTodoModal
                show={showAddModal}
                setShow={setShowAddModal}
                refetch={refetch}
            />
            <UpdateTodoModal
                show={showUpdateModal}
                setShow={setShowUpdateModal}
                refetch={refetch}
                todo={selectedTodo}
            />
        </main>
    );
};

export default TodoPage;