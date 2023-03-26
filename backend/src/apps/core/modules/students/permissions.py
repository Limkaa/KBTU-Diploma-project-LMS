from rest_framework import permissions


class OnlyOwnSchoolGroup(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        self.message = "You can't perform that action, because this object belongs to another school"
        return obj.group.school_id == request.user.school_id


class IsGroupTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        self.message = "Only group teacher can perform this action"
        return obj.group.teacher == request.user


class IsStudentItself(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        self.message = "You can't perform that action, because you are not an owner of this student card"
        return obj.user == request.user