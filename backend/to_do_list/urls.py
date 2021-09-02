from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.index, name='index'),
    path('<int:user>/', views.user_id),
    
    path('register/', views.register),
    path('log-in/', views.log_in),
    path('<int:user>/task',views.task),
    path('<int:user>/tasks', views.tasks),
    path('<int:user>/task-by-id', views.task_by_task_id),
    
    path('<int:user>/task-by-name', views.tasks_by_name),
    path('<int:user>/task-by-date', views.tasks_by_date),
    path('<int:user>/completed-tasks', views.completed_tasks),
    path('<int:user>/completed-task', views.completed_task),
    
]