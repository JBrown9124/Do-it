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
from .ResponseModels.users import UsersResponseModel
from friendship.models import Block, Follow, Friend, FriendshipRequest


from django.core.exceptions import ValidationError
import hashlib
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
        for key,value in json_data.items():
            json_key=key
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
            t = Tasks.objects.filter(user=u,task_completed=True)
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
        
        Incompleted = list(Tasks.objects.filter(
            user=u,task_completed=False).order_by('task_priority').values())
        Completed =list(Tasks.objects.filter(
            user=u,task_completed=True).order_by('task_priority').values())
        data={"incomplete": Incompleted, "complete": Completed}
        return JsonResponse(data, safe=False)
    if request.method == 'DELETE':
        json_data= json.loads(request.body)
        
        t = Tasks.objects.filter(user=u, pk=json_data['task_id'])
        t.delete()

        return HttpResponse(f"{user} tasks deleted")
    if request.method == 'POST':
        json_data = json.loads(request.body)
        try:
            d = datetime.datetime.strptime(
                json_data["task_date_time"], '%d. %B %Y %H:%M')

            t = Tasks(user=u, task_id=json_data['task_id'], task_name=json_data['task_name'], task_priority=json_data['task_priority'],
                  task_description=json_data['task_description'], task_date_time=d)
            t.save()
            return HttpResponse(f"{user} tasks saved")
        except:
            return HttpResponseError("Invalid input format")
    if request.method == 'PUT':
        json_data = json.loads(request.body)
        d = datetime.datetime.strptime(
            json_data["task_date_time"], '%d. %B %Y %H:%M')
        t = Tasks(pk=json_data['task_id'], user=u, task_name=json_data['task_name'], task_priority=json_data['task_priority'],
                  task_description=json_data['task_description'], task_date_time=d)
        t.save()
        return HttpResponse("nice")






def users(request, user):
    if request.method == 'GET':
        # safe_user_data = []
        # all_users_info = Users.objects.all()
        # for user in all_users_info:
        #     user_response_model = UsersResponseModel()
        #     user_response_model.user_id = user.user_id
        #     user_response_model.user_email = user.user_email
        #     user_response_model.user_display_name = user.user_display_name
        #     safe_user_data.append(user_response_model)
        safe_user_query = User.objects.exclude(user_id=user).values("user_email", "user_display_name", "user_id")
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
            return HttpResponse(u.user_id)


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

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
        friend_request = FriendshipRequest.objects.get(from_user_id=from_user_id, to_user_id=to_user_id)
        friend_request.accept()
        return HttpResponse("friend successfully added")
@csrf_exempt
def reject_friend(request,user):
    if request.method == 'POST':
        to_user_id = User.objects.get(pk=user)
        json_data = json.loads(request.body)
        from_user_id = User.objects.get(pk=json_data['from_user_id'])
        friend_request = FriendshipRequest.objects.get(from_user_id=from_user_id, to_user_id=to_user_id)
        friend_request.reject()
        return HttpResponse("friend successfully added")


def list_received_friend_requests(request, user):
    u = User.objects.get(pk=user)
    if request.method == "GET":
        data = []
        user_friend_requests = Friend.objects.unrejected_requests(user=u)
        for request in user_friend_requests:
            data.append({"user_display_name": request.from_user.user_display_name, "user_id":request.from_user.user_id})
        return JsonResponse({"user_friend_requests": data})
def list_sent_friend_requests(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        data = []
        user_sent_friend_requests = Friend.objects.sent_requests(user=u)
        for request in user_sent_friend_requests:
            data.append({"user_display_name": request.from_user.user_display_name, "user_id":request.from_user.user_id})
        return JsonResponse({"user_sent_friend_requests":data})
def list_users_friends(request,user):
   u = User.objects.get(pk=user)
   if request.method == 'GET':
       data = []
       users_friends=Friend.objects.friends(u)
       for friend in users_friends:
           data.append({"user_display_name":friend.user_display_name, "user_id":friend.user_id})
       
       return JsonResponse({"user_friends":data}, safe=False)