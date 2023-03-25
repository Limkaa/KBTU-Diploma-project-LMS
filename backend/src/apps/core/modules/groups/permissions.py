from rest_framework import permissions


class IsGroupTeacher(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        self.message = "You are not a teacher of this group"
        return obj.teacher == request.user    