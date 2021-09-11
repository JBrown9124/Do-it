from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.index, name='index'),
    path('<int:user>/', views.user_id),
    
    path('register/', views.register),
    path('log-in/', views.log_in),
    
    path('<int:user>/tasks', views.tasks),
    
    path('<int:user>/users', views.users),
    
    path('<int:user>/completed-tasks', views.completed_tasks),
    path('<int:user>/add-friend', views.add_friend),
    path('<int:user>/accept-friend', views.accept_friend),
    path('<int:user>/users-friends', views.list_users_friends),
]