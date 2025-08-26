from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from .base import BaseModel
from django.contrib.contenttypes.models import ContentType


class PolicyAction(models.TextChoices):
    READ = "read", "Read"
    CREATE = "create", "Create"
    UPDATE = "update", "Update"
    DELETE = "delete", "Delete"
    EXECUTE = "execute", "Execute"


class Policy(BaseModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    resource = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, related_name="policy_resources"
    )
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="user_policies"
    )
    condition = models.TextField(
        help_text="Python expression using user, resource, and env dicts. "
        "Example: user.get('role') == 'admin' and resource.get('department') == user.get('department')",
        # validators=[validate_policy_condition],
    )
    resource = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="policy_resources",
        help_text="The resource type this policy applies to",
    )
    is_active = models.BooleanField(
        default=True, help_text="Whether this policy is currently active"
    )
    action = models.CharField(
        max_length=50,
        choices=PolicyAction.choices,
        help_text="The action this policy governs",
    )

    def to_queryset_filter() -> Q:
        return

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()

    def __str__(self):
        return f"{self.name} ({self.action} on {self.resource.model})"

    def __repr__(self):
        return f"<Policy: {self.name} - {self.action} on {self.resource.model}>"
