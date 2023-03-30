import React from "react";
import Header from "../shared/Header";
import Assignments from "./Assignments";
import Calendar from "./Calendar";
import "./Dashboard.css";
import Leaderboard from "./Leaderboard";
import Profile from "./Profile";
import Schedule from "./Schedule";
import SchoolCommunities from "./SchoolCommunities";
import TodoList from "./TodoList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../redux/auth/authSlice";

const DashboardContainer = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <div className="dashboard container">
      <div className="left-container">
        <Header text={`Hello, ${user.first_name}!`} visible={true} />
        <div className="announcements">
          <p className="ann-title">Announcements</p>
          <div className="ann-item">
            <img className="ann-img"/>
            <div style={{ flex: 1, marginLeft: 16 }}>
              <p className="ann-text">Amina Farabi</p>
              <p className="ann-text" style={{ color: "#5C5C5C" }}>
                Today there will be a meeting in the hall
              </p>
            </div>
            <p className="ann-text" style={{ color: "#5C5C5C" }}>
              12:40 PM
            </p>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 20, gap: 16 }}>
          <Leaderboard />
          <SchoolCommunities />
        </div>
        <div style={{ display: "flex", marginTop: 20 }}>
          <Assignments />
        </div>
      </div>
      <div className="right-container">
        <Profile />
        <Calendar />
        <Schedule />
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardContainer;
