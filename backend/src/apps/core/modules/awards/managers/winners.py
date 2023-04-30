import datetime

from django.db.models import Count, Prefetch, OuterRef, Subquery, Q, Manager


class WinnerManager(Manager):
    
    def of_award(self, award):
        return self.filter(award=award)

    def of_school(self, school):
        return self.filter(student__user__school=school)
    
    def of_student(self, student):
        return self.filter(student=student)
    
    def of_course(self, course):
        return self.filter(course=course, student__group=course.group)
    
    def issued_by(self, issuer):
        return self.filter(issued_by=issuer)