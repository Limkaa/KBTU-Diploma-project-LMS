from apps.core.modules.awards.models import Award

AWARDS = [
    Award(
        name="Above & Beyond Award",
        description="The student who always does his best, whether on the playground or in the classroom",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=False,
    ),
    Award(
        name="Genius Award",
        description="Given to a student who has demonstrated a unique and creative approach to solving a problem or task. For students who can stand out for their originality and ingenuity.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=False,
    ),
    Award(
        name="Top Problem Solver Award",
        description=" This award is given to a student who solves complex problems and tasks quickly and efficiently. For students who are distinguished by logical thinking and the ability to analyze complex issues.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=False,
    ),
    Award(
        name="Bookworm Award",
        description="Given to a student who has demonstrated diligence and passion for reading. For students who value knowledge and are able to find answers to their questions.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=False,
    ),
    Award(
        name="Sports Hero Award",
        description="This award is given to a student who has achieved outstanding results in a sport or physical activity. For students who stand for healthy and active lifestyle.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=True,
    ),
    Award(
        name="Cultural Genius Award",
        description="Given to a student who has shown interest and talent in art, music, theater or literature. This award is designed for students who self-improving culturally and artistically.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=True,
    ),
    Award(
        name="Mentor Award",
        description="This award is given to a student who has proven to be a good mentor and leader who is able to help other students in their studies or daily life.",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=True,
    ),
    Award(
        name="Most Smiling Award",
        description=": Given to a student who is always welcoming, friendly and smiling",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=True,
    ),
    Award(
        name="Student Of The Year Award",
        description="Awarded to a student who has shown outstanding results throughout the year and based on the results of the final grades",
        issued_by_course_teacher=False,
        issued_by_group_teacher=False,
        issued_by_manager=True,
    ),
    Award(
        name="Student Of The Month Award",
        description="Issued to a student who has shown himself actively and showed high results in the subject or in the work of the class for the current month",
        issued_by_course_teacher=True,
        issued_by_group_teacher=True,
        issued_by_manager=False,
    ),
]