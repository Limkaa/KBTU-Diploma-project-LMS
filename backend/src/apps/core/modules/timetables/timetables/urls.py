from django.urls import path

from . import views

urlpatterns = [
    path("timetables-slots/<int:pk>", views.TimetableSlotRetrieveUpdateAPI.as_view()),
    path("schools/<int:school_id>/timetable", views.SchoolTimetableListAPI.as_view()),
    path("courses/<int:course_id>/timetable", views.CourseTimetableListAPI.as_view()),
    path("rooms/<int:room_id>/timetable", views.RoomTimetableListAPI.as_view()),
    path("groups/<int:group_id>/timetable", views.GroupTimetableListAPI.as_view()),
    path("teachers/<int:teacher_id>/timetable", views.TeacherTimetableListAPI.as_view()),
    path("timebounds/<int:timebound_id>/timetable", views.TimeboundTimetableListAPI.as_view()),
]