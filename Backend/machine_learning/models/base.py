from django.db import models
from VisAutoML.middleware import get_current_instance_id

class BaseModel(models.Model):
    """
    Abstract base model that includes instance isolation.
    """
    instance_id = models.UUIDField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.instance_id:
            self.instance_id = get_current_instance_id()
        super().save(*args, **kwargs)

    @classmethod
    def get_queryset(cls):
        """
        Override get_queryset to automatically filter by instance_id.
        """
        return super().get_queryset().filter(instance_id=get_current_instance_id()) 