from ...permissions import OnlyOwnSchool


class IsCommentOfOwnSchool(OnlyOwnSchool):
    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj.post)


__all__ = [
    'IsCommentOfOwnSchool',
]