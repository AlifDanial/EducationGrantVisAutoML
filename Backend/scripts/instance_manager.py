import os
import psycopg2
from datetime import datetime, timedelta
import logging
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections
import psutil

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class InstanceManager:
    def __init__(self):
        self.db_params = settings.DATABASES['default']
        self.max_inactive_days = 30  # Maximum days of inactivity before cleanup
        self.max_db_size_mb = 1000  # Maximum database size in MB
        self.max_storage_mb = 2000  # Maximum storage size in MB per instance
        
    def connect_to_db(self):
        """Connect to the PostgreSQL database."""
        return psycopg2.connect(
            dbname=self.db_params['NAME'],
            user=self.db_params['USER'],
            password=self.db_params['PASSWORD'],
            host=self.db_params['HOST'],
            port=self.db_params['PORT']
        )

    def get_instance_databases(self):
        """Get all instance-specific databases."""
        conn = self.connect_to_db()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT datname FROM pg_database 
                    WHERE datname LIKE 'instance_%'
                """)
                return [row[0] for row in cursor.fetchall()]
        finally:
            conn.close()

    def get_last_activity(self, db_name):
        """Get the last activity timestamp for a database."""
        conn = psycopg2.connect(
            **self.db_params,
            dbname=db_name
        )
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT MAX(updated_at) 
                    FROM (
                        SELECT MAX(updated_at) as updated_at FROM machine_learning_model
                        UNION ALL
                        SELECT MAX(updated_at) FROM machine_learning_modeldescription
                    ) as last_updates
                """)
                return cursor.fetchone()[0]
        finally:
            conn.close()

    def get_database_size(self, db_name):
        """Get the size of a database in MB."""
        conn = self.connect_to_db()
        try:
            with conn.cursor() as cursor:
                cursor.execute(f"""
                    SELECT pg_database_size('{db_name}') / 1024.0 / 1024.0
                """)
                return cursor.fetchone()[0]
        finally:
            conn.close()

    def get_storage_usage(self, instance_id):
        """Get storage usage for an instance in MB."""
        media_path = os.path.join(settings.MEDIA_ROOT, f'instance_{instance_id}')
        if os.path.exists(media_path):
            total_size = sum(
                os.path.getsize(os.path.join(dirpath, filename))
                for dirpath, _, filenames in os.walk(media_path)
                for filename in filenames
            )
            return total_size / 1024 / 1024
        return 0

    def cleanup_inactive_instances(self):
        """Clean up inactive instances and their resources."""
        logger.info("Starting instance cleanup...")
        
        for db_name in self.get_instance_databases():
            try:
                # Get instance ID from database name
                instance_id = db_name.replace('instance_', '')
                
                # Check last activity
                last_activity = self.get_last_activity(db_name)
                if last_activity and datetime.now() - last_activity > timedelta(days=self.max_inactive_days):
                    logger.info(f"Cleaning up inactive instance: {instance_id}")
                    self.cleanup_instance(instance_id)
                    continue

                # Check resource limits
                db_size = self.get_database_size(db_name)
                storage_usage = self.get_storage_usage(instance_id)

                if db_size > self.max_db_size_mb:
                    logger.warning(f"Instance {instance_id} exceeds database size limit")
                    # Implement notification system here

                if storage_usage > self.max_storage_mb:
                    logger.warning(f"Instance {instance_id} exceeds storage limit")
                    # Implement notification system here

            except Exception as e:
                logger.error(f"Error processing instance {db_name}: {str(e)}")

    def cleanup_instance(self, instance_id):
        """Clean up a specific instance and its resources."""
        conn = self.connect_to_db()
        db_name = f'instance_{instance_id}'
        
        try:
            # Disconnect all users
            with conn.cursor() as cursor:
                cursor.execute(f"""
                    SELECT pg_terminate_backend(pid)
                    FROM pg_stat_activity
                    WHERE datname = '{db_name}'
                """)
                
                # Drop the database
                conn.autocommit = True
                cursor.execute(f'DROP DATABASE IF EXISTS "{db_name}"')
                
            # Clean up media files
            media_path = os.path.join(settings.MEDIA_ROOT, f'instance_{instance_id}')
            if os.path.exists(media_path):
                for root, dirs, files in os.walk(media_path, topdown=False):
                    for name in files:
                        os.remove(os.path.join(root, name))
                    for name in dirs:
                        os.rmdir(os.path.join(root, name))
                os.rmdir(media_path)
                
            logger.info(f"Successfully cleaned up instance {instance_id}")
            
        except Exception as e:
            logger.error(f"Error cleaning up instance {instance_id}: {str(e)}")
        finally:
            conn.close()

class Command(BaseCommand):
    help = 'Manage instances, cleanup inactive ones, and monitor resource usage'

    def handle(self, *args, **options):
        manager = InstanceManager()
        manager.cleanup_inactive_instances() 