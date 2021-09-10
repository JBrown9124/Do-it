# Generated by Django 3.2.6 on 2021-09-09 20:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('to_do_list', '0016_auto_20210909_2012'),
    ]

    operations = [
        migrations.CreateModel(
            name='Friendship',
            fields=[
                ('friendship', models.AutoField(primary_key=True, serialize=False)),
                ('created_date_time', models.DateTimeField(auto_now_add=True)),
                ('addressee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='addressee', to='to_do_list.users')),
                ('requester', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requester', to='to_do_list.users')),
            ],
        ),
        migrations.CreateModel(
            name='MyStatus',
            fields=[
                ('status_code', models.CharField(max_length=1, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='FriendshipStatus',
            fields=[
                ('friendship_status', models.AutoField(primary_key=True, serialize=False)),
                ('specified_date_time', models.DateTimeField()),
                ('addressee_status', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='addressee_status', to='to_do_list.friendship')),
                ('requester_status', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='requester_status', to='to_do_list.friendship')),
                ('specifier_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='to_do_list.users')),
                ('status_code', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='to_do_list.mystatus')),
            ],
        ),
    ]