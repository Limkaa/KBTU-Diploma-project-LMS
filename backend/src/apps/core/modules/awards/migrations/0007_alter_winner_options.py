# Generated by Django 4.0.3 on 2023-04-28 08:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('awards', '0006_alter_award_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='winner',
            options={'ordering': ['-created_at']},
        ),
    ]