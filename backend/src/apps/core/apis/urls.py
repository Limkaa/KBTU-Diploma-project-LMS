from ..utils.apis import APIConfig

from ..modules import *

modules = [
    APIConfig(awards.urls_path, active=True),
    APIConfig(todos.urls_path, active=True),
    APIConfig(communities.urls_path, active=True),
    APIConfig(enrollments.urls_path, active=True),
    APIConfig(marks.urls_path, active=True),
    APIConfig(final_marks.urls_path, active=True),
]

urlpatterns = [module.connect() for module in modules if module.active]