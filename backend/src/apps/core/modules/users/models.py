from django.db import models

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db.models.functions import Now
from django.db.models import Q


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, *args, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password=None, *args, **kwargs):
        user = self.create_user(email, password=password, **kwargs)

        user.role = User.Role.MANAGER
        user.is_staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, *args, **kwargs):
        user = self.create_staffuser(email, password=password, **kwargs)

        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    username = None

    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        blank=False,
        unique=True,
    )

    first_name = models.CharField(max_length=150, blank=False)
    last_name = models.CharField(max_length=150, blank=False)
    school = models.ForeignKey(
        "schools.School", on_delete=models.PROTECT, null=True, blank=True
    )

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        UNKNOWN = "unknown", "Unknown"

    default_gender = Gender.UNKNOWN
    gender = models.CharField(
        max_length=7,
        choices=Gender.choices,
        default=default_gender,
        blank=False,
    )

    date_of_birth = models.DateField(null=False, blank=False)

    class Role(models.TextChoices):
        MANAGER = "manager", "Manager"
        TEACHER = "teacher", "Teacher"
        STUDENT = "student", "Student"
        PARENT = "parent", "Parent"
        UNKNOWN = "unknown", "Unknown"

    default_role = Role.UNKNOWN
    role = models.CharField(
        max_length=15,
        default=default_role,
        blank=False,
        choices=Role.choices,
    )

    phone = models.CharField(max_length=50, blank=True)
    telegram_id = models.CharField(max_length=50, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    rating = models.IntegerField(default=0, null=False, blank=False)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "gender", "date_of_birth"]

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(date_of_birth__lte=Now()),
                name="date of birth must be less than or equal current date and time",
            )
        ]

    def __str__(self):
        return self.email

    @property
    def fullname(self):
        return self.get_full_name()
