from .users.permissions import (
    IsManager, 
    IsTeacher, 
    OnlyOwnSchool, 
    OnlyOwnSchoolObject,
    IsManagerOrReadOnly,
    IsUserItself
)

from .groups.permissions import (
    IsGroupTeacher
)