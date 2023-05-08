# Generated by Django 4.0.3 on 2023-05-07 11:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('assignments', '0001_initial'),
        ('enrollments', '0001_initial'),
        ('marks', '0003_alter_mark_unique_together'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='mark',
            name='enrollment',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='marks', to='enrollments.enrollment'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='mark',
            unique_together={('assignment', 'enrollment')},
        ),
        migrations.RemoveField(
            model_name='mark',
            name='student',
        ),
    ]
