# Generated by Django 3.2.6 on 2021-09-06 17:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('to_do_list', '0010_alter_tasks_task_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='users',
            old_name='user_first_name',
            new_name='user_display_name',
        ),
    ]
