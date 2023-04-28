from ..models import Winner, Award


class WinnerService:
    
    @staticmethod
    def queryset():
        return Winner.objects.all()
    
    @staticmethod
    def get_winners_of_award(award: Award):
        return Winner.objects.filter(award=award)