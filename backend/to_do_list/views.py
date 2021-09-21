from django.shortcuts import render
from django.http import HttpResponse
import json
from django.core import serializers
from .models import *
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseServerError
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .ResponseModels.SharerTask import SharerTask
from .ResponseModels.Sharer import Sharer
from friendship.models import Block, Follow, Friend, FriendshipRequest
from itertools import chain
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.core.exceptions import ValidationError
import hashlib
import jsonpickle
import uuid

# Create your views here.


def user_id(request, user):
    return HttpResponse(user)


@csrf_exempt
def completed_tasks(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':

        data = list(Tasks.objects.filter(
            user=u, task_completed=True).order_by('task_priority').values())
        return JsonResponse({'user': data})
    elif request.method == "PUT":

        json_data = json.loads(request.body)
        json_key = {}
        for key, value in json_data.items():
            json_key = key
        if json_key == 'undo_completed_task_id':
            t = Tasks.objects.get(pk=json_data['undo_completed_task_id'])
            t.task_completed = False
            t.save()
            return HttpResponse("undo complete successful")
        elif json_key == 'completed_task_id':
            t = Tasks.objects.get(pk=json_data['completed_task_id'])
            t.task_completed = True
            t.save()
            return HttpResponse("marked complete successful")
    elif request.method == 'DELETE':
        json_data = json.loads(request.body)
        if json_data['task_id'] == "all":
            t = Tasks.objects.filter(user=u, task_completed=True)
            t.delete()
            return HttpResponse("completed tasks deleted")
        else:
            t = Tasks.objects.filter(pk=json_data['task_id'])
            t.delete()
            return HttpResponse("completed task deleted")


@csrf_exempt
def tasks(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':

        no_sharing_incompleted_data = []
        no_sharing_completed_data = []
        sharing_with = {'user_id': None,
                        'user_display_name': None, 'user_email': None}
        incompleted = list(Tasks.objects.filter(
            user=u, task_completed=False, sharedtasks=None).order_by('task_priority').values())
        for task in incompleted:
            no_sharing_incompleted_data.append(
                {"task": task, 'sharing_with': sharing_with})
        completed = list(Tasks.objects.filter(
            user=u, task_completed=True, sharedtasks=None).order_by('task_priority').values())
        for task in completed:
            no_sharing_completed_data.append(
                {"task": task, 'sharing_with': sharing_with})

        received_data = []

        received_shared_tasks = SharedTasks.objects.filter(recipient=u)
        for task in received_shared_tasks:
            task_info = list(Tasks.objects.filter(pk=task.task_id).values())
            if task_info[0]["task_completed"] == False:
                continue
            sent_from = list(User.objects.filter(user_id=task.sender_id).values(
                "user_email", "user_display_name", "user_id"))

            merged_data = task_info + sent_from
            json_friendly = {
                "task": merged_data[0], "sharing_with": merged_data[1]}
            received_data.append(json_friendly)
        sent_data = []
        sent_shared_tasks = SharedTasks.objects.filter(sender=u)
        for task in sent_shared_tasks:
            task_info = list(Tasks.objects.filter(pk=task.task_id).values())
            if task_info[0]["task_completed"] == False:
                continue
            received_from = list(User.objects.filter(user_id=task.recipient_id).values(
                "user_email", "user_display_name", "user_id"))

            merged_data = task_info + received_from
            json_friendly = {
                "task": merged_data[0], "sharing_with": merged_data[1]}
            sent_data.append(json_friendly)

        completed_data = received_data + sent_data + no_sharing_completed_data

        received_data = []

        received_shared_tasks = SharedTasks.objects.filter(recipient=u)
        for task in received_shared_tasks:
            task_info = list(Tasks.objects.filter(pk=task.task_id).values())
            if task_info[0]["task_completed"] == True:
                continue
            sent_from = list(User.objects.filter(user_id=task.sender_id).values(
                "user_email", "user_display_name", "user_id"))

            merged_data = task_info + sent_from
            json_friendly = {
                "task": merged_data[0], "sharing_with": merged_data[1]}
            received_data.append(json_friendly)
        sent_data = []
        sent_shared_tasks = SharedTasks.objects.filter(sender=u)
        for task in sent_shared_tasks:
            task_info = list(Tasks.objects.filter(pk=task.task_id).values())
            if task_info[0]["task_completed"] == True:
                continue
            received_from = list(User.objects.filter(user_id=task.recipient_id).values(
                "user_email", "user_display_name", "user_id"))

            merged_data = task_info + received_from
            json_friendly = {
                "task": merged_data[0], "sharing_with": merged_data[1]}
            sent_data.append(json_friendly)

        incompleted_data = received_data + sent_data + no_sharing_incompleted_data

        return JsonResponse({"complete": completed_data, "incomplete": incompleted_data})

    if request.method == 'DELETE':
        json_data = json.loads(request.body)

        t = Tasks.objects.filter(user=u, pk=json_data['task_id'])
        t.delete()

        return HttpResponse(f"{user} tasks deleted")
    if request.method == 'POST':
        json_data = json.loads(request.body)
        sharing_with = json_data["sharing_with"]["user_id"]
        task = json_data['task']
        if sharing_with == None:
            try:
                d = datetime.datetime.strptime(
                    task["task_date_time"], '%d. %B %Y %H:%M')

                t = Tasks(task_id=task['task_id'], user=u, task_name=task['task_name'], task_description=task['task_description'],
                          task_drawing=task['task_drawing'], task_date_time=d, task_priority=task['task_priority'])
                t.save()
                return HttpResponse(f"{user} tasks saved")
            except:
                return HttpResponseError("Invalid input format")
        else:
            recipient = User.objects.get(pk=sharing_with)
            d = datetime.datetime.strptime(
                task["task_date_time"], '%d. %B %Y %H:%M')
            task_created = Tasks(task_id=task['task_id'], user=u, task_name=task['task_name'], task_description=task['task_description'],
                                 task_drawing=task['task_drawing'], task_date_time=d, task_priority=task['task_priority'])
            task_created.save()
            shared_task_created = SharedTasks(
                sender=u, recipient=recipient, task=task_created)
            shared_task_created.save()
            return HttpResponse("shared task created")

    if request.method == 'PUT':
        json_data = json.loads(request.body)
        d = datetime.datetime.strptime(
            json_data["task_date_time"], '%d. %B %Y %H:%M')
        t = Tasks(pk=json_data['task_id'], user=u, task_name=json_data['task_name'], task_priority=json_data['task_priority'],
                  task_drawing=json_data['task_drawing'], task_description=json_data['task_description'], task_date_time=d)
        t.save()
        return HttpResponse("nice")


@csrf_exempt
def users(request, user):
    if request.method == 'GET':

        safe_user_query = User.objects.exclude(user_id=user).values(
            "user_email", "user_display_name", "user_id")
        safe_user_data = list(safe_user_query)
        return JsonResponse({'all_users': safe_user_data})
    if request.method == "POST":
        pass


@csrf_exempt
def log_in(request):
    if request.method == "POST":
        json_data = json.loads(request.body)

        try:
            user_salt = User.objects.get(
                user_email=json_data['email']).user_salt
            hashed_password = hashlib.sha512(json_data['password'].encode(
                'utf-8') + user_salt.encode('utf-8')).hexdigest()
            user = User.objects.get(
                user_email=json_data['email'], user_hash=hashed_password)

            return JsonResponse({"user_id": user.user_id, "user_display_name": user.user_display_name})
        except:
            return HttpResponseServerError


@csrf_exempt
def register(request):

    if request.method == "POST" or request.method == "OPTIONS":
        json_data = json.loads(request.body)

        try:
            validate_email(json_data['email'])
        except:
            return HttpResponseServerError("Invalid email format")

        try:
            try:
                if User.objects.get(user_email=json_data['email']).user_registered:
                    return HttpResponseServerError("Email already registered")

            except:
                if User.objects.get(user_display_name=json_data['name']).user_registered:
                    return HttpResponseServerError("Display name taken")
        except:
            salt = uuid.uuid4().hex
            hashed_password = hashlib.sha512(json_data['password'].encode(
                'utf-8') + salt.encode('utf-8')).hexdigest()
            u = User(user_hash=hashed_password, user_salt=salt,
                     user_display_name=json_data['name'], user_email=json_data['email'], user_registered=True)
            u.save()

            return JsonResponse({"user_id": u.user_id, "user_display_name": u.user_display_name})


# def index(request):
#     return HttpResponse("Hello, world. You're at the polls index.")
index = never_cache(TemplateView.as_view(template_name='index.html'))


@csrf_exempt
def add_friend(request, user):

    if request.method == 'POST':
        json_data = json.loads(request.body)
        from_user = User.objects.get(pk=user)
        to_user = User.objects.get(pk=json_data['to_user_id'])
    try:
        Friend.objects.add_friend(from_user, to_user)
        return HttpResponse("friend request sent")
    except:
        return HttpResponseServerError("User is already your friend")
        # except:
        #     return HTTPResponseServerError("You are already friends with this user")


@csrf_exempt
def remove_friend(request, user):
    if request.method == 'POST':
        json_data = json.loads(request.body)
        from_user = User.objects.get(pk=user)
        to_user = User.objects.get(pk=json_data['to_user_id'])
        Friend.objects.remove_friend(from_user, to_user)
        return HttpResponse("friend successfully removed")


@csrf_exempt
def accept_friend(request, user):
    if request.method == 'POST':
        to_user_id = User.objects.get(pk=user)
        json_data = json.loads(request.body)
        from_user_id = User.objects.get(pk=json_data['from_user_id'])
        friend_request = FriendshipRequest.objects.get(
            from_user_id=from_user_id, to_user_id=to_user_id)
        friend_request.accept()
        return HttpResponse("friend successfully added")


@csrf_exempt
def reject_friend(request, user):
    if request.method == 'POST':
        to_user_id = User.objects.get(pk=user)
        json_data = json.loads(request.body)
        from_user_id = User.objects.get(pk=json_data['from_user_id'])
        friend_request = FriendshipRequest.objects.get(
            from_user_id=from_user_id, to_user_id=to_user_id)
        friend_request.reject()
        return HttpResponse("friend successfully added")


@csrf_exempt
def list_received_friend_requests(request, user):
    u = User.objects.get(pk=user)
    if request.method == "GET":
        data = []
        user_friend_requests = Friend.objects.unrejected_requests(user=u)
        for request in user_friend_requests:
            data.append({"user_display_name": request.from_user.user_display_name,
                        "user_id": request.from_user.user_id, "user_email": friend.user_email})
        return JsonResponse({"user_friend_requests": data})


@csrf_exempt
def list_sent_friend_requests(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        data = []
        user_sent_friend_requests = Friend.objects.sent_requests(user=u)
        for friend_request in user_sent_friend_requests:
            data.append({"user_display_name": friend_request.to_user.user_display_name,
                        "user_id": friend_request.to_user.user_id, "user_email": friend.user_email})
        return JsonResponse({"user_sent_friend_requests": data})


@csrf_exempt
def list_users_friends(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        data = []
        users_friends = Friend.objects.friends(u)
        for friend in users_friends:
            data.append(
                {"user_display_name": friend.user_display_name, "user_id": friend.user_id, "user_email": friend.user_email})

        return JsonResponse({"user_friends": data}, safe=False)
