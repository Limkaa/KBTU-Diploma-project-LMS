import HomeSvg from "../../assets/icons/HomeIcon";
import CoursesSvg from "../../assets/icons/CoursesIcon";
import AssignmentsSvg from "../../assets/icons/AssignmentsIcon";
import ScheduleSvg from "../../assets/icons/ScheduleIcon";
import MaterialsSvg from "../../assets/icons/MaterialsIcon";
import ClassroomSvg from "../../assets/icons/ClassroomIcon";
import GradesSvg from "../../assets/icons/GradesIcon";
import UsersSvg from "../../assets/icons/UsersIcon";
import SchoolGradesSvg from "../../assets/icons/SchoolGradesIcon";
import SubjectsSvg from "../../assets/icons/SubjectsIcon";
import YearSvg from "../../assets/icons/YearIcon";
import TermsSvg from "../../assets/icons/TermsIcon";
import TermSvg from "../../assets/icons/TermIcon";
import SchoolSvg from "../../assets/icons/SchoolIcon";
import GroupSvg from "../../assets/icons/GroupIcon";
import StudentSvg from "../../assets/icons/StudentIcon";
import AwardsSvg from "../../assets/icons/AwardsIcon";
import TimelineSvg from "../../assets/icons/TimelineIcon";
import RoomSvg from "../../assets/icons/RoomIcon";
import CommunitySvg from "../../assets/icons/CommunityIcon";
import TodoSvg from "../../assets/icons/TodoIcon";

export const managerMenu = [
  {
    title: "Home",
    path: "/",
    icon: HomeSvg,
  },
  {
    title: "Users",
    path: "/users",
    icon: UsersSvg,
  },
  {
    title: "School",
    path: `/school`,
    icon: SchoolSvg,
  },
  {
    title: "Grades",
    path: `/school/grades`,
    icon: SchoolGradesSvg,
  },
  {
    title: "Groups",
    path: `/groups`,
    icon: GroupSvg,
  },
  {
    title: "Students",
    path: `/students`,
    icon: StudentSvg,
  },
  {
    title: "Subjects",
    path: `/school/subjects`,
    icon: SubjectsSvg,
  },
  {
    title: "Terms",
    path: `/terms`,
    icon: TermsSvg,
    submenu: [
      {
        title: "Terms",
        path: `/terms/term`,
        icon: TermSvg,
      },
      {
        title: "Academic Year",
        path: `/terms/years`,
        icon: YearSvg,
      },
    ],
  },
  {
    title: "Courses",
    path: `/schools/courses`,
    icon: CoursesSvg,
  },
  {
    title: "Awards",
    path: `/awards`,
    icon: AwardsSvg,
  },
  {
    title: "Timeline",
    path: `/timeline`,
    icon: TimelineSvg,
    submenu: [
      {
        title: "Timetable",
        path: `/timeline/timetable`,
        icon: TermSvg,
      },
      {
        title: "Rooms",
        path: `/timeline/rooms`,
        icon: RoomSvg,
      },
      {
        title: "Time bounds",
        path: `/timeline/time-bounds`,
        icon: YearSvg,
      },
    ],
  },
  {
    title: "Communities",
    path: `/communities`,
    icon: CommunitySvg,
  },
  {
    title: "ToDo",
    path: `/todo`,
    icon: TodoSvg,
  },
];

export const studentMenu = [
  {
    title: "Home",
    path: "/",
    icon: HomeSvg,
  },
  {
    title: "My courses",
    path: "/courses",
    icon: CoursesSvg,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: AssignmentsSvg,
  },
  {
    title: "Schedule",
    path: "/timeline",
    icon: ScheduleSvg,
  },
  {
    title: "Materials",
    path: "/materials",
    icon: MaterialsSvg,
  },
  // {
  //   title: "Timeline",
  //   path: "/timeline",
  //   icon: TimelineSvg,
  // },
  {
    title: "Classroom",
    path: "/classroom",
    icon: ClassroomSvg,
  },
  {
    title: "Grades",
    path: "/grades",
    icon: GradesSvg,
  },
  {
    title: "School",
    path: `/school`,
    icon: SubjectsSvg,
  },
  {
    title: "Awards",
    path: `/awards`,
    icon: AwardsSvg,
  },
  // {
  //   title: "Timetable",
  //   path: `/schedule`,
  //   icon: ScheduleSvg,
  // },
  {
    title: "Communities",
    path: `/communities`,
    icon: CommunitySvg,
  },
  {
    title: "ToDo",
    path: `/todo`,
    icon: TodoSvg,
  },
];

export const teacherMenu = [
  {
    title: "Home",
    path: "/",
    icon: HomeSvg,
  },
  {
    title: "My courses",
    path: "/courses",
    icon: CoursesSvg,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: AssignmentsSvg,
  },
  {
    title: "Schedule",
    path: "/timetable",
    icon: ScheduleSvg,
  },
  {
    title: "Materials",
    path: "/materials",
    icon: MaterialsSvg,
  },
  {
    title: "Timeline",
    path: "/timeline",
    icon: TimelineSvg,
  },
  {
    title: "Classroom",
    path: "/classroom",
    icon: ClassroomSvg,
  },
  {
    title: "Grades",
    path: "/grades",
    icon: GradesSvg,
  },
  {
    title: "School",
    path: `/school`,
    icon: SubjectsSvg,
  },
  {
    title: "Groups",
    path: `/my-groups`,
    icon: GroupSvg,
  },
  {
    title: "Communities",
    path: `/communities`,
    icon: CommunitySvg,
  },
  {
    title: "ToDo",
    path: `/todo`,
    icon: TodoSvg,
  },
  {
    title: "Awards",
    path: `/awards`,
    icon: AwardsSvg,
  },
  {
    title: "Timetable",
    path: `/timetable`,
    icon: ScheduleSvg,
  },
];
