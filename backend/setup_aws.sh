#!/bin/bash

# Script para configurar AWS CLI y crear bucket S3

echo "🔧 Configurando AWS CLI para Trade Tracker"
echo "=========================================="

# Verificar si AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI no está instalado"
    echo "💡 Instala AWS CLI desde: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI encontrado"

# Verificar si ya está configurado
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS CLI ya está configurado"
    echo "👤 Usuario actual:"
    aws sts get-caller-identity
else
    echo "⚠️  AWS CLI no está configurado"
    echo "🔑 Configurando AWS CLI..."
    echo ""
    echo "💡 Necesitarás:"
    echo "   - Access Key ID"
    echo "   - Secret Access Key"
    echo "   - Región (ej: us-east-1)"
    echo "   - Formato de salida (json)"
    echo ""
    aws configure
fi

echo ""
echo "🚀 Ejecutando script de creación de bucket S3..."
python3 create_s3_bucket.py

echo ""
echo "📋 Comandos útiles:"
echo "   python3 create_s3_bucket.py list     # Listar buckets"
echo "   python3 create_s3_bucket.py test BUCKET_NAME  # Probar bucket"
echo "   aws s3 ls                            # Listar buckets con AWS CLI"
echo "   aws s3 ls s3://BUCKET_NAME/          # Listar contenido del bucket" 