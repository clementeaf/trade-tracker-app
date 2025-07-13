#!/usr/bin/env python3
"""
Script para crear un bucket S3 y configurar acceso total
"""

import boto3
import json
from botocore.exceptions import ClientError, NoCredentialsError
import uuid
from datetime import datetime

def create_s3_bucket(bucket_name=None, region='us-east-1'):
    """
    Crear un bucket S3 con acceso total configurado
    """
    try:
        # Crear cliente S3
        s3_client = boto3.client('s3')
        
        # Generar nombre único si no se proporciona
        if not bucket_name:
            timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
            bucket_name = f"trade-tracker-{timestamp}-{str(uuid.uuid4())[:8]}"
        
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
        
        # Configurar política de acceso total
        bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "FullAccess",
                    "Effect": "Allow",
                    "Principal": "*",
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
        
        # Aplicar política al bucket
        s3_client.put_bucket_policy(
            Bucket=bucket_name,
            Policy=json.dumps(bucket_policy)
        )
        
        print(f"✅ Política de acceso total aplicada")
        
        # Configurar CORS para acceso web
        cors_configuration = {
            'CORSRules': [
                {
                    'AllowedHeaders': ['*'],
                    'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                    'AllowedOrigins': ['*'],
                    'ExposeHeaders': ['ETag']
                }
            ]
        }
        
        s3_client.put_bucket_cors(
            Bucket=bucket_name,
            CORSConfiguration=cors_configuration
        )
        
        print(f"✅ Configuración CORS aplicada")
        
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

def list_buckets():
    """
    Listar todos los buckets S3
    """
    try:
        s3_client = boto3.client('s3')
        response = s3_client.list_buckets()
        
        print("📦 Buckets S3 disponibles:")
        for bucket in response['Buckets']:
            print(f"  - {bucket['Name']} (creado: {bucket['CreationDate']})")
            
    except NoCredentialsError:
        print("❌ Error: No se encontraron credenciales de AWS")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_bucket_access(bucket_name):
    """
    Probar acceso al bucket
    """
    try:
        s3_client = boto3.client('s3')
        
        # Probar subir un archivo de prueba
        test_content = "Este es un archivo de prueba para verificar el acceso al bucket S3"
        test_key = "test-access.txt"
        
        s3_client.put_object(
            Bucket=bucket_name,
            Key=test_key,
            Body=test_content.encode('utf-8')
        )
        
        print(f"✅ Archivo de prueba subido: {test_key}")
        
        # Probar descargar el archivo
        response = s3_client.get_object(Bucket=bucket_name, Key=test_key)
        downloaded_content = response['Body'].read().decode('utf-8')
        
        if downloaded_content == test_content:
            print("✅ Lectura del archivo exitosa")
        else:
            print("❌ Error en la lectura del archivo")
        
        # Limpiar archivo de prueba
        s3_client.delete_object(Bucket=bucket_name, Key=test_key)
        print("✅ Archivo de prueba eliminado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error probando acceso: {e}")
        return False

if __name__ == "__main__":
    import sys
    
    print("🔧 Configurador de Bucket S3 para Trade Tracker")
    print("=" * 50)
    
    # Verificar argumentos
    if len(sys.argv) > 1:
        if sys.argv[1] == "list":
            list_buckets()
            sys.exit(0)
        elif sys.argv[1] == "test" and len(sys.argv) > 2:
            test_bucket_access(sys.argv[2])
            sys.exit(0)
    
    # Crear bucket
    result = create_s3_bucket()
    
    if result['success']:
        print("\n🎉 Bucket S3 configurado exitosamente!")
        print(f"📦 Nombre del bucket: {result['bucket_name']}")
        print(f"🌍 Región: {result['region']}")
        print(f"🔗 URL del bucket: {result['bucket_url']}")
        
        # Probar acceso
        print("\n🧪 Probando acceso al bucket...")
        if test_bucket_access(result['bucket_name']):
            print("✅ Todo funcionando correctamente!")
        else:
            print("❌ Hay problemas con el acceso")
    else:
        print(f"\n❌ Error: {result.get('error', 'Error desconocido')}")
        print("\n💡 Asegúrate de:")
        print("   1. Tener AWS CLI instalado")
        print("   2. Ejecutar: aws configure")
        print("   3. Tener permisos para crear buckets S3") 