import django_filters

from .models import Student

class StudentFilter(django_filters.FilterSet):
    no_group = django_filters.BooleanFilter(field_name='group', lookup_expr='isnull')
    
    class Meta:
        model = Student
        fields = ['user__gender', 'group__grade', 'group__teacher', 'group']