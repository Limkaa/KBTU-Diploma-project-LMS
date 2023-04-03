# Generated by Django 4.0.3 on 2023-03-28 11:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('terms', '0002_year_remove_cycle_school_and_more'),
        ('courses', '0004_remove_course_cycle'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='year',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='courses', to='terms.year'),
        ),
    ]
