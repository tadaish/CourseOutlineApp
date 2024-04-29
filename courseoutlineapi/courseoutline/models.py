from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    ROLE_CHOICES = (
        ('giảng viên', 'Giảng Viên'),
        ('sinh viên', 'Sinh Viên')
    )

    fullname = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    avatar = CloudinaryField(null=True)

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = 'Quản trị viên'
        super().save(*args, **kwargs)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Category(BaseModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Course(BaseModel):
    MODE_CHOICES = (
        ('ftp', 'Trực tiếp'),
        ('online', 'Trực tuyến'),
        ('blended', 'Kết hợp')
    )
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    delivery_mode = models.CharField(max_length=100, choices=MODE_CHOICES)
    term = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Outline(BaseModel):
    title = models.CharField(max_length=100, unique=True)
    content = RichTextField()
    credit = models.PositiveSmallIntegerField()
    resource = RichTextField()
    lecturer = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Assessment(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    weight = models.DecimalField(max_digits=3, decimal_places=2,
                                 validators=[MinValueValidator(10), MaxValueValidator(100)])
    outcomes = RichTextField()
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Comment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
