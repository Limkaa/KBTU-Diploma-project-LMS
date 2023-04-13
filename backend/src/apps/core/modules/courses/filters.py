import django_filters
from .models import Course


class CoursesFilterSet(django_filters.FilterSet):
    no_teacher = django_filters.BooleanFilter(field_name="teacher", lookup_expr='isnull')
    
    class Meta:
        model = Course
        fields = ['is_active', 'subject__grade', 'year']


__all__ = [
    'CoursesFilterSet'
]