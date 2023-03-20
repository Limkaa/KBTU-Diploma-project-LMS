from rest_framework import permissions

from .users.models import User
from .schools.models import School

class OnlyOwnSchool(permissions.BasePermission):
    message = "You can't interact with other school"

    def has_permission(self, request, view):
        return request.user.school_id == view.kwargs.get("school_id")
    
    
class OnlyOwnSchoolObject(permissions.BasePermission):
    message = "You can't interact with other school object"
    
    def has_object_permission(self, request, view, obj):
        user_school_id = request.user.school_id
        if isinstance(obj, School):
            return obj.pk == user_school_id
        return obj.school_id == user_school_id


class IsManagerOrReadOnly(permissions.BasePermission):
    message = "Only manager can access this view"
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == User.Role.MANAGER


class IsManager(permissions.BasePermission):
    message = "Only manager can access this view"

    def has_permission(self, request, view):
        return request.user.role == User.Role.MANAGER
