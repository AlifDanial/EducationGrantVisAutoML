import threading
from django.conf import settings
from django.http import HttpResponseBadRequest

# Thread-local storage for instance ID
_thread_locals = threading.local()

def get_current_instance_id():
    """Get the current instance ID from thread-local storage."""
    return getattr(_thread_locals, 'instance_id', None)

class InstanceIsolationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Try to get instance ID from header first, then query parameters
        instance_id = request.headers.get(settings.INSTANCE_ID_HEADER) or request.GET.get(settings.INSTANCE_ID_PARAM)

        if not instance_id:
            return HttpResponseBadRequest('Instance ID is required')

        # Store instance ID in thread-local storage
        _thread_locals.instance_id = instance_id

        response = self.get_response(request)

        # Clean up thread-local storage
        del _thread_locals.instance_id

        return response 