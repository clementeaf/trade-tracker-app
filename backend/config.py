import os

# Configuración de S3
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME', 'trade-tracker-assets-20250713-151538-f0d3341a')
S3_REGION = os.getenv('S3_REGION', 'us-east-1')

# Configuración de la API
API_HOST = os.getenv('API_HOST', '0.0.0.0')
API_PORT = int(os.getenv('API_PORT', 8000))
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true' 