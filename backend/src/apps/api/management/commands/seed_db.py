import json
import random

from django.core.management.base import BaseCommand

from apps.core.modules.users.models import User
from apps.core.modules.schools.models import School
from apps.core.modules.grades.models import Grade
from apps.core.modules.groups.models import Group


class Command(BaseCommand):
    help = 'Fills database with mock data'
    schools = []
    users = []
    grades = []
    groups = []

    
    def _get_data_from_json_file(self, path):
        with open(path) as file:
            return json.load(file)
    
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
        
             
    def handle(self, *args, **options):
        self.schools = self._create_schools()
        self.grades = self._create_grades()
        self.users = self._create_users()
        self.groups = self._create_groups()
        
        self._create_superuser()
        
        

    
    