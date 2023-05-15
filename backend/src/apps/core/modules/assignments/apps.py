from django.apps import AppConfig


class AssignmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core.modules.assignments'
    
    def ready(self) -> None:
        from .notifications import signals
