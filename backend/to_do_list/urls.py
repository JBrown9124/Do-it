from django.urls import path

from . import views

urlpatterns = [
    
    path('', views.index, name='index'),
    path('<int:user>/', views.get_user),
    path('<int:user>/tasks', views.get_tasks_by_user),
    path('register/', views.register),
    path('log-in/', views.log_in),
    path('<int:user>/add-task',views.add_task),
    path('<int:user>/delete-task', views.delete_task),
    
]