from django.db import models
from django.contrib.auth import get_user_model
from .base import BaseModel


class Role(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name

