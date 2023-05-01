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
from apps.core.modules.timetables.models import Room, Timebound, Timetable
from apps.core.modules.comments.models import CoursePostComment, SchoolPostComment
from apps.core.modules.marks.models import Mark
from apps.core.modules.awards.models import Award, Winner
from apps.core.modules.todos.models import Todo
from apps.core.modules.communities.models import Community, Membership
from apps.core.modules.enrollments.models import Enrollment


from apps.api import mock_data

MOCK_DATA_PATH = 'apps/api/mock_data'

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

    def bulk_create(self, model, name, objects):
        model.objects.bulk_create(objects)
        message = f'{name} created ({len(objects)} objects)'
        self.stdout.write(self.style.SUCCESS(message))

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
        json_schools = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/schools.json') or []
        
        objects = []
        for school in json_schools:
            objects.append(School.objects.create(**school))
        
        self.stdout.write(self.style.SUCCESS(f'Schools created ({len(objects)} objects)'))
        return objects
        
    def _create_users(self):
        json_users = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/users.json') or []
        
        objects = []
        for index, user in enumerate(json_users):
            objects.append(User.objects.create_user(
                email = f'user{index+1}@gmail.com',
                password = '123',
                school_id = random.choice(self.schools).id,
                role = random.choice(['manager', 'student', 'student', 'student', 'teacher']),
                **user,
            ))
        
        self.stdout.write(self.style.SUCCESS(f'Users created ({len(objects)} objects)'))
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
        
        self.stdout.write(self.style.SUCCESS(f'Grades created ({len(objects)} objects)'))
        return objects
    
    def _create_groups(self):
        json_group_codes = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/groups.json') or []
        
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
            
        self.stdout.write(self.style.SUCCESS(f'Groups created ({len(objects)} objects)'))
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
        json_subjects = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/subjects.json') or []
        
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
            
        self.stdout.write(self.style.SUCCESS(f'Subjects created ({len(objects)} objects)'))
        return objects
    
    def _create_academic_years_and_terms(self):
        json_years = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/years.json') or []
        
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
        self.stdout.write(self.style.SUCCESS(f'Courses created ({len(courses)} objects)'))
    
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
        self.stdout.write(self.style.SUCCESS(f'Syllabuses created ({len(syllabuses)} objects)'))
    
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
        self.stdout.write(self.style.SUCCESS(f'Assignments created ({len(assignments)} objects)'))
    
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
        self.stdout.write(self.style.SUCCESS(f'Courses posts created ({len(posts)} objects)'))
    
    def _create_schools_posts(self):
        schools = School.objects.all()
        posts = []
        
        for school in schools:
            posts_number = random.randint(4, 10)
            
            for post in range(posts_number):
                posts.append(SchoolPost(
                    school=school,
                    title=self._get_lorem(),
                    text=self._get_lorem(sentences=random.randint(0, len(lorems))),
                ))
        
        SchoolPost.objects.bulk_create(posts)
        self.stdout.write(self.style.SUCCESS(f'Schools posts created ({len(posts)} objects)'))
    
    def _create_rooms(self):
        schools = School.objects.all()
        rooms = []
        
        for school in schools:
            room_quantity = random.randint(5, 15)
            rooms_numbers = random.sample(range(1, 1000), room_quantity)
            
            for room in rooms_numbers:
                rooms.append(Room(
                    school=school,
                    name=room,
                    is_active=random.choice([True, True, True, True, True, False])
                ))
            
        Room.objects.bulk_create(rooms)
        self.stdout.write(self.style.SUCCESS(f'Rooms created ({len(rooms)} objects)'))
    
    def _create_timebounds(self):
        json = self._get_data_from_json_file(f'{MOCK_DATA_PATH}/timebounds.json')
        timebounds = []

        for school in self.schools:
            for timebound in json.get("timebounds", []):
                timebounds.append(Timebound(
                    school=school,
                    from_time=timebound.get("from_time"),
                    to_time=timebound.get("to_time")
                ))
                    
        Timebound.objects.bulk_create(timebounds)
        self.stdout.write(self.style.SUCCESS(f'Timebounds created ({len(timebounds)} objects)'))
    
    def _create_schools_comments(self):
        schools = School.objects.all()
        comments = []
        
        for school in schools:
            users = User.objects.filter(school=school)
            posts = SchoolPost.objects.filter(school=school)
            
            for post in posts:
                comments_number = random.randint(0, 5)
                
                for comment in range(comments_number):
                    comments.append(SchoolPostComment(
                        post=post,
                        user=random.choice(users),
                        text=self._get_lorem(sentences=random.randint(1, 5))
                    ))
        
        SchoolPostComment.objects.bulk_create(comments)
        self.stdout.write(self.style.SUCCESS(f'Schools posts comments created ({len(comments)} objects)'))
        
    def _create_courses_comments(self):
        courses = Course.objects.all()
        comments = []
        
        for course in courses:
            students = Student.objects.filter(group=course.group)
            possible_users_ids = [student.pk for student in students]
            if course.teacher:
                possible_users_ids.append(course.teacher.pk)
                
            posts = CoursePost.objects.filter(course=course)
            
            if possible_users_ids:
                for post in posts:
                    comments_number = random.randint(0, 5)
                    
                    for comment in range(comments_number):
                        comments.append(CoursePostComment(
                            post=post,
                            user_id=random.choice(possible_users_ids),
                            text=self._get_lorem(sentences=random.randint(1, 5))
                        ))
        
        CoursePostComment.objects.bulk_create(comments)
        self.stdout.write(self.style.SUCCESS(f'Course posts comments created ({len(comments)} objects)'))
    
    def _create_assignment_marks(self):
        courses = Course.objects.all()
        marks = []
        
        for course in courses:
            students = Student.objects.filter(group=course.group)
            assignments = Assignment.objects.filter(course=course)
            
            for assignment in assignments:
                for student in students:
                    if random.choice([True, False]):
                        marks.append(Mark(
                            assignment=assignment,
                            student=student,
                            number=random.randint(1, 5),
                            comment=self._get_lorem(random.randint(0, 1))
                        ))
        
        Mark.objects.bulk_create(marks)
        self.stdout.write(self.style.SUCCESS(f'Assignments marks created ({len(marks)} objects)'))
    
    def _create_timetables(self):
        schools = School.objects.all()
        timetables = []

        class CourseHours:
            def __init__(self, course, hours) -> None:
                self.course: Course = course
                self.hours = hours
                self.lessons = []
            
            def add_lesson(self, weekday, timebound):
                self.lessons.append([weekday, timebound])
            
            def is_valid_lesson(self, weekday, timebound) -> bool:
                for lesson in self.lessons:
                    if lesson[0] == weekday and lesson[1] == timebound:
                        return False
                return True
        
        def get_random_course(courses: list[CourseHours], weekday, timebound):
            avaliable_courses = [course for course in courses if course.hours > 0]
            
            if not avaliable_courses:
                return None
            
            random_course = random.choice([None, None, None, random.choice(avaliable_courses)])
            
            if random_course:
                if not random_course.is_valid_lesson(weekday, timebound):
                    return get_random_course(courses, weekday, timebound)
            
                random_course.hours -= 1
                random_course.add_lesson(weekday, timebound)
                return random_course.course
            
            return None
        
        for school in schools:
            courses =  [CourseHours(course, random.randint(5, 10)) for course in Course.objects.filter(school=school)]
            rooms = Room.objects.filter(school=school)
            timebounds = Timebound.objects.filter(school=school)
            
            for weekday in Timetable.Weekday.values:
                for room in rooms:
                    for timebound in timebounds:
                        timetables.append(Timetable(
                            school=school,
                            course=get_random_course(courses, weekday, timebound),
                            room=room,
                            timebound=timebound,
                            weekday=weekday
                        ))
                        
        Timetable.objects.bulk_create(timetables)
        self.stdout.write(self.style.SUCCESS(f'Timetables created ({len(timetables)} objects)'))
    
    def _create_awards(self):
        awards: list[Award] = []
        
        for school in School.objects.all():
            awards_data = mock_data.AWARDS
            awards_sample = random.sample(awards_data, random.randint(7, len(awards_data)))
            
            for award in awards_sample:
                awards.append(Award(
                    school=school,
                    name=award.name,
                    description = self._get_lorem(1),
                    points = random.randint(1, 50),
                ))
    
        Award.objects.bulk_create(awards)
        self.stdout.write(self.style.SUCCESS(f'Awards created ({len(awards)} objects)'))
    
    def _create_winners(self):
        winners = []
        
        schools = School.objects.all()
        
        today = datetime.date.today()
        start_date = today - timedelta(days=360)
        
        
        def _create_course_awards():
            for school in schools:
                awards = Award.objects.filter(school=school)
                courses = Course.objects.filter(school=school)
                for course in courses:
                    students = Student.objects.filter(group=course.group)
                    for student in students:
                        awards_number = random.randint(2, 10)
                        for award in range(awards_number):
                            winners.append(Winner(
                                student=student,
                                award=random.choice(awards),
                                issued_by=course.teacher,
                                comment=self._get_lorem(random.randint(0, 1)),
                                course=course
                            ))
                        
        _create_course_awards()
        random.shuffle(winners)
        
        Winner.objects.bulk_create(winners)
        self.stdout.write(self.style.SUCCESS(f'Winners created ({len(winners)} objects)'))
    
    def _create_todos(self):
        todos = []
        
        for user in User.objects.all():
            todos_number = random.randint(0, 10)
            for todo in range(todos_number):
                todos.append(Todo(
                    user=user,
                    name=self._get_lorem(1),
                    description=self._get_lorem(random.randint(0, 3)),
                    is_done=random.choice([True, False, False]),
                    priority=random.randint(0, 3)
                ))
        
        Todo.objects.bulk_create(todos)
        self.stdout.write(self.style.SUCCESS(f'Todos created ({len(todos)} objects)'))
    
    def _create_communities(self):
        communities = []
        for school in School.objects.all():
            sample = list(mock_data.COMMUNITIES)
            total = len(sample)
            start, end = [round(total * 0.5), total]
            quantity = random.randint(start, end)
            communities_sample = random.sample(sample, quantity)
            
            for object in communities_sample:
                communities.append(Community(
                    school=school,
                    name=object.name,
                    description=object.description,
                    link=object.link
                ))
        
        self.bulk_create(Community, 'Communities', communities)
        
    def _create_memberships(self):
        memberships = []
        for school in School.objects.all():
            students = Student.objects.filter(user__school=school)
            communities = Community.objects.filter(school=school)
            for community in communities:
                total = len(students)
                random_number = random.randint(0, round(total*0.5))
                students_sample = random.sample(list(students), random_number)
                for student in students_sample:
                    memberships.append(Membership(
                        community=community,
                        student=student
                    ))
        
        self.bulk_create(Membership, 'Memberships', memberships)
    
    def _create_enrollments(self):
        enrollments = []
        
        for course in Course.objects.all():
            students = Student.objects.filter(group=course.group)
            students_with_enrollments = random.randint(round(len(students)*0.7), len(students))
            students_with_enrollments_sample = random.sample(list(students), students_with_enrollments)
            
            for student in students_with_enrollments_sample:
                enrollments.append(Enrollment(
                    student=student,
                    subject=course.subject,
                    year=course.year,
                    course=course
                ))
        
        self.bulk_create(Enrollment, 'Enrollments', enrollments)
    
    def _create_trasferred_enrollments(self):
        enrollments = []
        
        for course in Course.objects.all():
            students_with_enrollments = Enrollment.objects.filter(course=course).values_list('student_id', flat=True)
            students_without_enrollments = Student.objects.filter(group=course.group).exclude(id__in=students_with_enrollments)
            
            students_transferred_num = random.randint(0, len(students_without_enrollments))
            students_transferred = random.sample(list(students_without_enrollments), students_transferred_num)
            
            same_courses = Course.objects.filter(
                school=course.school,
                subject=course.subject,
                year=course.year
            )
            
            if not same_courses:
                continue
            
            for student in students_transferred:
                enrollments.append(Enrollment(
                    student=student,
                    subject=course.subject,
                    year=course.year,
                    course=random.choice(same_courses)
                ))
        
        self.bulk_create(Enrollment, 'Transferred enrollments', enrollments)
    
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
        self._create_courses_comments()
        self._create_schools_posts()
        self._create_schools_comments()
        self._create_rooms()
        self._create_timebounds()
        self._create_timetables()
        self._create_assignment_marks()
        self._create_awards()
        self._create_winners()
        self._create_todos()
        self._create_communities()
        self._create_memberships()
        self._create_enrollments()
        self._create_trasferred_enrollments()
        
        self._create_superuser()
        
        
        

    
    