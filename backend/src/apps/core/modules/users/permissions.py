from rest_framework import permissions

from .models import User


class OnlyOwnSchool(permissions.BasePermission):
    message = "You can't interact with other school"

    def has_permission(self, request, view):
        return request.user.school_id == view.kwargs.get("school_id")
    
    
class OnlyOwnSchoolObject(permissions.BasePermission):
    message = "You can't interact with other school object"
    
    def has_object_permission(self, request, view, obj):
        return obj.school_id == request.user.school_id


class IsManager(permissions.BasePermission):
    message = "Only manager can access this view"

    def has_permission(self, request, view):
        return request.user.role == User.Role.MANAGER
