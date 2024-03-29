from django.apps import AppConfig


class AwardsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.core.modules.awards"
    
    def ready(self) -> None:
        from . import signals