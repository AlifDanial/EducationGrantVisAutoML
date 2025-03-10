from setuptools import setup, find_packages

setup(
    name="visautoml",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "django>=4.0.3,<4.1.0",
        "djangorestframework>=3.13.0,<4.0.0",
        "django-cors-headers>=3.11.0,<4.0.0",
        "whitenoise>=6.0.0,<7.0.0",
        "gunicorn>=20.1.0,<21.0.0",
        "psycopg2-binary>=2.9.3,<3.0.0",
        "django-extensions>=3.1.5,<4.0.0",
        "dj-database-url>=0.5.0,<1.0.0",
        "numpy==1.21.0",
        "pandas==1.3.0",
        "scikit-learn==1.1.0",
        "lightgbm==3.3.2",
        "xgboost==1.6.1",
        "dash==2.3.1",
        "dash-auth==1.4.1",
        "dash-bootstrap-components==1.0.0",
        "joblib==1.1.0",
        "python-dotenv>=0.19.0",
    ],
    python_requires=">=3.9,<3.10",
) 