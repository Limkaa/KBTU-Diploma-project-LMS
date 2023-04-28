# Generated by Django 4.0.3 on 2023-04-28 06:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0004_alter_group_unique_together_alter_group_grade'),
        ('courses', '0006_remove_course_feed_remove_course_files_folder_and_more'),
        ('awards', '0004_alter_winner_issued_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='winner',
            name='course',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='awards', to='courses.course'),
        ),
        migrations.AlterField(
            model_name='winner',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='awards', to='groups.group'),
        ),
    ]
