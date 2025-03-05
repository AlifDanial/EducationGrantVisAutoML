from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta

model_types = [
    ("RG", "Regression"),
    ("CL", "Classification")
]


class Model(models.Model):
    model_name = models.CharField(max_length=100, blank=False, null=False)
    model_type = models.CharField(max_length=2, choices=model_types)
    algorithm_name = models.CharField(max_length=100, blank=True, null=True)
    overall_score = models.DecimalField(
        blank=True, null=True, decimal_places=1, max_digits=4)
    data_set = models.FileField(upload_to="datasets/")
    session = models.ForeignKey('UserSession', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.model_name


class ModelDescription(models.Model):
    model = models.OneToOneField(Model, on_delete=models.CASCADE)
    description = models.JSONField()


class UserSession(models.Model):
    """
    Model to track user sessions for data isolation.
    Each user gets a unique session ID that is used to isolate their data.
    Sessions expire after 24 hours of inactivity.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(auto_now=True)
    
    @classmethod
    def cleanup_old_sessions(cls):
        """
        Delete sessions older than 24 hours to clean up temporary data.
        This should be run periodically via a scheduled task.
        """
        threshold = timezone.now() - timedelta(hours=24)
        cls.objects.filter(last_accessed__lt=threshold).delete()
    
    def __str__(self):
        return f"Session {self.id} - Created: {self.created_at}"
