import datetime

from django.db.models import Count, Q, Manager


class AwardManager(Manager):
    
    class Prefetchable:
        WINNERS = 'winners'
    
    def of_school(self, school):
        return self.filter(school=school)
    
    def count_issued_total(self):
        return Count(self.Prefetchable.WINNERS)
    
    def count_issued_today(self):
        today_filter = Q(winners__date=datetime.date.today())
        return Count(self.Prefetchable.WINNERS, filter=today_filter)
    
    def annotate_with_totals(self):
        return self.annotate(
            issued_total = self.count_issued_total(),
            issued_today = self.count_issued_today()
        )