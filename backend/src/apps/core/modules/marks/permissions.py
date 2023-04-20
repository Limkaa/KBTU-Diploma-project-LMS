from ..permissions import OnlyOwnSchool, IsCourseTeacher, IsUserItself


class IsMarkOfOwnSchool(OnlyOwnSchool):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.assignment.course)


class IsTeacherOfMarkRelatedCourse(IsCourseTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.assignment.course)


class IsRelatedStudent(IsUserItself):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.student)