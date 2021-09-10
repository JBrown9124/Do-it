from django.db import models
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from viewflow.fields import CompositeKey
import datetime

# Create your models here.


class Users(models.Model):
    user_id = models.AutoField(primary_key=True)

    user_hash = models.CharField(max_length=1000)
    user_salt = models.CharField(max_length=1000, default=None)
    user_display_name = models.CharField(max_length=1000)
    user_email = models.EmailField(max_length=254)
    user_registered = models.BooleanField(default=False)
    user_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id}:{self.user_email}, {self.user_display_name}"
    def safe_data(self):
        return self.user_id, self.user_email, self.user_display_name


class Tasks(models.Model):
    task_id = models.CharField(primary_key=True, max_length=60)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=1000)
    task_priority = models.CharField(max_length=1, default=None)
    task_description = models.TextField()

    task_date_time = models.DateTimeField()
    task_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.user_id}: {self.user.user_email}: {self.task_name}: {self.task_id}: {self.task_description}"

    def was_published_recently(self):
        return self.date_time >= timezone.now() - datetime.timedelta(days=1)


class SharedTasks(models.Model):

    task = models.OneToOneField(
        Tasks, primary_key=True, on_delete=models.CASCADE)
    sender = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name='sender')
    recipient = models.ForeignKey(
        Users, on_delete=models.CASCADE, related_name='recipient')
    def __str__(self):
        return f"{self.task} = {self.sender} + {self.recipient} "


class Friendship(models.Model):
    friendship = models.AutoField(primary_key=True)
    requester = models.ForeignKey(
        Users,  on_delete=models.CASCADE, related_name='requester')
    addressee = models.ForeignKey(
        Users,  on_delete=models.CASCADE, related_name='addressee')
    created_date_time = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.requester} + {self.addressee}"


class MyStatus(models.Model):
    status_code = models.CharField(max_length=1, primary_key=True)
    name = models.CharField(max_length=30, unique=True)
    def __str__(self):
        return f"{self.status_code}"

class FriendshipStatus(models.Model):
    friendship_status = models.AutoField(primary_key=True)
    requester_status = models.ForeignKey(Friendship, default=None, on_delete=models.CASCADE, related_name='requester_status')
    addressee_status = models.ForeignKey(Friendship, default=None, on_delete=models.CASCADE, related_name='addressee_status')
    specified_date_time = models.DateTimeField()
    status_code = models.ForeignKey(MyStatus, on_delete=models.CASCADE)
    specifier_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.requester_status}\n{self.status_code}\n{self.specifier_id}"