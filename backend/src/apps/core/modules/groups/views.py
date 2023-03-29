from rest_framework.generics import get_object_or_404
from rest_framework import generics

from .models import Group
from ..users.models import User
from ..schools.models import School
from ..grades.models import Grade

from .serializers import GroupModelSerializer, GroupModelReadOnlySerializer

from .. import permissions


class GroupCreateAPI(generics.CreateAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = GroupModelSerializer
    queryset = Group.objects.all()
    
    def perform_create(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_create(serializer)
    

class GroupRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    queryset = Group.objects.all().select_related('grade', 'teacher')
    
    def get_serializer_class(self):
        if self.request.method == "PUT":
            return GroupModelSerializer
        return GroupModelReadOnlySerializer
    
    def get_permissions(self):
        method = self.request.method
        
        if method == "PUT":
            self.permission_classes = [
                permissions.OnlyOwnSchoolObject,
                permissions.IsManager
            ]
        elif method == "GET":
            self.permission_classes = [
                permissions.OnlyOwnSchoolObject,
                permissions.IsManager | permissions.IsGroupTeacher
            ]

        return super().get_permissions()
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolGroupsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = GroupModelReadOnlySerializer
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Group.objects.filter(school = school).select_related('grade', 'teacher')
    
    
class TeacherGroupsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager | (permissions.IsTeacher & permissions.IsUserItself)
    ]
    serializer_class = GroupModelReadOnlySerializer
    queryset =  Group.objects.all()
    
    def get_queryset(self):
        teacher = get_object_or_404(
            User, pk=self.kwargs['teacher_id'], role=User.Role.TEACHER)
        self.check_object_permissions(self.request, teacher)
        return self.queryset.filter(teacher=teacher).select_related('grade', 'teacher')


class GradeGroupsListAPI(generics.ListAPIView):
    permission_classes = [
        permissions.OnlyOwnSchoolObject,
        permissions.IsManager
    ]
    serializer_class = GroupModelReadOnlySerializer
    queryset =  Group.objects.all()
    
    def get_queryset(self):
        grade = get_object_or_404(Grade, pk=self.kwargs['grade_id'])
        self.check_object_permissions(self.request, grade)
        return self.queryset.filter(grade=grade).select_related('grade', 'teacher')