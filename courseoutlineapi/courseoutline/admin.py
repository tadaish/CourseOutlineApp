from django.contrib import admin
from courseoutline.models import Course, Category, User
from django.db.models import Count
from django import forms


class CustomAdmin(admin.AdminSite):
    site_header = 'Course Outline Administrator'

    def index(self, request, extra_context=None):
        stats = Category.objects.annotate(counter=Count('course__id')).values('id', 'name', 'counter')
        return super(CustomAdmin, self).index(request, extra_context={
            'stats': stats
        })


admin.site = CustomAdmin()


class UserForm(forms.ModelForm):
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.data['password'])
        if commit:
            user.save()
        return user

    class Meta:
        models = User
        fields = ['username', 'password', 'fullname', 'email', 'role', 'avatar', 'is_staff', 'is_active']


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
