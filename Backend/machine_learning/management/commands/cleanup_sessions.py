from django.core.management.base import BaseCommand
from machine_learning.models import UserSession
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Cleans up user sessions older than 24 hours'

    def handle(self, *args, **options):
        # Get the count before cleanup
        before_count = UserSession.objects.count()
        
        # Perform the cleanup
        UserSession.cleanup_old_sessions()
        
        # Get the count after cleanup
        after_count = UserSession.objects.count()
        
        # Calculate how many sessions were deleted
        deleted_count = before_count - after_count
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully cleaned up {deleted_count} expired sessions. {after_count} active sessions remain.'
            )
        )