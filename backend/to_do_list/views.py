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
import hashlib, uuid

# Create your views here.

def get_tasks_by_user(request, user):
    u = Users(pk=user)
    # tasks = u.tasks_set.order_by('task_priority') 
    # tasks = Tasks.objects.filter(user=u).order_by('task_priority')
    # data = serializers.serialize('json',tasks)
    # return HttpResponse(data, content_type='application/json')
    # return JsonResponse(tasks, safe=False)
    data = list(Tasks.objects.filter(user=u).order_by('task_priority').values())
    return JsonResponse({f'{user}': data})
def get_user(request, user):
    return HttpResponse(user)
# def register(request, login, password, first_name, email, registered=True):
#     u = Users(user_login=login, user_password=password, user_first_name=first_name, user_email=email, user_registered=registered)
#     u.save()
#     return HttpResponse(reverse(f"{user_first_name} created successfully!"))
def log_in(request, username, password):
    salt = uuid.uuid4().hex
    hashed_password = hashlib.sha512(password + salt).hexdigest()
    user_id = Users(user_login=username,user_password=hashed_password)
    if user_id.user_registered:
        return HttpResponse(user)
    return HttpResponse("Log in name or password does not exist")


@csrf_exempt 
def register(request):
    if request.method == "POST":
        json_data=json.loads(request.body)
        
        data = json_data['data']
        salt = uuid.uuid4().hex
        hashed_password = hashlib.sha512(data['password'] + salt).hexdigest()
        if Users.objects.get(user_login=data['login']).user_registered:
            return JsonResponse({"user_login_exists":True})
        elif Users.objects.get(user_email=data['email']).user_registered:
            return JsonResponse({"user_email_exists":True})
        hashed_password = hashlib.sha512(data['password'] + salt).hexdigest()
        u = Users(user_login=data['login'], user_password=hashed_password, user_first_name=data['first_name'], user_email=data['email'], user_registered=True)
        u.save()
        return HttpResponse(u.user_id)
        




def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")