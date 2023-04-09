from rest_framework import generics

from .models import School
from .serializers import SchoolSerializer

from ..permissions import *


class SchoolRetrieveUpdateAPI(generics.RetrieveUpdateAPIView):
    serializer_class = SchoolSerializer
    queryset = School.objects.all()
    
    def get_permissions(self):
        method = self.request.method
        
        if method == "PUT":
            self.permission_classes = [OnlyOwnSchool, IsManager]
        elif method == "GET":
            self.permission_classes = [OnlyOwnSchool]

        return super().get_permissions()
