from .middleware import get_current_instance_id

class InstanceRouter:
    """
    Database router that routes queries to instance-specific databases.
    """
    
    def db_for_read(self, model, **hints):
        """
        Route read operations to the instance-specific database.
        """
        instance_id = get_current_instance_id()
        if instance_id:
            return f'instance_{instance_id}'
        return 'default'

    def db_for_write(self, model, **hints):
        """
        Route write operations to the instance-specific database.
        """
        instance_id = get_current_instance_id()
        if instance_id:
            return f'instance_{instance_id}'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow relations only if both objects are in the same database.
        """
        db1 = self.db_for_write(obj1.__class__)
        db2 = self.db_for_write(obj2.__class__)
        return db1 == db2

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Allow migrations on all databases.
        """
        return True 