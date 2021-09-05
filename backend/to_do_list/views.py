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
from .ResponseModels.tasks import TasksResponseModel

from django.core.exceptions import ValidationError
import hashlib
import uuid

# Create your views here.


def user_id(request, user):
    return HttpResponse(user)

@csrf_exempt
def completed_tasks(request, user):
    u = Users.objects.get(pk=user)
    if request.method == 'GET':
        
        data = list(Tasks.objects.filter(
            user=u, task_completed=True).order_by('task_priority').values())
        return JsonResponse({'user': data})
    elif request.method =='PUT': 
        json_data = json.loads(request.body)
        t = Tasks.objects.get(pk=json_data['task_id'])
        t.task_completed = True
        t.save()
        return HttpResponse("completed task saved")
    elif request.method == 'DELETE':
        t = Tasks.objects.filter(user=u,task_completed=True)
        t.delete()
        return HttpResponse("completed tasks deleted")
@csrf_exempt
def completed_task(request, user):
    u = Users.objects.get(pk=user)
    if request.method == 'DELETE':
        json_data = json.loads(request.body)
        t = Tasks.objects.filter(pk=json_data['task_id'])
        t.delete()
        return HttpResponse("completed task deleted")
    if request.method == "PUT":
        json_data = json.loads(request.body)
        t = Tasks.objects.get(pk=json_data['task_id'])
        t.task_completed = False
        t.save()
        return HttpResponse("undo complete successful")

def tasks_by_date(request, user):
    u = Users.objects.get(pk=user)

    data = list(Tasks.objects.filter(
        user=u, task_completed=False).order_by('task_date_time').values())

    return JsonResponse({'user': data})
# @csrf_exempt
# def tasks(request, user):
#     u = Users.objects.get(pk=user)
#     if request.method == 'GET':
#         data = dict()
#         task_data = list(Tasks.objects.filter(
#             user=u,task_completed=False).order_by('task_priority').values())
        
#         for d in task_data:
            
#             d_task_id = d["task_id"]
#             d_tasks = d
#             data[d_task_id]=d_tasks
#         return JsonResponse([data], safe=False)
    # if request.method == 'GET':
    #     data = {}
    #     task_data = Tasks.objects.filter(
    #         user=u,task_completed=False).order_by('task_priority')
        
    #     for d in task_data:
    #         t = TasksResponseModel()
    #         t.task_id=d.task_id
    #         t.tasks=d
    #         data[d.task_id] = d
    #     return JsonResponse({'user': data})
    # if request.method == "DELETE":
    #     t = Tasks.objects.filter(user_id=u)
    #     t.delete()
    #     return HttpResponse("tasks deleted")
@csrf_exempt
def tasks(request, user):
    u = Users.objects.get(pk=user)
    if request.method == 'GET':
        
        Incompleted = list(Tasks.objects.filter(
            user=u,task_completed=False).order_by('task_priority').values())
        Completed =list(Tasks.objects.filter(
            user=u,task_completed=True).order_by('task_priority').values())
        data={"incomplete": Incompleted, "complete": Completed}
        return JsonResponse(data, safe=False)
    if request.method == "DELETE":
        t = Tasks.objects.filter(user_id=u)
        t.delete()
        return HttpResponse("tasks deleted")

def tasks_by_name(request, user):
    u = Users.objects.get(pk=user)

    data = list(Tasks.objects.filter(
        user=u, task_completed=False).order_by('task_name').values())

    return JsonResponse({'user': data})


@csrf_exempt
def task_by_task_id(request, user):
    u = Users.objects.get(pk=user)
    if request.method == 'GET':
        json_data = json.loads(request.body)
        t = Tasks.objects.filter(user=u, pk=json_data['task_id'])
        data = list(t.values())
        return JsonResponse({'task': data})


@csrf_exempt
def task(request, user):
    
    u = Users.objects.get(pk=user)
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        d = datetime.datetime.strptime(
            json_data["date_time"], '%d. %B %Y %H:%M')
        t = Tasks(pk=json_data['id'], user=u, task_name=json_data['name'], task_priority=json_data['priority'],
                  task_description=json_data['description'], task_date_time=d)
        t.save()
        return HttpResponse("nice")
    if request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            d = datetime.datetime.strptime(
                json_data["date_time"], '%d. %B %Y %H:%M')

            t = Tasks(user=u, task_name=json_data['name'], task_priority=json_data['priority'],
                  task_description=json_data['description'], task_date_time=d)
            t.save()
            return HttpResponse(f"{user} tasks saved")
        except:
            return HttpResponseError("Invalid input format")
        
    if request.method == 'DELETE':
        json_data= json.loads(request.body)
        
        t = Tasks.objects.filter(user=u, pk=json_data['task_id'])
        t.delete()

        return HttpResponse(f"{user} tasks deleted")



# @csrf_exempt
# def add_task(request, user):
#     u = Users.objects.get(pk=user)
#     if request.method == 'POST':
#         json_data = json.loads(request.body)

#         d = datetime.datetime.strptime(
#             json_data["date_time"], '%d. %B %Y %H:%M')

#         t = Tasks(user=u, task_name=json_data['name'], task_priority=json_data['priority'],
#                   task_description=json_data['description'], task_attendees=json_data['attendees'], task_date_time=d)
#         t.save()
#         return HttpResponse(f"{user} tasks saved")


# @csrf_exempt
# def delete_task(request, user):
#     u = Users.objects.get(pk=user)
#     if request.method == 'DELETE':
#         json_data = json.loads(request.body)

#         t = Tasks.objects.filter(user=u, pk=json_data['task_id'])
#         t.delete()

#         return HttpResponse(f"{user} tasks deleted")


@csrf_exempt
def log_in(request):
    if request.method == "POST":
        json_data = json.loads(request.body)

        try:
            user_salt = Users.objects.get(
                user_email=json_data['email']).user_salt
            hashed_password = hashlib.sha512(json_data['password'].encode(
                'utf-8') + user_salt.encode('utf-8')).hexdigest()
            user = Users.objects.get(
                user_email=json_data['email'], user_hash=hashed_password)

            return HttpResponse(user.user_id)
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
            
            
            
            if Users.objects.get(user_email=json_data['email']).user_registered:
                return HttpResponseServerError("Email already registered")
        except:
            salt = uuid.uuid4().hex
            hashed_password = hashlib.sha512(json_data['password'].encode(
                'utf-8') + salt.encode('utf-8')).hexdigest()
            u = Users(user_hash=hashed_password, user_salt=salt,
                      user_first_name=json_data['name'], user_email=json_data['email'], user_registered=True)
            u.save()
            return HttpResponse(u.user_id)


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
