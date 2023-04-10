from django.contrib import admin


class CustomModelAdmin(admin.ModelAdmin):
    base_read_only_fields = []
     
    def get_readonly_fields(self, request, obj=None):
        if obj is None:
            return self.base_read_only_fields
        return self.model.non_updatable_fields + self.base_read_only_fields