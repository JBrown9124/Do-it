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
import hashlib
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
from django.core.exceptions import ValidationError
from itertools import chain
import uuid
import random



# Returns user id for other endpoints to read.
def user_id(request, user):

    return HttpResponse(user)


@csrf_exempt
def alerts(request, user):
    # Get user who is making the request from users table.
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        # If request is a GET operation get requesters alerts and order them by create date.
        data = list(Alerts.objects.filter(
            user=u).order_by('-created_date').values())

        # Send data in json format to frontend.
        return JsonResponse({"user_alerts": data})
    if request.method == 'DELETE':
        # Find all alerts that belong to requester.
        d = Alerts.objects.filter(user=u)
        # Delete all alerts that belong to requester
        d.delete()
        # Send http response validating if the alerts have been deleted.
        return HttpResponse("All alerts have been deleted")


@csrf_exempt
def completed_tasks(request, user):
    # Get user who is making the request from users table.
    u = User.objects.get(pk=user)
    if request.method == "PUT":
        # Store json being sent to web server in json_data variabe
        json_data = json.loads(request.body)
        json_key = {}
        # Go through keys and values of the json_data to see what operations need to be performed.
        for key, value in json_data.items():
            json_key = key

        if json_key == 'undo_completed_task_id':
            # If the key is 'undo_completed_task_id' seperate data into its respective variables
            json_data = json_data['undo_completed_task_id']
            task = json_data['task']
            sharing_with = json_data['sharing_with']
            # Get the task being undone and change its completed status to false
            t = Tasks.objects.get(pk=task['task_id'])
            t.task_completed = False
            t.save()
            if sharing_with['user_id']:
                # If the task is being shared with someone else send an alert to the person who is being shared with that the task has been undone
                sharing_with_user = User.objects.get(
                    pk=sharing_with['user_id'])
                a = Alerts(user=sharing_with_user,
                           message=f"{u.user_display_name} undid the completion of \"{task['task_name']}\"", alert_type="Undid")
                a.save()
            return HttpResponse("undo complete successful")
        elif json_key == 'completed_task_id':
            # If the key is 'completed_task_id' seperate json_data into its respective variables
            json_data = json_data['completed_task_id']
            task = json_data['task']
            sharing_with = json_data['sharing_with']
            # Change the task's status that has just been completed to true for 'task_completed'
            t = Tasks.objects.get(pk=task['task_id'])
            t.task_completed = True
            t.save()
            if sharing_with['user_id']:
                # If the task is being shared with another user then we need to send a alert to the other user notifying them
                # that the task has been changed to completed status.
                sharing_with_user = User.objects.get(
                    pk=sharing_with['user_id'])
                a = Alerts(user=sharing_with_user,
                           message=f"{u.user_display_name} completed \"{task['task_name']}\"", alert_type="Completed")
                a.save()
            return HttpResponse("marked complete successful")
    elif request.method == 'DELETE':
        json_data = json.loads(request.body)

        if type(json_data) == list:
            # If the json_data is a list object then we must ierate through the list and delete each task from the list.

            for task in json_data:
                t = Tasks.objects.get(pk=task['task']['task_id'])
                if task['sharing_with']['user_id']:
                    # If the task is being shared with another user send an alert to that user that the task has been deleted.
                    sharing_with_user = User.objects.get(
                        pk=task['sharing_with']['user_id'])
                    a = Alerts(
                        user=sharing_with_user, message=f"{u.user_display_name} deleted \"{task['task']['task_name']}\"", alert_type="Deleted")
                    a.save()
                t.delete()

            return HttpResponse("completed tasks deleted")
        else:
            # If the object type of the json data is not a list then do one delete.
            task = json_data['task']
            sharing_with = json_data['sharing_with']
            t = Tasks.objects.get(pk=task['task_id'])
            t.delete()
            if sharing_with['user_id']:
                # If the task is being shared with another user send an alert to that user that the task has been deleted.
                sharing_with_user = User.objects.get(
                    pk=sharing_with['user_id'])
                a = Alerts(user=sharing_with_user,
                           message=f"{u.user_display_name} deleted \"{task['task_name']}\"", alert_type="Deleted")
                a.save()
            return HttpResponse("completed task deleted")


@csrf_exempt
def tasks(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        # We make 2 empty lists; one for incompleted tasks that the user is not sharing and
        # another list for completed tasks that the user is not sharing.
        no_sharing_incompleted_data = []
        no_sharing_completed_data = []
        # We specify to the frontend client that these tasks are not being shared with by making a dictionary with 3 key/value pairs.
        # We set these 3 key/value pairs to None.
        sharing_with = {'user_id': None,
                        'user_display_name': None, 'user_email': None}
        # Get all requester's tasks that are not shared and are not completed.
        incompleted = list(Tasks.objects.filter(
            user=u, task_completed=False, sharedtasks=None).order_by('task_priority').values())
        # Iterate through their incompleted non-shared tasks.
        for task in incompleted:
            # Append 2 key value pairs in one dictionary.
            # Task key with the task's data and sharing_with key with the sharing_with dictionary we made above: sharing_with = {'user_id': None,
            # 'user_display_name': None, 'user_email': None}.
            no_sharing_incompleted_data.append(
                {"task": task, 'sharing_with': sharing_with})
        # Get all requester's tasks that are not shared and are not completed.
        completed = list(Tasks.objects.filter(
            user=u, task_completed=True, sharedtasks=None).order_by('task_priority').values())
        # Iterate through their completed non-shared tasks.
        for task in completed:
            # Append 2 key value pairs in one dictionary.
            # Task key with the task's data and sharing_with key with the sharing_with dictionary we made above: sharing_with = {'user_id': None,
            # 'user_display_name': None, 'user_email': None}.
            no_sharing_completed_data.append(
                {"task": task, 'sharing_with': sharing_with})
        # Seperating completed and incompleted received tasks into 2 seperate lists.
        completed_received_data = []
        incompleted_received_data = []
        # Get all tasks for requester that have been received from other users.
        received_shared_tasks = SharedTasks.objects.filter(recipient=u)
        # Iterate through all the received shared tasks.
        for task in received_shared_tasks:
            # Store task info for task currently being iterated through in task_info variable.
            task_data = list(Tasks.objects.filter(pk=task.task_id).values())
            # If the task is incompleted do this.
            if task_data[0]["task_completed"] == False:
                sent_from = list(User.objects.filter(user_id=task.sender_id).values(
                    "user_email", "user_display_name", "user_id"))

                task_and_sender_list = task_data + sent_from
                task_and_sender_dict = {
                    "task": task_and_sender_list[0], "sharing_with": task_and_sender_list[1]}
                incompleted_received_data.append(task_and_sender_dict)
            # If task is completed do this.
            else:
                sent_from = list(User.objects.filter(user_id=task.sender_id).values(
                    "user_email", "user_display_name", "user_id"))

                merged_data = task_info + sent_from
                json_friendly = {
                    "task": merged_data[0], "sharing_with": merged_data[1]}
                completed_received_data.append(json_friendly)
        # Repeat above operations but this time its on the tasks that the requester has sent.
        completed_sent_data = []
        incompleted_sent_data = []
        sent_shared_tasks = SharedTasks.objects.filter(sender=u)
        for task in sent_shared_tasks:
            task_info = list(Tasks.objects.filter(pk=task.task_id).values())
            if task_info[0]["task_completed"] == False:
                received_from = list(User.objects.filter(user_id=task.recipient_id).values(
                    "user_email", "user_display_name", "user_id"))

                merged_data = task_info + received_from
                json_friendly = {
                    "task": merged_data[0], "sharing_with": merged_data[1]}
                incompleted_sent_data.append(json_friendly)
            else:
                received_from = list(User.objects.filter(user_id=task.recipient_id).values(
                    "user_email", "user_display_name", "user_id"))

                merged_data = task_info + received_from
                json_friendly = {
                    "task": merged_data[0], "sharing_with": merged_data[1]}
                completed_sent_data.append(json_friendly)
        # Take all completed tasks lists and extend them on to eachother.
        completed_data = completed_received_data + \
            completed_sent_data + no_sharing_completed_data
        # Take all incompleted tasks list and extend them on to eachother.
        incompleted_data = incompleted_received_data + \
            incompleted_sent_data + no_sharing_incompleted_data
        # Send a json to frontend client with 2 key/value pairs. This json has all the requesters tasks seperated
        # by sent, received, and solo.
        return JsonResponse({"complete": completed_data, "incomplete": incompleted_data})

    if request.method == 'DELETE':
        json_data = json.loads(request.body)
        # Seperate json_data into its respective variables.
        task = json_data['task']
        sharing_with = json_data['sharing_with']
        # Get the task that requester wants deleted then delete.
        t = Tasks.objects.get(pk=task['task_id'])
        t.delete()
        if sharing_with['user_id']:
            # If the task is being shared send an alert to the other user that the task has been deleted.
            sharing_with_user = User.objects.get(pk=sharing_with['user_id'])
            a = Alerts(user=sharing_with_user,
                       message=f"{u.user_display_name} deleted \"{task['task_name']}\"", alert_type="Deleted")
            a.save()
        return HttpResponse("nice")

        return HttpResponse(f"{user} tasks deleted")
    if request.method == 'POST':
        json_data = json.loads(request.body)
        sharing_with = json_data["sharing_with"]
        task = json_data['task']
        # If sharing_with is not None then that means requester is sharing this new task with another user.
        if sharing_with['user_id']:
            # Get the recipient user data.
            recipient = User.objects.get(pk=sharing_with['user_id'])
            # Task datetime must be in the correct format for database to read.
            d = datetime.datetime.strptime(
                task["task_date_time"], '%d. %B %Y %H:%M')
            # Create task in database with json_data.
            task_created = Tasks(task_id=task['task_id'], user=u, task_name=task['task_name'], task_description=task['task_description'],
                                 task_drawing=task['task_drawing'], task_date_time=d, task_priority=task['task_priority'])
            task_created.save()
            # Task must be created in ShareTasks table to establish that the task is being shared.
            shared_task_created = SharedTasks(
                sender=u, recipient=recipient, task=task_created)
            shared_task_created.save()
            # Send alert notification to recipient that they have a new shared task.
            a = Alerts(
                user=recipient, message=f"{u.user_display_name} shared \"{task['task_name']}\"", alert_type="Shared")
            a.save()
            return HttpResponse("shared task created")
        # If sharing_with['user_id'] is None then this is a solo task.
        else:
            try:
                d = datetime.datetime.strptime(
                    task["task_date_time"], '%d. %B %Y %H:%M')

                t = Tasks(task_id=task['task_id'], user=u, task_name=task['task_name'], task_description=task['task_description'],
                          task_drawing=task['task_drawing'], task_date_time=d, task_priority=task['task_priority'])
                t.save()
                return HttpResponse(f"{user} tasks saved")
            except:
                return HttpResponseError("Invalid input format")

    if request.method == 'PUT':
        json_data = json.loads(request.body)
        task = json_data['task']
        sharing_with = json_data['sharing_with']
        # This is the task being updated before we change it.
        task_before_change = Tasks.objects.get(pk=task['task_id'])
        # Make sure we store who the task was created by initially.
        task_belongs_to = User.objects.get(pk=task['user_id'])
        d = datetime.datetime.strptime(
            task["task_date_time"], '%d. %B %Y %H:%M')
        # Change the task based off json_data.
        t = Tasks(pk=task['task_id'], user=task_belongs_to, task_name=task['task_name'], task_priority=task['task_priority'],
                  task_drawing=task['task_drawing'], task_description=task['task_description'], task_date_time=d)
        t.save()
        # If sharing_with['user_id'] is not None do this.
        if sharing_with['user_id']:
            # We make an alert message based off booleans for what has been changed in the task.
            # We also tell the other user that is not changing the task what is being changed with a detailed
            # alert notification based on alert_message.
            alert_message = [
                f"\n{u.user_display_name} changed \"{task_before_change.task_name}\":\n", ]
            task_name_changed = False
            task_date_time_changed = False
            task_description_changed = False
            task_drawing_changed = False
            task_priority_changed = False
            if task_before_change.task_name != t.task_name:
                task_name_changed = True
            if task_before_change.task_date_time != t.task_date_time:
                task_date_time_changed = True
            if task_before_change.task_description != t.task_description:
                task_description_changed = True
            if task_before_change.task_drawing != t.task_drawing:
                task_drawing_changed = True
            if task_before_change.task_priority != t.task_priority:
                task_priority_changed = True
            sharing_with_user = User.objects.get(pk=sharing_with['user_id'])
            if task_name_changed:
                alert_message.append(
                    f"\nName changed from \"{task_before_change.task_name}\" to \"{t.task_name}\".\n")
            if task_date_time_changed:
                alert_message.append(
                    f"\nDate/time changed from \"{datetime.datetime.strftime(task_before_change.task_date_time, '%B %d %Y %I:%M %p')}\" to \"{datetime.datetime.strftime(t.task_date_time, '%B %d %Y %I:%M %p')}\".\n")
            if task_description_changed:
                alert_message.append(
                    f"\nDescription changed from \"{task_before_change.task_description}\" to \"{t.task_description}\".\n")
            if task_drawing_changed:
                alert_message.append(f"\nDrawing changed.\n")
            if task_priority_changed:
                task_priority_values = {
                    "A": "High", "B": "Above Normal", "C": "Normal", "D": "Below Normal", "F": "Low"}
                alert_message.append(
                    f"\nPriority changed from \"{task_priority_values[task_before_change.task_priority]}\" to \"{task_priority_values[t.task_priority]}\".\n")
            alert_message = ''.join(alert_message)
            a = Alerts(user=sharing_with_user,
                       message=alert_message, alert_type="Editted")
            a.save()
        return HttpResponse("nice")


@csrf_exempt
def users(request, user):
    if request.method == 'GET':
        # Get all users email, display name, and user id.
        safe_user_query = User.objects.exclude(user_id=user).values(
            "user_email", "user_display_name", "user_id")
        safe_user_data = list(safe_user_query)
        return JsonResponse({'all_users': safe_user_data})


@csrf_exempt
def log_in(request):
    if request.method == "POST":
        json_data = json.loads(request.body)
        # If this their password and username do not match then return a HttpResponseServerError to frontend client.
        # Otherwise send the user's id and display name.
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
    elif request.method == "GET":
        # Guest log-in
        guest_salt = uuid.uuid4()
        guest_hashed_password = uuid.uuid4()
        # Create a random guest id number and password.
        guest_id_number = random.randrange(1000, 9999)
        u = User(user_hash=guest_hashed_password, user_salt=guest_salt,
                 user_display_name=f"Guest{guest_id_number}", user_email=f"Guest{guest_id_number}@gmail.com", user_registered=True)
        u.save()
        # Get app creator's user info.
        host = User.objects.get(pk=2)
        # Create friendship between guest and creator.
        Friend.objects.add_friend(host, u)
        friend_request = FriendshipRequest.objects.get(
            from_user=host, to_user=u)
        friend_request.accept()
        # Make a new id for the welcome task to prevent collision.
        new_id = uuid.uuid4()
        # Get the welcome task.
        welcome_task = Tasks.objects.get(
            pk="8e077573-817a-47fa-9be2-7e1020d4307a")
        # Welcome task created with new id.
        welcome_task_with_new_id = Tasks(task_id=new_id, user=host, task_name=welcome_task.task_name, task_description=welcome_task.task_description,
                                         task_drawing=welcome_task.task_drawing, task_date_time=welcome_task.task_date_time, task_priority=welcome_task.task_priority)
        welcome_task_with_new_id.save()
        # Add shared connection to SharedTasks table.
        shared_task_created = SharedTasks(
            sender=host, recipient=u, task=welcome_task_with_new_id)
        shared_task_created.save()
        # Add alert to guest alerts notifying them that a task has been shared with them.
        a = Alerts(
            user=u, message=f"{host.user_display_name} shared \"{welcome_task_with_new_id.task_name}\"", alert_type="Shared")
        a.save()
        return JsonResponse({"user_id": u.user_id, "user_display_name": u.user_display_name})


@csrf_exempt
def register(request):

    if request.method == "POST" or request.method == "OPTIONS":
        json_data = json.loads(request.body)
        # To see if they are using the correct email format.
        try:
            validate_email(json_data['email'])
        except:
            return HttpResponseServerError("Invalid email format")

        try:
            # To see if they are trying to register a display name or email that already exists.
            try:
                if User.objects.get(user_email=json_data['email']).user_registered:
                    return HttpResponseServerError("Email already registered")

            except:
                if User.objects.get(user_display_name=json_data['name']).user_registered:
                    return HttpResponseServerError("Display name taken")
        except:
            # If they make it to this exception then hash their password, create a new user with their json_data

            salt = uuid.uuid4().hex
            hashed_password = hashlib.sha512(json_data['password'].encode(
                'utf-8') + salt.encode('utf-8')).hexdigest()
            u = User(user_hash=hashed_password, user_salt=salt,
                     user_display_name=json_data['name'], user_email=json_data['email'], user_registered=True)
            u.save()
            # Get creator of app's user data.
            host = User.objects.get(pk=2)
            # Create friendship between creator and new user.
            Friend.objects.add_friend(host, u)

            friend_request = FriendshipRequest.objects.get(
                from_user=host, to_user=u)
            friend_request.accept()
            # Send welcome task with newly created id for the welcome task to avoid collision.
            new_id = uuid.uuid4()

            welcome_task = Tasks.objects.get(
                pk="8e077573-817a-47fa-9be2-7e1020d4307a")
            welcome_task_with_new_id = Tasks(task_id=new_id, user=host, task_name=welcome_task.task_name, task_description=welcome_task.task_description,
                                             task_drawing=welcome_task.task_drawing, task_date_time=welcome_task.task_date_time, task_priority=welcome_task.task_priority)
            welcome_task_with_new_id.save()
            # Add task to SharedTasks table to establish shared connection.
            shared_task_created = SharedTasks(
                sender=host, recipient=u, task=welcome_task_with_new_id)
            shared_task_created.save()
            # Create alert for new user notifying them that the welcome task has been shared.
            a = Alerts(
                user=u, message=f"{host.user_display_name} shared \"{welcome_task_with_new_id.task_name}\"", alert_type="Shared")
            a.save()
            # Send new user id and display name to frontend client.
            return JsonResponse({"user_id": u.user_id, "user_display_name": u.user_display_name})


# def index(request):
#     return HttpResponse("Hello, world. You're at the polls index.")

# This tells Django that index.html located in our build/static folder at the time of deployment, is our frontend template.
index = never_cache(TemplateView.as_view(template_name='index.html'))

# Friend list operations.
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
        for user_friend in user_friend_requests:
            data.append({"user_display_name": user_friend.from_user.user_display_name,
                        "user_id": user_friend.from_user.user_id, "user_email": user_friend.from_user.user_email})
        return JsonResponse({"user_friend_requests": data})


@csrf_exempt
def list_sent_friend_requests(request, user):
    u = User.objects.get(pk=user)
    if request.method == 'GET':
        data = []
        user_sent_friend_requests = Friend.objects.sent_requests(user=u)
        for friend_request in user_sent_friend_requests:
            data.append({"user_display_name": friend_request.to_user.user_display_name,
                        "user_id": friend_request.to_user.user_id, "user_email": friend_request.to_user.user_email})
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
