from rest_framework import permissions
from ..permissions import *


class IsMarkOfOwnSchool(OnlyOwnSchool):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.course)

class TermIsOpenedToFinalMarks(permissions.BasePermission):
    message = 'Term is closed to evalutaion'
    
    def has_object_permission(self, request, view, obj):
        return obj.term.is_opened_to_final_marks


class YearIsOpenedToFinalMarks(permissions.BasePermission):
    message = 'Year is closed to evalutaion'
    
    def has_object_permission(self, request, view, obj):
        return obj.enrollment.year.is_opened_to_marks


class IsTeacherOfEnrollmentCourse(IsCourseTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.course)


class IsTeacherOfEnrollmentStudentGroup(IsGroupTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.student)


class IsRelatedStudent(IsUserItself):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.enrollment.student)