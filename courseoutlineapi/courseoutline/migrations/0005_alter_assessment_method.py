# Generated by Django 4.2.11 on 2024-05-28 14:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courseoutline', '0004_rename_name_assessment_method'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='method',
            field=models.CharField(max_length=50),
        ),
    ]