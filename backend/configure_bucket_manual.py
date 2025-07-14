#!/usr/bin/env python3
"""
Script para configurar bucket S3 manualmente sin políticas públicas
"""

import boto3
from botocore.exceptions import ClientError
import json

def configure_bucket_manual(bucket_name):
    """
    Configurar bucket S3 manualmente
    """
    try:
        s3_client = boto3.client('s3')
        
        print(f"🔧 Configurando bucket: {bucket_name}")
        
        # Configurar CORS para acceso web
        cors_configuration = {
            'CORSRules': [
                {
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                    'AllowedOrigins': ['*'],
                    'ExposeHeaders': ['ETag', 'Content-Length', 'Content-Type'],
                    'MaxAgeSeconds': 3000
                }
            ]
        }
        
        s3_client.put_bucket_cors(
            Bucket=bucket_name,
            CORSConfiguration=cors_configuration
        )
        
        print(f"✅ Configuración CORS aplicada")
        
        # Configurar versioning para seguridad
        s3_client.put_bucket_versioning(
            Bucket=bucket_name,
            VersioningConfiguration={'Status': 'Enabled'}
        )
        
        print(f"✅ Versioning habilitado")
        
        # Deshabilitar bloqueo de acceso público (necesario para presigned URLs)
        s3_client.put_public_access_block(
            Bucket=bucket_name,
            PublicAccessBlockConfiguration={
                'BlockPublicAcls': False,
                'IgnorePublicAcls': False,
                'BlockPublicPolicy': False,
                'RestrictPublicBuckets': False
            }
        )
        
        print(f"✅ Bloqueo de acceso público deshabilitado")
        
        # Configurar política de bucket (ahora que el bloqueo está deshabilitado)
        bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{bucket_name}/*"
                }
            ]
        }
        
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        
        print(f"✅ Política de bucket aplicada")
        
        return True
        
    except ClientError as e:
        print(f"❌ Error configurando bucket: {e}")
        return False

def test_presigned_urls(bucket_name):
    """
    Probar funcionalidad de presigned URLs
    """
    try:
        s3_client = boto3.client('s3')
        
        print(f"🧪 Probando presigned URLs en bucket: {bucket_name}")
        
        # Probar presigned URL para subir archivo
        test_key = "test-upload.txt"
        test_content = "Contenido de prueba para presigned URL"
        
        # Generar presigned URL para PUT
        put_presigned_url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket_name,
                'Key': test_key,
                'ContentType': 'text/plain'
            },
            ExpiresIn=3600  # 1 hora
        )
        
        print(f"✅ Presigned URL para subir generada")
        print(f"   URL: {put_presigned_url[:50]}...")
        
        # Simular subida usando requests
        import requests
        response = requests.put(put_presigned_url, data=test_content.encode('utf-8'))
        
        if response.status_code == 200:
            print("✅ Archivo subido exitosamente via presigned URL")
        else:
            print(f"❌ Error subiendo archivo: {response.status_code}")
        
        # Generar presigned URL para GET
        get_presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket_name,
                'Key': test_key
            },
            ExpiresIn=3600  # 1 hora
        )
        
        print(f"✅ Presigned URL para descargar generada")
        print(f"   URL: {get_presigned_url[:50]}...")
        
        # Probar descarga
        response = requests.get(get_presigned_url)
        if response.status_code == 200 and response.text == test_content:
            print("✅ Archivo descargado exitosamente via presigned URL")
        else:
            print(f"❌ Error descargando archivo: {response.status_code}")
        
        # Limpiar archivo de prueba
        s3_client.delete_object(Bucket=bucket_name, Key=test_key)
        print("✅ Archivo de prueba eliminado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error probando presigned URLs: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("❌ Uso: python configure_bucket_manual.py <bucket_name>")
        sys.exit(1)
    
    bucket_name = sys.argv[1]
    
    print("🔧 Configurador Manual de Bucket S3")
    print("=" * 40)
    
    if configure_bucket_manual(bucket_name):
        print(f"\n✅ Bucket {bucket_name} configurado exitosamente!")
        
        # Probar presigned URLs
        print("\n🧪 Probando funcionalidad de presigned URLs...")
        if test_presigned_urls(bucket_name):
            print("✅ Todo funcionando correctamente!")
        else:
            print("❌ Hay problemas con las presigned URLs")
    else:
        print(f"\n❌ Error configurando bucket {bucket_name}") 