from django.core.exceptions import ValidationError
from django.db.models import Prefetch, Count

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import Community, School, Membership, Student
from ...serializers import *


class CommunityMembersListCreateAPI(generics.ListCreateAPIView):
    ordering_fields = ['created_at', 'updated_at']
    search_fields = [
        'student__user__email',
        'student__user__first_name',
        'student__user__last_name',
    ]
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return MembershipCreateSerializer
        return CommunityMemberSerializer
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_community()
        
    def check_community(self):
        qs = Community.objects.all().select_related('school')
        self.community = get_object_or_404(qs, pk=self.kwargs['community_id'])
        self.check_object_permissions(self.request, self.community)
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == "POST":
            self.permission_classes = [OnlyOwnSchool, IsStudent]
        return super().get_permissions()
    
    def get_student(self):
        obj = Student.objects.filter(user=self.request.user).first()
        if not obj:
            raise ValidationError('You does not have student card on order to join community')
        return obj
    
    def perform_create(self, serializer):
        student = self.get_student()
        return serializer.save(
            community=self.community,
            student=student
        )

    def get_queryset(self):
        qs = Membership.objects.filter(community=self.community)
        qs = qs.select_related(
            'student', 
            'student__group', 
            'student__group__grade', 
            'student__user', 
            'student__group__teacher'
            )
        return qs


class StudentMembershipsListAPI(generics.ListAPIView):
    serializer_class = StudentCommunitySerializer
    permission_classes = [OnlyOwnSchool]
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['community__name']
    ordering = ['-created_at']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_student()
        
    def check_student(self):
        qs = Student.objects.all().select_related('user__school')
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        self.check_object_permissions(self.request, self.student.user)

    def get_queryset(self):
        qs = Membership.objects.filter(student=self.student)
        qs = qs.select_related(
            'community', 
            'student__group', 
            'student__user', 
            'student__group__teacher'
            )
        return qs


class MembershipDetailAPI(
    generics.RetrieveAPIView,
    generics.DestroyAPIView
):
    serializer_class = MembershipNestedSerializer
    queryset = Membership.objects.select_related(
        'community',
        'student', 
        'student__group', 
        'student__user', 
        'student__group__teacher'
    )
    
    def get_object(self):
        qs = Membership.objects.all()
        obj = get_object_or_404(qs, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, obj.student)
        return obj
    
    def get_permissions(self):
        self.permission_classes = [OnlyOwnSchool]
        if self.request.method == 'DELETE':
            self.permission_classes = [OnlyOwnSchool, IsUserItself]
        return super().get_permissions()


__all__ = [
    'CommunityMembersListCreateAPI',
    'StudentMembershipsListAPI',
    'MembershipDetailAPI'
]