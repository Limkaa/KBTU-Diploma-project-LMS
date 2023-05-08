import datetime

from rest_framework.generics import get_object_or_404
from rest_framework import generics
from django.db.models import Prefetch, Subquery, OuterRef, F, Q, Count

from apps.core.utils.pagination import OptionalPaginationListAPIView
from ....permissions import *

from ...models import School, Student, Course, Group, Award, Winner
from ....users.models import User
from ... import serializers


class SchoolAwardsStatsListAPI(OptionalPaginationListAPIView):
    serializer_class = serializers.AwardsStatsWithRecentWinnersSerializer
    permission_classes = [OnlyOwnSchool]
    filterset_fields = ['is_active']
    ordering_fields = ['points', 'created_at', 'updated_at', 'is_active', 'issued_total']
    search_fields = ['name']
    ordering = ['-issued_total']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_school()
        
    def check_school(self):
        qs = School.objects.all()
        self.school = get_object_or_404(qs, pk=self.kwargs['school_id'])
        self.check_object_permissions(self.request, self.school)
    
    def get_queryset(self):
        last_winners_of_award = Subquery(
            Winner.objects.filter(award=OuterRef('award_id')).values_list('id', flat=True)[:5]
        )
        return Award.objects.of_school(self.school).prefetch_related(
            Prefetch(
                lookup='winners', 
                queryset=Winner.objects.all()
                ),
            Prefetch(
                lookup='winners', 
                queryset=Winner.objects.filter(id__in=last_winners_of_award).select_related(*Winner.related_fields), 
                to_attr='recent_winners'
                )
        ).annotate(issued_total = Count('winners'))


class StudentAwardsStatsListAPI(OptionalPaginationListAPIView):
    serializer_class = serializers.AwardWithStatsSerializer
    permission_classes = [OnlyOwnSchool]
    filterset_fields = ['is_active']
    ordering_fields = ['points', 'created_at', 'updated_at', 'is_active', 'issued_total']
    search_fields = ['name']
    ordering = ['-issued_total']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_student()
        
    def check_student(self):
        qs = Student.objects.all()
        self.student = get_object_or_404(qs, pk=self.kwargs['student_id'])
        self.check_object_permissions(self.request, self.student)
    
    def get_queryset(self):
        count = Count('winners', filter=Q(winners__student=self.student))
        school = self.student.user.school
        return Award.objects.of_school(school).prefetch_related('winners').annotate(issued_total = count)
    

class IssuedAwardsStatsListAPI(OptionalPaginationListAPIView):
    serializer_class = serializers.AwardWithStatsSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsTeacher],
            message='This view can be accessed only by: school manager or teacher'
        )
    ]
    filterset_fields = ['is_active']
    ordering_fields = ['points', 'created_at', 'updated_at', 'is_active', 'issued_total']
    search_fields = ['name']
    ordering = ['-issued_total']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_student()
        
    def check_student(self):
        qs = User.objects.all()
        self.issuer = get_object_or_404(qs, pk=self.kwargs['user_id'])
        self.check_object_permissions(self.request, self.issuer)
    
    def get_queryset(self):
        count = Count('winners', filter=Q(winners__issued_by=self.issuer))
        school = self.issuer.school
        return Award.objects.of_school(school).prefetch_related('winners').annotate(issued_total = count)
    

class CourseAwardsStatsListAPI(OptionalPaginationListAPIView):
    serializer_class = serializers.AwardsStatsWithRecentWinnersSerializer
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsCourseStudent, IsCourseTeacher],
            message='This view can be accessed only by: school manager, group teacher, course teacher or student'
        )
    ]
    filterset_fields = ['is_active']
    ordering_fields = ['points', 'created_at', 'updated_at', 'is_active', 'issued_total']
    search_fields = ['name']
    ordering = ['-issued_total']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.check_course()
        
    def check_course(self):
        qs = Course.objects.all()
        self.course = get_object_or_404(qs, pk=self.kwargs['course_id'])
        self.check_object_permissions(self.request, self.course)
    
    def get_queryset(self):
        last_winners_of_award = Subquery(
            Winner.objects.filter(award=OuterRef('award_id'), course=self.course).values_list('id', flat=True)[:5]
        )
        return Award.objects.of_school(self.course.school).prefetch_related(
            Prefetch(
                lookup='winners', 
                queryset=Winner.objects.filter(course=self.course)
                ),
            Prefetch(
                lookup='winners', 
                queryset=Winner.objects.filter(id__in=last_winners_of_award).select_related(*Winner.related_fields), 
                to_attr='recent_winners'
                )
        ).annotate(issued_total = Count('winners', filter=Q(winners__course=self.course)))