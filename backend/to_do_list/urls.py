from django.urls import path
from . import views
from .views import index
urlpatterns = [
    
    path('', index, name='index'),
    path('<int:user>/', views.user_id),
    
    path('register/', views.register),
    path('log-in/', views.log_in),
    
    path('<int:user>/tasks', views.tasks),
    
    path('<int:user>/users', views.users),
    
    path('<int:user>/completed-tasks', views.completed_tasks),
    path('<int:user>/add-friend', views.add_friend),
    path('<int:user>/remove-friend', views.remove_friend),
    path('<int:user>/accept-friend', views.accept_friend),
    path('<int:user>/reject-friend', views.reject_friend),
    path('<int:user>/user-friends', views.list_users_friends),
    path('<int:user>/user-received-friend-requests', views.list_received_friend_requests),
    path('<int:user>/user-sent-friend-requests', views.list_sent_friend_requests),
]