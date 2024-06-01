from django.urls import path, include
from rest_framework import routers
from . import views

r = routers.DefaultRouter()
r.register('categories', views.CategoryViewSet, 'categories')
r.register('courses', views.CourseViewSet, 'courses')
r.register('users', views.UserViewSet, 'users')
r.register('outline', views.OutlineViewSet, 'outlines')
r.register('assessments', views.AssessmentViewSet, 'assessments')

urlpatterns = [
    path('', include(r.urls))
]
