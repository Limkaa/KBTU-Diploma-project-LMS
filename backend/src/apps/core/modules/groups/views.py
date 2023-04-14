from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Group, User, School, Grade
from .serializers import GroupModelSerializer, GroupModelReadOnlySerializer


class GroupCreateAPI(generics.CreateAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
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
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool,
                CustomOperandHolder(
                    operand = CustomOR,
                    message = "This view can be accessed only by manager or group teacher",
                    permissions = [IsManager, IsGroupTeacher]
                ) 
            ]

        return super().get_permissions()
    
    def perform_update(self, serializer):
        school = serializer.validated_data.get('school')
        self.check_object_permissions(self.request, school)
        return super().perform_update(serializer)


class SchoolGroupsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = GroupModelReadOnlySerializer
    filterset_fields = ['is_active']
    ordering = ['created_at', 'updated_at', 'code']
    search_fields = ['code']
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Group.objects.filter(school = school).select_related('grade', 'teacher')
    
    
class TeacherGroupsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand = CustomOR,
            message = 'This view can be accessed only by manager or teacher itself',
            permissions = [
                IsManager,
                CustomOperandHolder(
                    operand = CustomAND,
                    permissions = [
                        IsTeacher,
                        IsUserItself
                    ]
                ),
            ]
        ),
    ]
    serializer_class = GroupModelReadOnlySerializer
    queryset =  Group.objects.all()
    filterset_fields = ['is_active', 'grade']
    ordering = ['created_at', 'updated_at', 'code']
    search_fields = ['code']
    
    def get_queryset(self):
        teacher = get_object_or_404(
            User, pk=self.kwargs['teacher_id'], role=User.Role.TEACHER)
        self.check_object_permissions(self.request, teacher)
        return self.queryset.filter(teacher=teacher).select_related('grade', 'teacher')


class GradeGroupsListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = GroupModelReadOnlySerializer
    queryset =  Group.objects.all()
    filterset_fields = ['is_active', 'teacher']
    ordering = ['created_at', 'updated_at', 'code']
    search_fields = ['code']
    
    def get_queryset(self):
        grade = get_object_or_404(Grade, pk=self.kwargs['grade_id'])
        self.check_object_permissions(self.request, grade)
        return self.queryset.filter(grade=grade).select_related('grade', 'teacher')