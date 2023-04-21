from django.db import models

from rest_framework.generics import get_object_or_404
from rest_framework import generics

from apps.core.utils.pagination import OptionalPaginationListAPIView

from ...permissions import *

from ..models import School, Timebound, Timetable, Room, Course
from ...users.models import User
from ...groups.models import Group

from .serializers import *
from ..filters import TimetableFilterset


class TimetableSlotRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    serializer_class = TimetableUpdateSerializer
    queryset = Timetable.objects.select_related(
        'school',
        'room',
        'room__school',
        'timebound',
        'timebound__school',
        'course',
        'course__school',
        'course__teacher',
        'course__group',
        'course__group__teacher',
        'course__group__grade',
        'course__subject',
    )
    permission_classes = [OnlyOwnSchool, IsManager]


class SchoolTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    serializer_class = TimetableNestedSerializer
    filterset_class = TimetableFilterset
    search_fields = ['room__name', 'course__subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.school = get_object_or_404(School, pk=self.kwargs['school_id'])
        self.check_object_permissions(request, self.school)
    
    def get_queryset(self):
        return Timetable.objects.filter(school=self.school).select_related(
            'room',
            'timebound',
            'course',
            'course__teacher',
            'course__group',
            'course__group__grade',
            'course__group__teacher',
            'course__year',
            'course__subject',
            'course__subject__grade'
        )


class CourseTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsCourseStudent, IsCourseTeacher],
            message="This view can be accessed only by: school manager, group teacher, course teacher or student"
        )
    ]
    
    class OutputSerializer(TimetableNestedSerializer):
        course = None
    
    serializer_class = OutputSerializer
    filterset_fields = ['weekday']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.course = get_object_or_404(Course.objects.select_related('teacher', 'group', 'group__teacher', 'school'), pk=self.kwargs['course_id'])
        self.check_object_permissions(request, self.course)
    
    def get_queryset(self):
        return Timetable.objects.filter(course=self.course).select_related('timebound', 'room')


class RoomTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]
    
    class OutputSerializer(TimetableNestedSerializer):
        room = None
    
    serializer_class = OutputSerializer
    
    class Filters(TimetableFilterset):
        class Meta(TimetableFilterset.Meta):
            exclude = ['room']
    
    filterset_class = Filters
    search_fields = ['course__subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.room = get_object_or_404(Room.objects.select_related('school'), pk=self.kwargs['room_id'])
        self.check_object_permissions(request, self.room)
    
    def get_queryset(self):
        return Timetable.objects.filter(room=self.room).select_related(
            'timebound',
            'course',
            'course__teacher',
            'course__group',
            'course__group__grade',
            'course__group__teacher',
            'course__year',
            'course__subject',
            'course__subject__grade'
        )


class GroupTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[IsManager, IsGroupTeacher, IsGroupStudent],
            message="This view can be accessed only by: school manager, group teacher or student"
        )
    ]
    
    serializer_class = GroupTimetableSerializer  
      
    class Filters(TimetableFilterset):
        no_course = None
    
    filterset_class = Filters
    search_fields = ['room__name', 'course__subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.group = get_object_or_404(Group.objects.select_related('school', 'teacher', 'grade'), pk=self.kwargs['group_id'])
        self.check_object_permissions(request, self.group)
    
    def get_queryset(self):
        return Timetable.objects.filter(course__group=self.group).select_related(
            'room',
            'timebound',
            'course',
            'course__teacher',
            'course__year',
            'course__subject',
        )


class TeacherTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [
        OnlyOwnSchool,
        CustomOperandHolder(
            operand=CustomOR,
            permissions=[
                IsManager, 
                CustomOperandHolder(
                    operand=CustomAND,
                    permissions=[IsTeacher, IsUserItself],
                    message="Teacher can view only own timetable"
                )
            ],
            message="This view can be accessed only by: school manager or teacher itself"
        )
    ]
    
    serializer_class = TeacherTimetableSerializer  
      
    class Filters(TimetableFilterset):
        no_course = None
    
    filterset_class = Filters
    search_fields = ['room__name', 'course__subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.teacher = get_object_or_404(User.objects.all(), pk=self.kwargs['teacher_id'], role=User.Role.TEACHER)
        self.check_object_permissions(request, self.teacher)
    
    def get_queryset(self):
        return Timetable.objects.filter(course__teacher=self.teacher).select_related(
            'room',
            'timebound',
            'course',
            'course__group',
            'course__group__grade',
            'course__group__teacher',
            'course__year',
            'course__subject',
            'course__subject__grade'
        )



class TimeboundTimetableListAPI(OptionalPaginationListAPIView):
    permission_classes = [OnlyOwnSchool, IsManager]  
    
    class OutputSerializer(TimetableNestedSerializer):
        timebound = None
      
    serializer_class = OutputSerializer  
      
    class Filters(TimetableFilterset):
        class Meta(TimetableFilterset.Meta):
            exclude = ['timebound']
    
    filterset_class = Filters
    search_fields = ['room__name', 'course__subject__name']
    
    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        self.timebound = get_object_or_404(Timebound.objects.all(), pk=self.kwargs['timebound_id'])
        self.check_object_permissions(request, self.timebound)
    
    def get_queryset(self):
        return Timetable.objects.filter(timebound=self.timebound).select_related(
            'room',
            'course',
            'course__teacher',
            'course__group',
            'course__group__grade',
            'course__group__teacher',
            'course__year',
            'course__subject',
            'course__subject__grade'
        )