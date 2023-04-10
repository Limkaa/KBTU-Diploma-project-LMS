# Generated by Django 4.0.3 on 2023-04-10 09:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schools', '0003_remove_school_feed_alter_school_name'),
        ('timetables', '0002_remove_room_floor'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='room',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='room',
            name='name',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='room',
            unique_together={('school', 'name')},
        ),
        migrations.RemoveField(
            model_name='room',
            name='number',
        ),
    ]