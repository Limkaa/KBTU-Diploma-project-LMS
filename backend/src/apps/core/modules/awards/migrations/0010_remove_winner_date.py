# Generated by Django 4.0.3 on 2023-04-28 15:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('awards', '0009_remove_award_issued_by_course_teacher_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='winner',
            name='date',
        ),
    ]
