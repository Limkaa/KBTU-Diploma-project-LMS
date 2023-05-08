from . import terms_marks, years_marks

urlpatterns = [
    *terms_marks.urlpatterns,
    *years_marks.urlpatterns
]