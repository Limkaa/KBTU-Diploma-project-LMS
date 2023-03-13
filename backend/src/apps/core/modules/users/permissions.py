from rest_framework import permissions

from .models import User


class OnlyOwnSchool(permissions.BasePermission):
    message = "You can't interact with other school objects"

    def has_permission(self, request, view):
        return request.user.school_id == view.kwargs.get("school_id")


class IsManager(permissions.BasePermission):
    message = "Only school manager can perform this action"

    def has_permission(self, request, view):
        return request.user.role == User.Role.MANAGER
