from django.db import models
from uuid import uuid4


class BaseTreeModel(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseDocument(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    docstatus = models.CharField(
        max_length=50,
        default=1,
        choices=[(1, "Draft"), (2, "Submitted"), (3, "Canceled")],
    )

    naming_series = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        if self.docstatus == 1:
            raise ValueError("Cannot delete a submitted document.")

        return super().delete(self, *args, **kwargs)

    def on_submit(self):
        self.docstatus = 1
        self.save()


class BaseModel(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
