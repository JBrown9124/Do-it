from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Users)
admin.site.register(Tasks)

admin.site.register(SharedTasks)
admin.site.register(MyStatus)
admin.site.register(FriendshipStatus)
admin.site.register(Friendship)