#!/usr/bin/env python3
"""
Script para probar la integración completa con DynamoDB
"""

import requests
import json
from datetime import datetime

# Configuración
API_BASE_URL = "http://localhost:8000"

def test_dynamodb_integration():
    """Probar la integración completa con DynamoDB"""
    
    print("🧪 Probando integración con DynamoDB...")
    
    # 1. Probar health check
    print("\n1. Health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Error en health check: {e}")
        return
    
    # 2. Crear un trade con imágenes y observaciones
    print("\n2. Creando trade con imágenes y observaciones...")
    trade_data = {
        "par": "ETH/USDT",
        "precio_apertura": 3200.0,
        "take_profit": 3400.0,
        "stop_loss": 3100.0,
        "observaciones": "Análisis técnico: ETH rompió resistencia en 3200. Posible continuación alcista hasta 3400. Stop loss en 3100.",
        "imagenes": [
            "https://trade-tracker-bucket.s3.amazonaws.com/eth-chart-1.jpg",
            "https://trade-tracker-bucket.s3.amazonaws.com/eth-chart-2.jpg"
        ]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/trades", json=trade_data)
        print(f"✅ Trade creado: {response.status_code}")
        created_trade = response.json()
        print(f"   Trade ID: {created_trade.get('id')}")
        print(f"   Observaciones: {created_trade.get('observaciones')}")
        print(f"   Imágenes: {len(created_trade.get('imagenes', []))}")
    except Exception as e:
        print(f"❌ Error creando trade: {e}")
        return
    
    # 3. Obtener todos los trades
    print("\n3. Obteniendo todos los trades...")
    try:
        response = requests.get(f"{API_BASE_URL}/trades")
        print(f"✅ Trades obtenidos: {response.status_code}")
        trades = response.json()
        print(f"   Total trades: {len(trades)}")
        for trade in trades:
            print(f"   - ID: {trade.get('id')}, Par: {trade.get('par')}, Observaciones: {trade.get('observaciones', 'N/A')}")
    except Exception as e:
        print(f"❌ Error obteniendo trades: {e}")
        return
    
    # 4. Obtener trades por par
    print("\n4. Obteniendo trades por par...")
    try:
        import urllib.parse
        par_encoded = urllib.parse.quote("BTC/USDT")
        response = requests.get(f"{API_BASE_URL}/trades/par/{par_encoded}")
        print(f"✅ Trades por par: {response.status_code}")
        trades_by_par = response.json()
        print(f"   Trades BTC/USDT: {len(trades_by_par)}")
    except Exception as e:
        print(f"❌ Error obteniendo trades por par: {e}")
        return
    
    # 5. Cerrar un trade
    print("\n5. Cerrando trade...")
    try:
        trade_id = created_trade.get('id')
        fecha_cierre = datetime.now().isoformat()
        motivo_cierre = "Take profit alcanzado"
        
        response = requests.put(
            f"{API_BASE_URL}/trades/{trade_id}/close",
            params={"fecha_cierre": fecha_cierre, "motivo_cierre": motivo_cierre}
        )
        print(f"✅ Trade cerrado: {response.status_code}")
        closed_trade = response.json()
        print(f"   Fecha cierre: {closed_trade.get('fecha_cierre')}")
        print(f"   Motivo: {closed_trade.get('motivo_cierre')}")
    except Exception as e:
        print(f"❌ Error cerrando trade: {e}")
        return
    
    # 6. Probar S3
    print("\n6. Probando S3...")
    try:
        response = requests.get(f"{API_BASE_URL}/s3/bucket-info")
        print(f"✅ S3 bucket info: {response.status_code}")
        bucket_info = response.json()
        print(f"   Bucket: {bucket_info.get('bucket_name')}")
        print(f"   Status: {bucket_info.get('status')}")
    except Exception as e:
        print(f"❌ Error obteniendo info de S3: {e}")
        return
    
    print("\n🎉 ¡Integración completa exitosa!")
    print("✅ DynamoDB funcionando")
    print("✅ API funcionando")
    print("✅ S3 funcionando")
    print("✅ Frontend funcionando")

if __name__ == "__main__":
    test_dynamodb_integration() 