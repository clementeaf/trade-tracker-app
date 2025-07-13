#!/bin/bash

# Script de despliegue a Vercel
# Uso: ./scripts/deploy.sh [--prod]

set -e

echo "🚀 Iniciando despliegue a Vercel..."

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Verificar que estemos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Ejecutar tests
echo "🧪 Ejecutando tests..."
npm test

# Build del proyecto
echo "🔨 Construyendo proyecto..."
npm run build

# Desplegar a Vercel
if [ "$1" = "--prod" ]; then
    echo "🚀 Desplegando a producción..."
    vercel --prod
else
    echo "🚀 Desplegando preview..."
    vercel
fi

echo "✅ Despliegue completado!" 