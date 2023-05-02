from .models import Enrollment, Course, Student


def get_not_enrolled_students(course: Course):
    enrolled_students_ids = Enrollment.objects.filter(
        student__group=course.group,
        subject=course.subject,
        year=course.year
    ).values_list('student', flat=True)
    
    not_enrolled_students = Student.objects.filter(
        group=course.group
    ).exclude(id__in=enrolled_students_ids)
    return not_enrolled_students


def get_transferred_enrollments(course: Course):
    transferred_students = Enrollment.objects.filter(
        student__group=course.group,
        subject=course.subject,
        year=course.year
    ).exclude(course=course)
    return transferred_students