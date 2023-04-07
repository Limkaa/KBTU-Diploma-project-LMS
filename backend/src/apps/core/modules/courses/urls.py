from django.urls import path, include

from . import views

urlpatterns = [
    path("courses/<int:pk>", views.CourseRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/courses", views.SchoolCoursesListCreateAPI.as_view()),
    path("teachers/<int:teacher_id>/courses", views.TeacherCoursesListAPI.as_view()),
    path("subjects/<int:subject_id>/courses", views.SubjectCoursesListAPI.as_view()),
    path("groups/<int:group_id>/courses", views.GroupCoursesListAPI.as_view()),
    path("years/<int:year_id>/courses", views.YearCoursesListAPI.as_view()),
    path("courses/<int:course_id>/students", views.CourseGroupStudentsListAPI.as_view()),
]