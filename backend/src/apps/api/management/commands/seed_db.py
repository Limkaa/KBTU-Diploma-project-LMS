import json
import random
import string
from datetime import timedelta
import datetime

from django.core.management.base import BaseCommand
import pytz
from django.conf import settings

from apps.core.modules.users.models import User
from apps.core.modules.schools.models import School
from apps.core.modules.grades.models import Grade
from apps.core.modules.groups.models import Group
from apps.core.modules.students.models import Student
from apps.core.modules.subjects.models import Subject
from apps.core.modules.terms.models import Year, Term
from apps.core.modules.courses.models import Course
from apps.core.modules.syllabus.models import Syllabus
from apps.core.modules.assignments.models import Assignment
from apps.core.modules.posts.models import CoursePost, SchoolPost

lorems = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Quisque vitae varius ex, eu volutpat orci.",
    "Aenean ullamcorper orci et vulputate fermentum.",
    "Cras erat dui, finibus vel lectus ac, pharetra dictum odio.",
    "Nullam tempus scelerisque purus, sed mattis elit condimentum nec.",
    "Etiam risus sapien, auctor eu volutpat sit amet, porta in nunc.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Proin ipsum purus, laoreet quis dictum a, laoreet sed ligula.",
    "Integer ultricies malesuada quam.",
    "Cras vel elit sed mi placerat pharetra eget vel odio.",
    "Duis ac nulla varius diam ultrices rutrum."
]

class Command(BaseCommand):
    help = 'Fills database with mock data'
    schools = []
    users = []
    grades = []
    groups = []
    subjects = []
    years = []

    def _get_random_string_code(self, length=5):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    def _get_data_from_json_file(self, path):
        with open(path) as file:
            return json.load(file)
        
    def _get_lorem(self, sentences=1, total_length = None):
        text = " ".join(random.sample(lorems, sentences))
        return text[:total_length] if total_length else text
    
    def _get_random_date(self, start, end):
        delta = end - start
        int_delta = (delta.days * 24 * 60 * 60) + delta.seconds + random.randint(0, 86400)
        random_second = random.randrange(int_delta)
        return datetime.datetime.fromtimestamp(random_second, tz=pytz.timezone(settings.TIME_ZONE))
    
    def _create_superuser(self):
        return User.objects.create_superuser(
            email="admin@gmail.com",
            password="admin",
            first_name="Admin",
            last_name="Admin",
            gender="male",
            date_of_birth="2000-01-01"
        )

    def _create_schools(self):
        json_schools = self._get_data_from_json_file('mock_data/schools.json') or []
        
        objects = []
        for school in json_schools:
            objects.append(School.objects.create(**school))
        
        self.stdout.write(self.style.SUCCESS('Schools created'))
        return objects
        
    def _create_users(self):
        json_users = self._get_data_from_json_file('mock_data/users.json') or []
        
        objects = []
        for index, user in enumerate(json_users):
            objects.append(User.objects.create_user(
                email = f'user{index+1}@gmail.com',
                password = '123',
                school_id = random.choice(self.schools).id,
                role = random.choice(['manager', 'student', 'student', 'student', 'teacher']),
                **user,
            ))
        
        self.stdout.write(self.style.SUCCESS('Users created'))
        return objects
    
    def _create_grades(self):
        objects = []
        for school in self.schools:
            number_of_grades = random.randint(5,11)
            for i in range(1, number_of_grades+1):
                objects.append(Grade.objects.create(
                    school_id = school.id,
                    name = f"{i} grade",
                    is_active = True
                ))
        
        self.stdout.write(self.style.SUCCESS('Grades created'))
        return objects
    
    def _create_groups(self):
        json_group_codes = self._get_data_from_json_file('mock_data/groups.json') or []
        
        objects = []
        for school in self.schools:
            grades = list(filter(lambda x: x.school_id == school.id, self.grades))
            teachers = list(filter(lambda x: x.school_id == school.id and x.role == User.Role.TEACHER, self.users))
            
            for group_code in random.sample(json_group_codes, 10):
                objects.append(Group.objects.create(
                    school_id = school.id,
                    teacher_id = random.choice(teachers).id,
                    grade_id = random.choice(grades).id,
                    is_active = random.choice([True, False]),
                    code=group_code
                ))
            
        self.stdout.write(self.style.SUCCESS('Groups created'))
        return objects
        
    def _assign_students_to_groups(self):
        for school in self.schools:
            students = Student.objects.filter(user__school_id = school.id)
            groups = Group.objects.filter(school=school)
            
            for student in students:
                student.group = random.choice(groups)
                student.save()
        
        self.stdout.write(self.style.SUCCESS('Students assigned to groups'))
    
    def _create_subjects(self):
        json_subjects = self._get_data_from_json_file('mock_data/subjects.json') or []
        
        objects = []
        for school in self.schools:
            grades = Grade.objects.filter(school = school)
            
            for grade in grades:
                random_number_of_subjects_for_grade = random.randint(2, len(json_subjects))
                random_subjects_for_grade = random.sample(json_subjects, random_number_of_subjects_for_grade)
                
                for subject in random_subjects_for_grade:
                    objects.append(Subject.objects.create(
                        school_id = school.id,
                        grade = grade,
                        name = subject,
                        is_active = random.choice([True, False]),
                        code=self._get_random_string_code(5)
                    ))
            
        self.stdout.write(self.style.SUCCESS('Subjects created'))
        return objects
    
    def _create_academic_years_and_terms(self):
        json_years = self._get_data_from_json_file('mock_data/years.json') or []
        
        for school in self.schools:
            for year in json_years:
                year = dict(year)
                year_object = Year.objects.create(
                    school_id = school.id,
                    name = year.get('name')
                )
                
                for term in year.get('terms') or []:
                    Term.objects.create(
                        year = year_object,
                        **term
                    )
                    
        self.stdout.write(self.style.SUCCESS('Academic years and terms created'))
    
    def _create_courses(self):
        courses = []
        
        for school in self.schools:
            groups = Group.objects.filter(school=school).select_related('grade')
            year = random.choice(Year.objects.filter(school=school))
            teachers = User.objects.filter(school=school, role=User.Role.TEACHER)
            
            for group in groups:
                subjects_objects = list(Subject.objects.all().filter(school=school, grade=group.grade))
                subjects = random.sample(subjects_objects, random.randint(1, len(subjects_objects)//2))
                
                for subject in subjects:
                    teacher = random.choice(teachers)
                    courses.append(Course(
                        school=school,
                        year=year,
                        subject=subject,
                        group=group,
                        teacher=random.choice([None, teacher, teacher, teacher]),
                        is_active=random.choice([True, False, True])
                    ))
            
        Course.objects.bulk_create(courses)
        self.stdout.write(self.style.SUCCESS('Courses created'))
    
    def _create_syllabuses(self):
        courses = Course.objects.all()
        syllabuses = []
        
        for course in courses:
            syllabus_plans_points_number = random.randint(1, 10)
            
            for plan in range(syllabus_plans_points_number):
                syllabuses.append(Syllabus(
                    course=course,
                    name=self._get_lorem(),
                    description=self._get_lorem(sentences=random.randint(0, len(lorems))),
                    hours=random.randint(1, 4),
                    is_completed=random.choice([True, False * 3])
                ))
        
        Syllabus.objects.bulk_create(syllabuses)
        self.stdout.write(self.style.SUCCESS('Syllabuses created'))
    
    def _create_assignments(self):
        courses = Course.objects.exclude(teacher__isnull=True)
        assignments = []
        
        for course in courses:
            for term in Term.objects.filter(year=course.year):
                assignment_number = random.randint(0, 5)
                
                for assignment in range(assignment_number):
                    assignments.append(Assignment(
                        course=course,
                        term=term,
                        name=self._get_lorem(),
                        description=self._get_lorem(sentences=random.randint(0, len(lorems))),
                        datetime=self._get_random_date(term.from_date, term.to_date),
                        is_active=random.choice([True, True, True, True, False])
                    ))
        
        Assignment.objects.bulk_create(assignments)
        self.stdout.write(self.style.SUCCESS('Assignments created'))
    
    def _create_courses_posts(self):
        courses = Course.objects.all()
        posts = []
        
        for course in courses:
            posts_number = random.randint(0, 10)
            
            for post in range(posts_number):
                posts.append(CoursePost(
                    course=course,
                    title=self._get_lorem(),
                    text=self._get_lorem(sentences=random.randint(0, len(lorems))),
                ))
        
        CoursePost.objects.bulk_create(posts)
        self.stdout.write(self.style.SUCCESS('Courses posts created'))
    
    def _create_schools_posts(self):
        schools = School.objects.all()
        posts = []
        
        for school in schools:
            posts_number = random.randint(0, 10)
            
            for post in range(posts_number):
                posts.append(SchoolPost(
                    school=school,
                    title=self._get_lorem(),
                    text=self._get_lorem(sentences=random.randint(0, len(lorems))),
                ))
        
        SchoolPost.objects.bulk_create(posts)
        self.stdout.write(self.style.SUCCESS('Schools posts created'))
    
    def handle(self, *args, **options):
        self.schools = self._create_schools()
        self.grades = self._create_grades()
        self.users = self._create_users()
        self.groups = self._create_groups()
        self.subjects = self._create_subjects()
        self._create_academic_years_and_terms()
        self._assign_students_to_groups()
        self._create_courses()
        self._create_syllabuses()
        self._create_assignments()
        self._create_courses_posts()
        self._create_schools_posts()
        
        self._create_superuser()
        
        
        

    
    