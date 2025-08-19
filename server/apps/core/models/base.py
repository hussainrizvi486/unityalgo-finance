import re
from uuid import uuid4
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


class DocumentStatusChoices(models.TextChoices):
    DRAFT = 0, "Draft"
    APPROVED = 1, "Approved"
    REJECTED = 2, "Rejected"


class BaseDocument(models.Model):
    id = models.CharField(
        primary_key=True, max_length=255, default=uuid4, editable=False
    )

    docstatus = models.CharField(
        max_length=255,
        default=DocumentStatusChoices.DRAFT,
        choices=DocumentStatusChoices.choices,
    )
    naming_series = models.CharField(
        max_length=100, help_text="Series prefix for document numbering"
    )
    document_number = models.CharField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
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

    def save(self, *args, **kwargs):
        if not self.document_number:
            self.document_number = self.make_id()
        super().save(*args, **kwargs)

    def make_id(self):
        """
        Generate document ID based on naming series.

        Rules:
        - Each Series Prefix on a new line
        - Allowed special characters are "/" and "-"
        - Set digits using dot (.) followed by hashes (#). Default is 5 digits
        - Variables between dots:
          .YYYY. - Year in 4 digits
          .YY. - Year in 2 digits
          .MM. - Month
          .DD. - Day of month
          .WW. - Week of the year
          .FY. - Fiscal Year
          .{fieldname}. - field value from document

        Examples: INV-, INV-10-, INVK-, INV-.YYYY.-.{branch}.-.MM.-.####
        """
        if not self.naming_series:
            raise ValidationError("Naming series is required")

        series = self.naming_series
        now = timezone.now()

        # Replace date variables
        series = series.replace(".YYYY.", str(now.year))
        series = series.replace(".YY.", str(now.year)[2:])
        series = series.replace(".MM.", f"{now.month:02d}")
        series = series.replace(".DD.", f"{now.day:02d}")
        series = series.replace(".WW.", f"{now.isocalendar()[1]:02d}")

        # Calculate fiscal year (assuming fiscal year starts in April)
        fiscal_year = now.year if now.month >= 4 else now.year - 1
        series = series.replace(".FY.", str(fiscal_year))

        # Replace field variables
        field_pattern = r"\.{(\w+)}\."
        matches = re.findall(field_pattern, series)
        for field_name in matches:
            if hasattr(self, field_name):
                field_value = getattr(self, field_name)
                if field_value:
                    series = series.replace(f".{{{field_name}}}.", str(field_value))
                else:
                    series = series.replace(f".{{{field_name}}}.", "")

        # Handle digit formatting
        hash_pattern = r"\.#+$"
        hash_match = re.search(hash_pattern, series)

        if hash_match:
            hash_part = hash_match.group()
            digit_count = len(hash_part) - 1  # subtract 1 for the dot
            prefix = series.replace(hash_part, "")
        else:
            digit_count = 5  # default
            prefix = series

        # Get next sequence number
        sequence_number = self._get_next_sequence_number(prefix)

        # Format with leading zeros
        formatted_number = f"{sequence_number:0{digit_count}d}"

        return f"{prefix}{formatted_number}"

    def _get_next_sequence_number(self, prefix):
        """Get the next sequence number for the given prefix"""
        from django.db import connection

        # Get the model's table name
        table_name = self._meta.db_table

        with connection.cursor() as cursor:
            cursor.execute(
                f"""
                SELECT MAX(CAST(SUBSTRING(document_number, %s) AS UNSIGNED)) 
                FROM {table_name} 
                WHERE document_number LIKE %s
                """,
                [len(prefix) + 1, f"{prefix}%"],
            )
            result = cursor.fetchone()[0]
            return (result or 0) + 1
