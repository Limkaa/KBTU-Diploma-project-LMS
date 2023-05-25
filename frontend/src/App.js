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
import MarksContainer from "./components/Marks/Marks.container";
import ProfileContainer from "./components/Profile/Profile.container";
import UsersContainer from "./components/Users/Users.container";
import SchoolGradesContainer from "./components/SchoolGrades/SchoolGrades.container";
import { toast } from "react-toastify";
import SubjectsContainer from "./components/Subjects/Subjects.container";
import TermsContainer from "./components/Terms/Terms.container";
import AcademicYearsContainer from "./components/AcademicYears/AcademicYears.container";
import SchoolPage from "./pages/SchoolsPage/SchoolPage";
import GroupsPage from "./pages/GroupsPage/GroupsPage";
import TeacherGroupsPage from "./pages/GroupsPage/TeacherGroupsPage";
import GroupStudentsPage from "./pages/StudentsPage/GroupStudentsPage";
import NotFound from "./components/NotFound/NotFound";
import "./App.css";
import CoursesSchoolContainer from "./components/Courses/CoursesSchool.container";
import SyllabusContainer from "./components/Syllabus/Syllabus.container";
import AssignmentsCourse from "./components/Assignments/AssignmentsCourse";
import Assignment from "./components/Assignments/Assignment";
import AssignmentContainer from "./components/Assignments/AssignmentContainer";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import AwardsContainer from "./components/Awards/Awards.container";
import Award from "./components/Awards/Award";
import RoomPage from "./pages/RoomPage/RoomPage";
import TimeBoundsPage from "./pages/TimeBoundsPage/TimeBoundsPage";
import TimeTablePage from "./pages/TimeTablePage/TimeTablePage";
import TimeCalendar from "./pages/TimeTablePage/TimeCalendar";
import Course from "./components/Courses/Course";
import CourseContainer from "./components/Courses/CourseContainer";
import CourseAward from "./components/Courses/CourseAward";
import CommunitiesPage from "./pages/CommunitiesPage/CommunitiesPage";
import CommunityPage from "./pages/CommunitiesPage/CommunityPage";
import TodoPage from "./pages/TodoPage/TodoPage";
import MarksByCourses from "./components/Marks/MarksByCourses";
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
          <Route exact path="/courses/:id" element={<CourseContainer />} />
          <Route exact path="/assignments" element={<AssignmentsContainer />} />
          <Route exact path="/schedule" element={<ScheduleContainer />} />
          <Route exact path="/materials" element={<MaterialsContainer />} />
          <Route exact path="/classroom" element={<ClassroomContainer />} />
          <Route exact path="/marks" element={<MarksContainer />} />
          <Route exact path="/profile" element={<ProfileContainer />} />
          <Route exact path="/school" element={<SchoolPage />} />
          <Route
            exact
            path="/courses/:id/syllabus"
            element={<SyllabusContainer />}
          />
          <Route exact path="/todo" element={<TodoPage />} />
          <Route exact path="/communities" element={<CommunitiesPage />} />
          <Route
            exact
            path="/communities/:commId"
            element={<CommunityPage />}
          />
          <Route exact path="/awards" element={<AwardsContainer />} />
          <Route exact path="/awards/:id/winners" element={<Award />} />
          <Route exact path="/courses/:id/winners" element={<CourseAward />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["teacher", "manager"]} />}>
          <Route exact path="/studentmarks" element={<MarksByCourses />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["teacher", "student"]} />}>
          <Route
            exact
            path="/courses/:id/assignments"
            element={<AssignmentsCourse />}
          />
          <Route
            exact
            path="assignments/:id"
            element={<AssignmentContainer />}
          />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
          <Route exact path="/my-groups" element={<TeacherGroupsPage />} />
          <Route
            exact
            path="/my-groups/:groupId/students"
            element={<GroupStudentsPage />}
          />
          <Route
            exact
            path="/timetable"
            element={<TimeCalendar type="teacher" />}
          />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["student"]} />}>
          <Route exact path="/my-groups" element={<TeacherGroupsPage />} />
          <Route
            exact
            path="/timeline"
            element={<TimeCalendar type="student" />}
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
          <Route exact path="/groups" element={<GroupsPage />} />
          <Route
            exact
            path="/groups/:groupId/students"
            element={<GroupStudentsPage />}
          />
          <Route exact path="/students" element={<StudentsPage />} />
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
          <Route
            exact
            path="/schools/courses/:id/timetable"
            element={<TimeCalendar type="course" />}
          />
          <Route exact path="/timeline/rooms" element={<RoomPage />} />
          <Route
            exact
            path="/timeline/rooms/:id/timetable"
            element={<TimeCalendar type="room" />}
          />
          <Route
            exact
            path="/timeline/time-bounds"
            element={<TimeBoundsPage />}
          />
          <Route exact path="/timeline/timetable" element={<TimeTablePage />} />
          <Route
            exact
            path="/groups/:id/timetable"
            element={<TimeCalendar type="group" />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route exact path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
