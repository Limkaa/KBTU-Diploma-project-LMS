from rest_framework import permissions

from .models import User
from ..schools.models import School


class UserRoleBasedPermission(permissions.BasePermission):
    role = None
    
    def has_permission(self, request, view):
        self.message =  f"Only user with '{self.role}' role can access this view"
        return request.user.role == self.role

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
    

class IsManager(UserRoleBasedPermission):
    role = User.Role.MANAGER


class IsTeacher(UserRoleBasedPermission):
    role = User.Role.TEACHER


class IsUserItself(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user
    

class IsManagerOrReadOnly(IsManager):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS: 
            return True 
        return super().has_permission(request, view)


class OnlyOwnSchool(permissions.BasePermission):
    def has_permission(self, request, view):
        self.message = "You can't interact with other school"
        return request.user.school_id == view.kwargs.get("school_id")
    
    
class OnlyOwnSchoolObject(permissions.BasePermission):
    message = "You can't interact with other school object"
    
    def has_object_permission(self, request, view, obj):
        user_school_id = request.user.school_id
        if isinstance(obj, School):
            return obj.pk == user_school_id
        return obj.school_id == user_school_id
