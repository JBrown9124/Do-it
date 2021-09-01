from django.urls import path
from . import views

urlpatterns = [
    
    path('', views.index, name='index'),
    path('<int:user>/', views.user_id),
    path('<int:user>/tasks', views.get_tasks_by_user),
    path('register/', views.register),
    path('log-in/', views.log_in),
    path('<int:user>/task',views.task),
    
    path('<int:user>/get-task-by-id', views.get_task_by_task_id),
    
    path('<int:user>/task-by-name', views.order_tasks_by_name),
    path('<int:user>/task-by-date', views.order_tasks_by_date),
    path('<int:user>/completed-tasks', views.completed_tasks),
    
]