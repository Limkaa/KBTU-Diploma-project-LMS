import React from 'react';
import { Tabs } from 'antd';
import Header from "../../components/shared/Header/Header";
import Profile from "../../components/Dashboard/Profile";
import TimeTable from "./TimeTable";
import TimeSchedule from "./TimeSchedule";

const TimeTablePage = () => {
    return (
        <main id="timetable">
            <header className="header">
                <Header text={"Time table"} />
                <Profile />
            </header>
            <Tabs>
                {/*/!*<Tabs.TabPane tab="Table" key="1" />*!/*/}

                <Tabs.TabPane tab="Schedule" key="2">
                    <TimeTable/>
                </Tabs.TabPane>

                {/*/!*<Tabs.TabPane tab="Tab 3" key="3" children={<MyComponent />} />*!/*/}
            </Tabs>
        </main>
    );
};

export default TimeTablePage;