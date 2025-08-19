from django.db import models
from django.contrib.auth import get_user_model
from .base import BaseModel


class Role(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class UserRole(BaseModel):
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="user_roles"
    )
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="user_roles")

    def __str__(self):
        return f"{self.user.email} - {self.role.name}"


class RolePolicy(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="policies")
    condition = models.TextField(
        help_text="Python expression using user, resource, and env dicts."
    )
    action = models.CharField(max_length=50)


