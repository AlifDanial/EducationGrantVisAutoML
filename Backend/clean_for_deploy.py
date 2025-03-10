#!/usr/bin/env python
"""
Script to clean up large files before deployment to Heroku.
Run this script before pushing to Heroku to reduce slug size.
"""

import os
import shutil
import glob

# Directories to clean
DIRS_TO_CLEAN = [
    'img',
    'VisAutoML/img',
    'machine_learning/static/frontend/datasets',
    'database',
]

# File patterns to remove
FILE_PATTERNS = [
    '*.joblib',
    '*.yaml',
    '*.csv',
    '*.png',
    '*.gif',
    '*.webp',
    '*.jpg',
    '*.jpeg',
    '*.pdf',
    '*.zip',
    '*.tar.gz',
    '*.pkl',
    '*.h5',
    '*.model',
    '*.weights',
    'machine_learning/static/frontend/js/main.*.js.map',
    'machine_learning/static/frontend/css/main.*.css.map',
]

def clean_directory(directory):
    """Clean a directory by removing all files but keeping the directory structure."""
    if os.path.exists(directory):
        print(f"Cleaning directory: {directory}")
        for item in os.listdir(directory):
            item_path = os.path.join(directory, item)
            if os.path.isfile(item_path):
                os.remove(item_path)
                print(f"  Removed file: {item_path}")
            elif os.path.isdir(item_path):
                clean_directory(item_path)
    else:
        print(f"Directory does not exist: {directory}")

def remove_files_by_pattern(pattern):
    """Remove files matching a glob pattern."""
    for file_path in glob.glob(pattern, recursive=True):
        if os.path.isfile(file_path):
            os.remove(file_path)
            print(f"Removed file: {file_path}")

def main():
    """Main function to clean up the project."""
    print("Starting cleanup for Heroku deployment...")
    
    # Clean directories
    for directory in DIRS_TO_CLEAN:
        clean_directory(directory)
    
    # Remove files by pattern
    for pattern in FILE_PATTERNS:
        remove_files_by_pattern(pattern)
    
    print("Cleanup complete!")

if __name__ == "__main__":
    main() 