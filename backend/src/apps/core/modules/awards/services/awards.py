from typing import Optional

from ..models import Award, School


class AwardService:
    
    @staticmethod
    def queryset():
        return Award.objects.all()
    
    @staticmethod
    def get_award(*args, **kwargs) -> Optional[Award]:
        return Award.objects.filter(**kwargs).first()
    
    @staticmethod
    def get_awards_of_school(school: School):
        return Award.objects.filter(school=school)