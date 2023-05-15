from django.apps import AppConfig


class MarksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core.modules.marks'
    
    def ready(self) -> None:
        from . import signals
        from .notifications import signals
