import re
from uuid import uuid4
from datetime import datetime
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )

    class Meta:
        abstract = True


class DocumentStatus(models.TextChoices):
    DRAFT = 0, "Draft"
    SUBMITTED = 1, "Submitted"
    CANCELLED = 2, "Cancelled"
    ARCHIVED = 3, "Archived"
    # ON_HOLD = 4, "On Hold"


class BaseDocument(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )
    naming_series = models.CharField(
        max_length=100, help_text="Series prefix for document numbering"
    )
    document_no = models.CharField(
        max_length=100, unique=True, blank=True, null=True, editable=False
    )

    docstatus = models.IntegerField(
        default=DocumentStatus.DRAFT, choices=DocumentStatus.choices
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_on = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="created_documents",
    )
    updated_by = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="updated_documents",
    )

    class Meta:
        abstract = True
        ordering = ["-created_at"]
        naming_series = "DOC-{YY}-{MM}-{N:6}"

    def generate_document_no(self):
        """Generate document number - implemented in previous artifact"""
        if self.document_no:
            return self.document_no

        pattern = (
            self.naming_series
            if self.naming_series
            else getattr(self._meta, "naming_series", "DOC-{N:6}")
        )

        today = datetime.now()
        existing_count = self.__class__.objects.filter(
            document_no__isnull=False
        ).count()
        next_number = existing_count + 1

        naming_pattern = {
            "{YYYY}": today.strftime("%Y"),
            "{YY}": today.strftime("%y"),
            "{MM}": today.strftime("%m"),
            "{DD}": today.strftime("%d"),
            "{WW}": today.strftime("%U"),
        }

        n_pattern = re.search(r"\{N:(\d+)\}", pattern)
        if n_pattern:
            digits = int(n_pattern.group(1))
            naming_pattern[f"{{N:{digits}}}"] = str(next_number).zfill(digits)

        name = pattern
        for key, value in naming_pattern.items():
            name = name.replace(key, value)

        self.document_no = name
        return name

    def _validate_status_transition(self, old_status, new_status):
        """Validate status transitions based on business rules"""
        # Define allowed transitions
        allowed_transitions = {
            DocumentStatus.DRAFT: [
                DocumentStatus.SUBMITTED,
                DocumentStatus.CANCELLED,
                DocumentStatus.ARCHIVED,
            ],
            DocumentStatus.SUBMITTED: [
                DocumentStatus.CANCELLED,
            ],
            DocumentStatus.ARCHIVED: [DocumentStatus.DRAFT, DocumentStatus.CANCELLED],
            # Add more transitions as needed
        }

        if old_status != new_status:
            valid_transitions = allowed_transitions.get(old_status, [])
            if new_status not in valid_transitions:
                raise ValidationError(
                    f"Invalid status transition from {DocumentStatus(old_status).label} "
                    f"to {DocumentStatus(new_status).label}"
                )

    @property
    def is_editable(self):
        """Check if document can be edited based on status"""
        return self.docstatus in [DocumentStatus.DRAFT]

    def submit(self, user=None):
        can_submit, message = self.can_submit(user)

        if not can_submit:
            raise ValidationError(message)

        # self.submitted_by = user
        # self.submitted_on = datetime.now()
        self.docstatus = DocumentStatus.SUBMITTED
        self.save()

    def can_cancel(self, user=None):
        """Check if document can be cancelled"""
        if self.docstatus in [DocumentStatus.CANCELLED, DocumentStatus.ARCHIVED]:
            return False, "Document cannot be cancelled"

        return True, "Can cancel"

    def cancel(self, user=None):
        """Cancel the document"""
        can_cancel, message = self.can_cancel(user)
        if not can_cancel:
            raise ValidationError(message)

        self.docstatus = DocumentStatus.CANCELLED
        self.cancelled_by = user
        self.cancelled_on = datetime.now()
        self.save()

    def can_submit(self, user=None):
        """Check if document can be submitted"""

        # if not self.is_submittable:
        #     return False, "Document is not submittable"

        if self.docstatus != DocumentStatus.DRAFT:
            return False, "Only draft documents can be submitted"

        return True, "Can submit"

    def save(self, *args, **kwargs):
        if not self.document_no:
            self.document_no = self.generate_document_no()

        if self.id:
            old_instance = self.__class__.objects.get(pk=self.pk)
            self._validate_status_transition(old_instance.docstatus, self.docstatus)

        super().save(*args, **kwargs)
