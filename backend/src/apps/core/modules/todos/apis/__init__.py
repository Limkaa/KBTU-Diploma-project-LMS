from django.urls import path

from .todos import *


urlpatterns = [
    path('todos', TodoListCreateAPI.as_view(), name='todos-list' ),
    path('todos/<int:pk>', TodoDetailAPI.as_view(), name='todo-detail')
]