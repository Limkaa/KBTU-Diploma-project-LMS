from django.db import models
from django.core.exceptions import ValidationError

from ...utils.exceptions import ResponseDetails
from ...utils.models import CustomModel

from ..students.models import Student
from ..subjects.models import Subject
from ..terms.models import Year
from ..courses.models import Course


class Enrollment(CustomModel):
    student = models.ForeignKey(
        to=Student,
        related_name="enrollments",
        on_delete=models.CASCADE,
        null=False,
        blank=False
    )
    subject = models.ForeignKey(
        to=Subject,
        related_name="enrollments",
        on_delete=models.PROTECT,
        null=False,
        blank=False
    )
    year = models.ForeignKey(
        to=Year,
        related_name="enrollments",
        on_delete=models.PROTECT,
        null=False,
        blank=False
    )
    course = models.ForeignKey(
        to=Course,
        related_name="enrollments",
        on_delete=models.PROTECT,
        null=False,
        blank=False
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    non_updatable_fields = ['id', 'student', 'subject', 'year', 'created_at']

    class Meta:
        verbose_name = "Enrollment"
        verbose_name_plural = "Enrollments"
        unique_together = ['student', 'subject', 'year']
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.student} registered to {self.subject} in {self.year}"
    
    def clean(self) -> None:
        errors = ResponseDetails()
        errors.clear()
        
        if not self.student.group:
            errors.add_field_message('student', "Student currently is not in any group")
        
        if self.subject.grade != self.student.group:
            errors.add_field_message('subject', "Subject's grade is different from student's group grade")
        
        if self.course.subject != self.subject:
            errors.add_field_message('course', "Course subject is different from enrollment subject")
    
        if self.course.year != self.year:
            errors.add_field_message('course', "Course year is different from enrollment year")
            
        if self.course.subject.grade != self.subject.grade:
            errors.add_field_message('course', "Course subject grade is different from enrollment subject grade")
        
        if errors:
            raise ValidationError(errors.map)