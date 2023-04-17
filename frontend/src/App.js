import Login from "./components/Login/Login";
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
import SchoolGradesContainer from "./components/SchoolGrades/SchoolGrades.container";
import { toast } from "react-toastify";
import SubjectsContainer from "./components/Subjects/Subjects.container";
import AcademicYears from "./components/Terms/Terms.container";
import TermsContainer from "./components/Terms/Terms.container";
import AcademicYearsContainer from "./components/AcademicYears/AcademicYears.container";
import NotFound from "./components/NotFound/NotFound";
import "./App.css";
import CoursesSchoolContainer from "./components/Courses/CoursesSchool.container";
import Course from "./components/Courses/Course";
import SyllabusContainer from "./components/Syllabus/Syllabus.container";
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
          <Route exact path="/" element={<DashboardContainer />} />
          <Route exact path="/courses" element={<CoursesContainer />} />
          <Route exact path="/courses" element={<CoursesContainer />} />
          <Route exact path="/courses/:id" element={<Course />} />
          <Route exact path="/assignments" element={<AssignmentsContainer />} />
          <Route exact path="/schedule" element={<ScheduleContainer />} />
          <Route exact path="/materials" element={<MaterialsContainer />} />
          <Route exact path="/timeline" element={<TimelineContainer />} />
          <Route exact path="/classroom" element={<ClassroomContainer />} />
          <Route exact path="/grades" element={<GradesContainer />} />
          <Route exact path="/profile" element={<ProfileContainer />} />
          <Route
            exact
            path="/courses/:id/syllabus"
            element={<SyllabusContainer />}
          />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
          <Route
            exact
            path="/courses/:id/syllabus"
            element={<SyllabusContainer />}
          />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["manager"]} />}>
          <Route exact path="/users" element={<UsersContainer />} />
          <Route
            exact
            path="/school/grades"
            element={<SchoolGradesContainer />}
          />
          <Route
            exact
            path="/school/subjects"
            element={<SubjectsContainer />}
          />
          <Route exact path="/terms/term" element={<TermsContainer />} />
          <Route
            exact
            path="/terms/years"
            element={<AcademicYearsContainer />}
          />
          <Route
            exact
            path="/schools/courses"
            element={<CoursesSchoolContainer />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
