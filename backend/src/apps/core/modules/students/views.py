from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ..permissions import *

from .models import Student, Group
from ..schools.models import School

from .serializers import (
    StudentModelSerializer,
    StudentModelNestedSerializer,
    StudentModelSerializerPut
)


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
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [
                OnlyOwnSchool, 
                CustomOperandHolder(
                    operand = CustomOR,
                    message = "This view can be accessed only by manager, group teacher or student itself",
                    permissions = [IsManager, IsGroupTeacher, IsUserItself]
                )       
            ]

        return super().get_permissions()


class SchoolStudentsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool, 
        CustomOperandHolder(
            operand=CustomOR,   
            permissions=[IsManager, IsStudent],
            message="This view can be accessed only by school manager or teacher"
        )
    ]
    serializer_class = StudentModelNestedSerializer
    filterset_fields = ['user__gender', 'group__grade', 'group__teacher', 'group']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'group__code']
    
    def get_queryset(self):
        school = get_object_or_404(School, pk = self.kwargs['school_id'])
        self.check_object_permissions(self.request, school)
        return Student.objects.filter(group__school = school).select_related(
            'group',
            'group__grade',
            'group__teacher',
            'user'
        )



class GroupStudentsListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand = CustomOR,
            message = "This view can be accessed only by manager or group teacher",
            permissions = [IsManager, IsGroupTeacher]
        ) 
    ]
    serializer_class = StudentModelNestedSerializer
    filterset_fields = ['user__gender']
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    
    def get_queryset(self):
        group = get_object_or_404(Group, pk = self.kwargs['group_id'])
        self.check_object_permissions(self.request, group)
        return Student.objects.filter(group = group).select_related(
            'group',
            'group__grade',
            'group__teacher',
            'user'
        )
  