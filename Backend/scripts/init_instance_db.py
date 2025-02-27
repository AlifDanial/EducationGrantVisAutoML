import os
import psycopg2
from django.core.management import call_command
from django.db import connections
from django.conf import settings

def create_instance_database(instance_id):
    """
    Create a new database for a specific instance.
    """
    db_params = settings.DATABASES['default']
    
    # Connect to default database
    conn = psycopg2.connect(
        dbname=db_params['NAME'],
        user=db_params['USER'],
        password=db_params['PASSWORD'],
        host=db_params['HOST'],
        port=db_params['PORT']
    )
    conn.autocommit = True
    
    try:
        with conn.cursor() as cursor:
            db_name = f"instance_{instance_id}"
            
            # Check if database exists
            cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
            exists = cursor.fetchone()
            
            if not exists:
                # Create new database
                cursor.execute(f'CREATE DATABASE "{db_name}"')
                print(f"Created database {db_name}")
                
                # Update Django's database configuration
                settings.DATABASES[db_name] = {
                    **db_params,
                    'NAME': db_name,
                }
                
                # Run migrations on new database
                call_command('migrate', database=db_name)
                print(f"Applied migrations to {db_name}")
                
                return True
            else:
                print(f"Database {db_name} already exists")
                return False
                
    finally:
        conn.close()

def initialize_instance(instance_id):
    """
    Initialize a new instance with its database and default data.
    """
    if create_instance_database(instance_id):
        # Add any default data initialization here
        pass
    
    return True 