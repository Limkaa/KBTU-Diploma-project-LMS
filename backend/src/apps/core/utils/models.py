from django.db import models


class CustomModel(models.Model):
    non_updatable_fields = []
    
    class Meta:
        abstract = True

    def get_updatable_fields(self) -> list[str]:
        all_fields = [str(f.name) for f in self._meta.fields]
        updatable_fields = list(set(all_fields) - set(self.non_updatable_fields))
        return updatable_fields
    
    def save(self, *args, **kwargs):
        self.full_clean()
        if self.pk is None:
            return super().save(*args, **kwargs)
        super().save(update_fields=self.get_updatable_fields(), *args, **kwargs)
