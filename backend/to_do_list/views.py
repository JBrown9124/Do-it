from django.shortcuts import render

# Create your views here.
def register(request):
    pass

from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")