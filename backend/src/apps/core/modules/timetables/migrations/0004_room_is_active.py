# Generated by Django 4.0.3 on 2023-04-10 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timetables', '0003_alter_room_unique_together_room_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]