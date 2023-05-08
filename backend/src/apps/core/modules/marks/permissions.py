from ..permissions import *


class IsMarkOfOwnSchool(OnlyOwnSchool):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.assignment.course)


class IsTeacherOfAssignmentCourse(IsCourseTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.assignment.course)


class IsTeacherOfEnrollmentCourse(IsCourseTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.course)


class IsTeacherOfEnrollmentStudentGroup(IsGroupTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.student)


class IsRelatedStudent(IsUserItself):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.student)