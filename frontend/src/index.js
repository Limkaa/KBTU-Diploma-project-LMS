import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardContainer from "./components/Dashboard/Dashboard.container";
import { Outlet } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import CoursesContainer from "./components/Courses/Courses.container";
import AssignmentsContainer from "./components/Assignments/Assignments.container";
import ScheduleContainer from "./components/Schedule/Schedule.container";
import MaterialsContainer from "./components/Materials/Materials.container";
import ClassroomContainer from "./components/Classroom/Classroom.container";
import TimelineContainer from "./components/Timeline/Timeline.container";
import GradesContainer from "./components/Grades/Grades.container";
import ProfileContainer from "./components/Profile/Profile.container";
import UsersContainer from "./components/Users/Users.container";
import {AuthProvider} from "./context/AuthProvider";
import {BrowserRouter} from "react-router-dom";


const AppLayout = () => (
  <div className="body-container">
    <NavBar />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashboardContainer />,
      },
      {
        path: "/courses",
        element: <CoursesContainer />,
      },
      {
        path: "/assignments",
        element: <AssignmentsContainer />,
      },
      {
        path: "/schedule",
        element: <ScheduleContainer />,
      },
      {
        path: "/materials",
        element: <MaterialsContainer />,
      },
      {
        path: "/timeline",
        element: <TimelineContainer />,
      },
      {
        path: "/classroom",
        element: <ClassroomContainer />,
      },
      {
        path: "/grades",
        element: <GradesContainer />,
      },
      {
        path: "/profile",
        element: <ProfileContainer />,
      },
      {
        path: "/users",
        element: <UsersContainer />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
      {/* <BrowserRouter>
          <AuthProvider>
              <App />
          </AuthProvider>
      </BrowserRouter> */}
  </React.StrictMode>
);

