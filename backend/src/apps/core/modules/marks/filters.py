import django_filters
from .models import Assignment, Mark


class AssignmentFilterSet(django_filters.FilterSet):
    no_marks = django_filters.BooleanFilter(field_name="marks", lookup_expr='isnull', distinct=True)
    
    class Meta:
        model = Assignment
        fields = ['is_active', 'term', 'course', 'course__teacher', 'course__subject', 'course__subject__grade', 'course__year']


__all__ = [
    'AssignmentFilterSet',
]