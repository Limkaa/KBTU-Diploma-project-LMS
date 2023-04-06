from rest_framework import permissions

from .users.models import User
from .schools.models import School
from .groups.models import Group
from .students.models import Student
from .courses.models import Course


class OnlyOwnSchool(permissions.BasePermission):
    message = 'You cannot interact with other schools and all related to them objects'
    
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Student):
            obj = obj.user.school
        elif not isinstance(obj, School):
            obj = obj.school
        return obj == request.user.school


class IsUserWithRole(permissions.BasePermission):
    role = None
    
    def has_permission(self, request, view):
        self.message = f'Only {self.role} can perform this action'
        return request.user.role == self.role

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsManager(IsUserWithRole):
    role = User.Role.MANAGER


class IsTeacher(IsUserWithRole):
    role = User.Role.TEACHER


class IsStudent(IsUserWithRole):
    role = User.Role.STUDENT


class IsGroupTeacher(IsTeacher):
    message = 'You are not a teacher of related group'
    
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Group):
            obj = obj.group
        return obj.teacher == request.user


class IsGroupStudent(IsStudent):
    message = 'You are not a student of related group'
    
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Group):
            obj = obj.group
        return Student.objects.filter(group=obj, user=request.user).exists()


class IsCourseTeacher(IsTeacher):
    message = 'Only teacher of related course can perform this action'
    
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Course):
            obj = obj.course
        return obj.teacher == request.user


class IsCourseStudent(IsStudent):
    message = 'Only student of related course can perform this action'
     
    def has_object_permission(self, request, view, obj):
        if not isinstance(obj, Course):
            obj = obj.course
        return IsGroupStudent().has_object_permission(request, view, obj.group)


class IsUserItself(permissions.BasePermission):
    message = 'Only assigned user to this object(s) can perform this action'
    
    def has_object_permission(self, request, view, obj):
        return obj == request.user
    

default_operand_message = 'You cannot perform this action'
class CustomOperandHolder(permissions.OperandHolder):
    
    def __init__(self, operand, permissions: list, message: str = default_operand_message):
        self.message = message
        self.operand = operand
        self.permissions = permissions
    
    def __call__(self, *args, **kwargs):
        permissions = [permission(*args, **kwargs) for permission in self.permissions]
        return self.operand(permissions, self.message)


class CustomOR(permissions.OR):
    def __init__(self, 
            permissions: list[permissions.BasePermission],
            message: str = default_operand_message
        ):
        self.message = message
        self.permissions = permissions

    def has_permission(self, request, view):
        return any([permission.has_permission(request, view) for permission in self.permissions])

    def has_object_permission(self, request, view, obj):
        return any([permission.has_object_permission(request, view, obj) for permission in self.permissions])


class CustomAND(permissions.AND):
    def __init__(self, 
        permissions: list[permissions.BasePermission], 
        message = default_operand_message
        ):
        self.message = message
        self.permissions = permissions

    def has_permission(self, request, view):
        return all([permission.has_permission(request, view) for permission in self.permissions])

    def has_object_permission(self, request, view, obj):
        return all([permission.has_object_permission(request, view, obj) for permission in self.permissions])


__all__ = [
    'OnlyOwnSchool', 
    'IsManager',
    'IsTeacher',
    'IsGroupTeacher',
    'IsGroupStudent',
    'IsCourseStudent',
    'IsCourseTeacher',
    'IsUserItself',
    'CustomOperandHolder',
    'CustomOR',
    'CustomAND'
]