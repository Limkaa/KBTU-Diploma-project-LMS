from . import terms_marks, years_marks, overview

urlpatterns = [
    *terms_marks.urlpatterns,
    *years_marks.urlpatterns,
    *overview.urlpatterns
]