from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    ROLE_CHOICES = (
        ('lecturer', 'Giảng Viên'),
        ('student', 'Sinh Viên')
    )

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


class Assessment(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    weight = models.DecimalField(max_digits=3, decimal_places=2,
                                 validators=[MinValueValidator(10), MaxValueValidator(100)])
    description = RichTextField()

    def __str__(self):
        return self.name


class Outline(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    content = RichTextField()
    credit = models.PositiveSmallIntegerField()
    assessments = models.ManyToManyField(Assessment)
    resource = RichTextField()
    lecturer = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Course(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class Comment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    outline = models.ForeignKey(Outline, on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
