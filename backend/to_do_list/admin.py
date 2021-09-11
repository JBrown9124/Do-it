from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Tasks)

admin.site.register(SharedTasks)
# admin.site.register(Status)
# admin.site.register(FriendsStatus)
# admin.site.register(Friends)