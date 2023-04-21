from django.urls import include, path

urlpatterns = [
    path("auth/", include(("apps.authentication.urls", "authentication"))),
    path("", include(("apps.core.modules.users.urls", "users"))),
    path("", include(("apps.core.modules.grades.urls", "grades"))),
    path("", include(("apps.core.modules.schools.urls", "schools"))),
    path("", include(("apps.core.modules.groups.urls", "groups"))),
    path("", include(("apps.core.modules.students.urls", "students"))),
    path("", include(("apps.core.modules.subjects.urls", "subjects"))),
    path("", include(("apps.core.modules.terms.urls", "terms"))),
    path("", include(("apps.core.modules.courses.urls", "courses"))),
    path("", include(("apps.core.modules.syllabus.urls", "syllabus"))),
    path("", include(("apps.core.modules.assignments.urls", "assignments"))),
    path("", include(("apps.core.modules.posts.courses.urls", "courses-posts"))),
    path("", include(("apps.core.modules.posts.schools.urls", "schools-posts"))),
    
    path('', include(('apps.core.modules.timetables.rooms.urls', 'rooms'))),
    path('', include(('apps.core.modules.timetables.timebounds.urls', 'timebounds'))),
    path('', include(('apps.core.modules.timetables.timetables.urls', 'timetables'))),
    
    path("", include(("apps.core.modules.comments.course.urls", "courses-posts-comments"))),
    path("", include(("apps.core.modules.comments.school.urls", "schools-posts-comments"))),
    
    path("", include(("apps.core.modules.marks.urls", "assignments-marks"))),
]
