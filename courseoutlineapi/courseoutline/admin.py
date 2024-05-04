from django.contrib import admin
from courseoutline.models import Course, Outline, Category, User, Assessment
from django.db.models import Count
from django import forms
from django.urls import path
from django.template.response import TemplateResponse


class CustomAdmin(admin.AdminSite):
    site_header = 'Course Outline Administrator'

    def index(self, request, extra_context=None):
        stats = Category.objects.annotate(counter=Count('course__id')).values('id', 'name', 'counter')
        return super(CustomAdmin, self).index(request, extra_context={
            'stats': stats
        })


admin.site = CustomAdmin()


class UserForm(forms.ModelForm):
    class Meta:
        models = User
        fields = ['username', 'password', 'fullname', 'email', 'role', 'is_staff', 'is_active']


class UserAdmin(admin.ModelAdmin):
    form = UserForm
    list_display = ['id', 'username', 'fullname', 'email', 'role', 'is_active']
    list_filter = ['id', 'username']

    def approve(self, request, queryset):
        queryset.update(is_active=True)

    def deny(self, request, queryset):
        queryset.update(is_active=False)

    approve.short_description = 'Chấp thuận'
    deny.short_description = 'Từ chối'

    actions = [approve, deny]


class CourseAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'delivery_mode', 'term']


admin.site.register(Category)
admin.site.register(Course, CourseAdmin)
admin.site.register(User, UserAdmin)
