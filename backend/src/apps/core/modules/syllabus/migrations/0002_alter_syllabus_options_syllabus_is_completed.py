# Generated by Django 4.0.3 on 2023-04-07 12:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('syllabus', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='syllabus',
            options={'verbose_name_plural': 'Syllabuses'},
        ),
        migrations.AddField(
            model_name='syllabus',
            name='is_completed',
            field=models.BooleanField(default=False),
        ),
    ]
