# Generated by Django 4.0.3 on 2023-05-08 05:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('final_marks', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='termmark',
            name='course',
        ),
    ]