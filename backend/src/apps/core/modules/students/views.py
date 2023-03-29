from rest_framework.generics import get_object_or_404
from rest_framework import generics

from .models import Student
from ..schools.models import School
from ..groups.models import Group

from .serializers import (
    StudentModelSerializer,
    StudentModelNestedSerializer,
    StudentModelSerializerPut
)

from .. import permissions
from .permissions import IsGroupTeacher, IsStudentItself


class StudentCardRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Student.objects.all().select_related('group', 'user')
    lookup_field = 'user_id'
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return StudentModelSerializerPut
        return StudentModelNestedSerializer
    
    def get_permissions(self):
        method = self.request.method
        
        if method == "PUT":
            self.permission_classes = [
                permissions.OnlyOwnSchoolGroup,
                permissions.IsManager
            ]
        elif method == "GET":
            self.permission_classes = [
                permissions.OnlyOwnSchoolGroup,
                permissions.IsManager | IsGroupTeacher | IsStudentItself
            ]

        return super().get_permissions()


class SchoolStudentsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = StudentModelNestedSerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Student.objects.filter(group__school = school).select_related('group', 'user')



class GroupStudentsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager | permissions.IsGroupTeacher
    ]
    serializer_class = StudentModelNestedSerializer
    
    def get_queryset(self):
        group = get_object_or_404(Group, pk = self.kwargs['group_id'])
        self.check_object_permissions(self.request, group)
        return Student.objects.filter(group = group).select_related('group', 'user')
  