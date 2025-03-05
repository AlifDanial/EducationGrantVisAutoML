#!/usr/bin/env python
"""
Script to collect static files for Django deployment.
This is useful for Heroku deployment to ensure static files are collected.
"""
import os
import subprocess

if __name__ == "__main__":
    # Set environment variables for production
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "VisAutoML.settings")
    os.environ.setdefault("DEBUG", "False")
    
    # Run collectstatic command
    subprocess.call(["python", "manage.py", "collectstatic", "--noinput"])
    
    print("Static files collected successfully!")