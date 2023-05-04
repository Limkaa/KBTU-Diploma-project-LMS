import React from 'react';
import { Tabs } from 'antd';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import TimeTable from "./TimeTable";
// import "./TimeTablePage.css"
import TimeSchedule from "./TimeSchedule";

const TimeTablePage = () => {
    return (
        <main id="timetable">
            <header className="header">
                <Header text={"Time table"} />
                <Profile />
            </header>
            <Tabs>
                <Tabs.TabPane tab="Table" key="1">
                    <TimeTable/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Schedule" key="2">
                    {/*time schedule*/}
                    <TimeSchedule type="course"/>
                </Tabs.TabPane>
            </Tabs>
        </main>
    );
};

export default TimeTablePage;