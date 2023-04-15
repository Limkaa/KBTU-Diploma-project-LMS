from ...permissions import IsCourseTeacher, IsCourseStudent, OnlyOwnSchool


class IsCommentOfOwnSchool(OnlyOwnSchool):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.post.course)


class IsCommentOfCourseTeacher(IsCourseTeacher):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.post)


class IsCommentOfCourseStudent(IsCourseStudent):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.post)


__all__ = [
    'IsCommentOfOwnSchool',
    'IsCommentOfCourseTeacher',
    'IsCommentOfCourseStudent'
]