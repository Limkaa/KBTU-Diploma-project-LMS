import React from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import DashboardContainer from "./components/Dashboard/Dashboard.container";
import CoursesContainer from "./components/Courses/Courses.container";
import AssignmentsContainer from "./components/Assignments/Assignments.container";
import ScheduleContainer from "./components/Schedule/Schedule.container";
import MaterialsContainer from "./components/Materials/Materials.container";
import ClassroomContainer from "./components/Classroom/Classroom.container";
import TimelineContainer from "./components/Timeline/Timeline.container";
import GradesContainer from "./components/Grades/Grades.container";
import ProfileContainer from "./components/Profile/Profile.container";
import UsersContainer from "./components/Users/Users.container";
import SchoolPage from "./pages/SchoolsPage/SchoolPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import { toast } from "react-toastify";
import TeacherGroupsPage from "./pages/GroupsPage/TeacherGroupsPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";

function App() {
  React.useEffect(() => {
    toast.configure({ autoClose: 3000 });
  });
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <PrivateRoute allowedRoles={["manager", "student", "teacher"]} />
          }
        >
          <Route exact path="/home" element={<DashboardContainer />} />
          <Route exact path="/courses" element={<CoursesContainer />} />
          <Route exact path="/assignments" element={<AssignmentsContainer />} />
          <Route exact path="/schedule" element={<ScheduleContainer />} />
          <Route exact path="/materials" element={<MaterialsContainer />} />
          <Route exact path="/timeline" element={<TimelineContainer />} />
          <Route exact path="/classroom" element={<ClassroomContainer />} />
          <Route exact path="/grades" element={<GradesContainer />} />
          <Route exact path="/profile" element={<ProfileContainer />} />
          <Route exact path="/school" element={<SchoolPage />} />
          {/*<Route exact path="/groups" element={<TeacherGroupsPage />} />*!/*/}
          {/*<Route exact path="/groups/:groupId/students" element={<StudentsPage />} />*/}
        </Route>
        <Route element={<PrivateRoute allowedRoles={["manager"]} />}>
          <Route exact path="/users" element={<UsersContainer />} />
          <Route exact path="/groups" element={<GroupsPage />} />
          <Route exact path="/groups/:groupId/students" element={<StudentsPage />} />
        </Route>
        {/*<Route element={<PrivateRoute allowedRoles={["teacher"]} />}>*/}
        {/*  <Route exact path="/groups" element={<TeacherGroupsPage />} />*/}
        {/*  <Route exact path="/groups/:groupId/students" element={<StudentsPage />} />*/}
        {/*</Route>*/}
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
