from rest_framework import generics

from .models import School
from .serializers import SchoolSerializer

from .. import permissions


class SchoolRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    permission_classes = [
        permissions.IsManagerOrReadOnly,
        permissions.OnlyOwnSchoolObject
    ]
    serializer_class = SchoolSerializer
    queryset = School.objects.all()
