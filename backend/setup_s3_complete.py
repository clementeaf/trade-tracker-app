#!/usr/bin/env python3
"""
Script completo para configurar S3 con presigned URLs para Trade Tracker
"""

import boto3
import json
from botocore.exceptions import ClientError, NoCredentialsError
import uuid
from datetime import datetime, timedelta
import os

def create_s3_bucket_with_presigned_support(bucket_name=None, region='us-east-1'):
    """
    Crear bucket S3 con configuración completa para presigned URLs
    """
    try:
        # Crear cliente S3
        s3_client = boto3.client('s3')
        
        # Generar nombre único si no se proporciona
        if not bucket_name:
            timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
            bucket_name = f"trade-tracker-assets-{timestamp}-{str(uuid.uuid4())[:8]}"
        
        print(f"🚀 Creando bucket S3: {bucket_name}")
        
        # Crear bucket
        if region == 'us-east-1':
            response = s3_client.create_bucket(Bucket=bucket_name)
        else:
            response = s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={'LocationConstraint': region}
            )
        
        print(f"✅ Bucket creado exitosamente: {bucket_name}")
        
        # Configurar política de bucket para presigned URLs
        bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{bucket_name}/*"
                },
                {
                    "Sid": "AllowPresignedURLs",
                    "Effect": "Allow",
                    "Principal": {
                        "AWS": "*"
                    },
                    "Action": [
                        "s3:PutObject",
                        "s3:GetObject",
                        "s3:DeleteObject"
                    ],
                    "Resource": f"arn:aws:s3:::{bucket_name}/*",
                    "Condition": {
                        "StringEquals": {
                            "aws:PrincipalType": "AWSAccount"
                        }
                    }
                }
            ]
        }
        
        # Aplicar política al bucket
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        
        print(f"✅ Política de bucket aplicada para presigned URLs")
        
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
        
        # Obtener URL del bucket
        bucket_url = f"https://{bucket_name}.s3.amazonaws.com"
        
        return {
            'bucket_name': bucket_name,
            'region': region,
            'bucket_url': bucket_url,
            'success': True
        }
        
    except NoCredentialsError:
        print("❌ Error: No se encontraron credenciales de AWS")
        print("💡 Ejecuta: aws configure")
        return {'success': False, 'error': 'No credentials found'}
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'BucketAlreadyExists':
            print(f"❌ Error: El bucket '{bucket_name}' ya existe")
            return {'success': False, 'error': 'Bucket already exists'}
        elif error_code == 'InvalidBucketName':
            print(f"❌ Error: Nombre de bucket inválido: {bucket_name}")
            return {'success': False, 'error': 'Invalid bucket name'}
        else:
            print(f"❌ Error de AWS: {e}")
            return {'success': False, 'error': str(e)}
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return {'success': False, 'error': str(e)}

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
        
        # Simular subida usando requests (en producción usarías fetch en el frontend)
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

def create_iam_user_for_s3_access(bucket_name):
    """
    Crear usuario IAM con permisos específicos para S3
    """
    try:
        iam_client = boto3.client('iam')
        
        username = f"trade-tracker-s3-user-{datetime.now().strftime('%Y%m%d')}"
        
        print(f"👤 Creando usuario IAM: {username}")
        
        # Crear usuario
        iam_client.create_user(UserName=username)
        
        # Crear política específica para el bucket
        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "s3:GetObject",
                        "s3:PutObject",
                        "s3:DeleteObject",
                        "s3:ListBucket"
                    ],
                    "Resource": [
                        f"arn:aws:s3:::{bucket_name}",
                        f"arn:aws:s3:::{bucket_name}/*"
                    ]
                }
            ]
        }
        
        policy_name = f"TradeTrackerS3Policy-{bucket_name}"
        
        # Crear política
        iam_client.create_policy(
            PolicyName=policy_name,
            PolicyDocument=json.dumps(policy_document),
            Description=f"Política para acceso a bucket {bucket_name}"
        )
        
        # Adjuntar política al usuario
        iam_client.attach_user_policy(
            UserName=username,
            PolicyArn=f"arn:aws:iam::{boto3.client('sts').get_caller_identity()['Account']}:policy/{policy_name}"
        )
        
        print(f"✅ Usuario IAM creado con permisos específicos")
        
        return username
        
    except Exception as e:
        print(f"❌ Error creando usuario IAM: {e}")
        return None

if __name__ == "__main__":
    import sys
    
    print("🔧 Configurador Completo de S3 para Trade Tracker")
    print("=" * 60)
    
    # Verificar argumentos
    if len(sys.argv) > 1:
        if sys.argv[1] == "test" and len(sys.argv) > 2:
            test_presigned_urls(sys.argv[2])
            sys.exit(0)
    
    # Crear bucket
    result = create_s3_bucket_with_presigned_support()
    
    if result['success']:
        print("\n🎉 Bucket S3 configurado exitosamente!")
        print(f"📦 Nombre del bucket: {result['bucket_name']}")
        print(f"🌍 Región: {result['region']}")
        print(f"🔗 URL del bucket: {result['bucket_url']}")
        
        # Probar presigned URLs
        print("\n🧪 Probando funcionalidad de presigned URLs...")
        if test_presigned_urls(result['bucket_name']):
            print("✅ Todo funcionando correctamente!")
        else:
            print("❌ Hay problemas con las presigned URLs")
        
        # Crear usuario IAM (opcional)
        print("\n👤 Creando usuario IAM para acceso específico...")
        username = create_iam_user_for_s3_access(result['bucket_name'])
        if username:
            print(f"✅ Usuario IAM creado: {username}")
        
        print("\n📋 Información para el frontend:")
        print(f"   - Bucket: {result['bucket_name']}")
        print(f"   - Región: {result['region']}")
        print(f"   - URL Base: {result['bucket_url']}")
        
    else:
        print(f"\n❌ Error: {result.get('error', 'Error desconocido')}")
        print("\n💡 Asegúrate de:")
        print("   1. Tener AWS CLI instalado")
        print("   2. Ejecutar: aws configure")
        print("   3. Tener permisos para crear buckets S3") 