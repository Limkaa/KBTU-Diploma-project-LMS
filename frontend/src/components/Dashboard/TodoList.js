import React, {useEffect, useState} from "react";
import {useGetAllTodosQuery, useUpdateTodoMutation} from "../../redux/todo/todoApiSlice";
import {Alert, Checkbox} from "antd";
import {Link} from "react-router-dom";

const TodoList = () => {
  const {data: todoData, isSuccess, refetch} = useGetAllTodosQuery({page: 1, isDone: "", priority: "", order: "-priority", search: ""});
  const [todo, setTodo] = useState([]);
  const gradientColors = ['#00899E','#2EB873', '#F2B824', '#EA5A0C'];
  const [updateTodo] = useUpdateTodoMutation();

  useEffect(() => {
    refetch();
  }, [])

  const handleCheck = (todo, value) => {
    updateTodo({todoId: todo.id,...todo, is_done: value})
        .unwrap()
        .then(() => {
          refetch();
        })
  }

  useEffect(() => {
    if (isSuccess) {
      setTodo(todoData.results.slice(0,4));
    }
  }, [todoData, isSuccess])

  return (
    <div style={{ marginTop: 20 }}>
      <div style={styles.header}>
        <p style={styles.title}>To Do List</p>
        <Link to="/todo" style={styles.seeAll}>See all</Link>
      </div>
      <div>
        {
          todo?.map((todo) => (
              <div key={todo.id} className="todo-item" style={{borderColor: gradientColors[todo.priority]}}>
                <div className="content">
                  <Checkbox onChange={(e) => {
                    handleCheck(todo, e.target.checked);
                  }} className="check" checked={todo.is_done} />
                  <div>
                    <p className="name">{todo.name}</p>
                    {/*<p className="desc">{todo.description}</p>*/}
                  </div>
                </div>
              </div>
          ))
        }
        {
            !todo.length &&
            <Alert message={"You have no undone todos."}/>
        }
      </div>
    </div>
  );
};

const styles = {
  title: {
    color: "#4A4D58",
    fontWeight: 700,
    fontSize: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seeAll: {
    color: "#163A61",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
  },
};
export default TodoList;
