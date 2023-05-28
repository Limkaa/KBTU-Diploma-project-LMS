import React from "react";
import Header from "../shared/Header/Header";
import Assignments from "./Assignments";
import Calendar from "./Calendar";
import "./Dashboard.css";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import Schedule from "./Schedule";
import SchoolCommunities from "./SchoolCommunities";
import TodoList from "./TodoList";
import { useGetAuthUserQuery } from "../../redux/api/authApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";
import Posts from "./Posts";

const DashboardContainer = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { data: user, refetch } = useGetAuthUserQuery();
  return (
    <div className="dashboard container">
      <div className="left-container">
        <Header text={`Hello, ${user?.first_name}!`}/>
        <Posts/>
        <div style={{ display: "flex", marginTop: 20, gap: 16 }}>
          <Leaderboard />
          <SchoolCommunities />
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          {currentUser.role !== "manager" &&
              <Assignments type={currentUser?.role} />
          }
        </div>
      </div>
      <div className="right-container">
        <Profile />
        <Calendar />
        {currentUser.role !== "manager" &&
            <Schedule type={currentUser?.role} />
        }
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardContainer;
