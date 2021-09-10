from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.index, name='index'),
    path('<int:user>/', views.user_id),
    
    path('register/', views.register),
    path('log-in/', views.log_in),
    
    path('<int:user>/tasks', views.tasks),
    
    path('users/', views.users),
    
    path('<int:user>/completed-tasks', views.completed_tasks),
   
    
]