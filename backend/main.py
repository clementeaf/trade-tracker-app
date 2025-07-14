from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import boto3
from botocore.exceptions import ClientError
from config import S3_BUCKET_NAME, S3_REGION, API_HOST, API_PORT, DEBUG
from dynamodb_service import dynamodb_service

app = FastAPI(
    title="Trade Tracker API",
    description="API para gestionar operaciones de trading con S3",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cliente S3
s3_client = boto3.client('s3', region_name=S3_REGION)

# Modelos Pydantic
class TradeBase(BaseModel):
    par: str
    precio_apertura: float
    take_profit: float
    stop_loss: float
    observaciones: Optional[str] = None
    imagenes: Optional[List[str]] = []

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: int
    fecha_apertura: datetime
    fecha_cierre: Optional[datetime] = None
    motivo_cierre: Optional[str] = None
    observaciones: Optional[str] = None
    imagenes: Optional[List[str]] = []

    class Config:
        from_attributes = True

class PresignedUrlRequest(BaseModel):
    file_name: str
    file_type: str
    operation: str = "upload"  # "upload" o "download"

class PresignedUrlResponse(BaseModel):
    url: str
    expires_in: int
    file_key: str

# Los datos ahora se almacenan en DynamoDB

@app.get("/")
async def root():
    return {"message": "Trade Tracker API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/s3/bucket-info")
async def get_s3_bucket_info():
    """Obtener información del bucket S3"""
    try:
        response = s3_client.head_bucket(Bucket=S3_BUCKET_NAME)
        return {
            "bucket_name": S3_BUCKET_NAME,
            "region": S3_REGION,
            "status": "active",
            "url": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com"
        }
    except ClientError as e:
        raise HTTPException(status_code=404, detail=f"Bucket no encontrado: {str(e)}")

@app.post("/s3/presigned-url", response_model=PresignedUrlResponse)
async def generate_presigned_url(request: PresignedUrlRequest):
    """Generar presigned URL para subir o descargar archivos"""
    try:
        # Generar clave única para el archivo
        import uuid
        file_key = f"uploads/{datetime.now().strftime('%Y/%m/%d')}/{uuid.uuid4()}-{request.file_name}"
        
        if request.operation == "upload":
            # Generar presigned URL para subir
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': S3_BUCKET_NAME,
                    'Key': file_key,
                    'ContentType': request.file_type
                },
                ExpiresIn=3600  # 1 hora
            )
        elif request.operation == "download":
            # Generar presigned URL para descargar
            presigned_url = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': S3_BUCKET_NAME,
                    'Key': file_key
                },
                ExpiresIn=3600  # 1 hora
            )
        else:
            raise HTTPException(status_code=400, detail="Operación debe ser 'upload' o 'download'")
        
        return PresignedUrlResponse(
            url=presigned_url,
            expires_in=3600,
            file_key=file_key
        )
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error generando presigned URL: {str(e)}")

@app.get("/s3/files")
async def list_s3_files(prefix: str = ""):
    """Listar archivos en S3"""
    try:
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET_NAME,
            Prefix=prefix
        )
        
        files = []
        if 'Contents' in response:
            for obj in response['Contents']:
                files.append({
                    "key": obj['Key'],
                    "size": obj['Size'],
                    "last_modified": obj['LastModified'].isoformat(),
                    "url": f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{obj['Key']}"
                })
        
        return {"files": files}
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error listando archivos: {str(e)}")

@app.delete("/s3/files/{file_key}")
async def delete_s3_file(file_key: str):
    """Eliminar archivo de S3"""
    try:
        s3_client.delete_object(Bucket=S3_BUCKET_NAME, Key=file_key)
        return {"message": f"Archivo {file_key} eliminado exitosamente"}
        
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando archivo: {str(e)}")

# Endpoints existentes para trades
@app.get("/trades", response_model=List[Trade])
async def get_trades():
    """Obtener todas las operaciones"""
    try:
        trades = dynamodb_service.get_all_trades()
        return trades
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo trades: {str(e)}")

@app.get("/trades/{trade_id}", response_model=Trade)
async def get_trade(trade_id: int):
    """Obtener una operación específica"""
    try:
        trade = dynamodb_service.get_trade(trade_id)
        if not trade:
            raise HTTPException(status_code=404, detail="Trade no encontrado")
        return trade
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo trade: {str(e)}")

@app.post("/trades", response_model=Trade)
async def create_trade(trade: TradeCreate):
    """Crear una nueva operación"""
    try:
        trade_data = trade.dict()
        trade_data['fecha_apertura'] = datetime.now().isoformat()
        new_trade = dynamodb_service.create_trade(trade_data)
        return new_trade
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error creando trade: {str(e)}")

@app.put("/trades/{trade_id}")
async def update_trade(trade_id: int, trade_update: TradeCreate):
    """Actualizar una operación"""
    try:
        updates = trade_update.dict(exclude_unset=True)
        updated_trade = dynamodb_service.update_trade(trade_id, updates)
        if not updated_trade:
            raise HTTPException(status_code=404, detail="Trade no encontrado")
        return updated_trade
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando trade: {str(e)}")

@app.delete("/trades/{trade_id}")
async def delete_trade(trade_id: int):
    """Eliminar una operación"""
    try:
        success = dynamodb_service.delete_trade(trade_id)
        if success:
            return {"message": f"Trade {trade_id} eliminado exitosamente"}
        else:
            raise HTTPException(status_code=404, detail="Trade no encontrado")
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando trade: {str(e)}")

@app.get("/trades/par/{par}")
async def get_trades_by_par(par: str):
    """Obtener trades por par"""
    try:
        trades = dynamodb_service.get_trades_by_par(par)
        return trades
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo trades por par: {str(e)}")

@app.put("/trades/{trade_id}/close")
async def close_trade(trade_id: int, fecha_cierre: str, motivo_cierre: str):
    """Cerrar un trade"""
    try:
        updated_trade = dynamodb_service.close_trade(trade_id, fecha_cierre, motivo_cierre)
        if not updated_trade:
            raise HTTPException(status_code=404, detail="Trade no encontrado")
        return updated_trade
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error cerrando trade: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT, reload=DEBUG) 