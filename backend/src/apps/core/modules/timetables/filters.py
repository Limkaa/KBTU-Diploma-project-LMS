import django_filters

from .models import Timetable


class TimetableFilterset(django_filters.FilterSet):
    no_course = django_filters.BooleanFilter(field_name='course', lookup_expr='isnull')
    
    class Meta:
        model = Timetable
        fields = ['room', 'timebound', 'course', 'weekday']