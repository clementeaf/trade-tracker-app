from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="Trade Tracker API",
    description="API para gestionar operaciones de trading",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class TradeBase(BaseModel):
    par: str
    precio_apertura: float
    take_profit: float
    stop_loss: float

class TradeCreate(TradeBase):
    pass

class Trade(TradeBase):
    id: int
    fecha_apertura: datetime
    fecha_cierre: Optional[datetime] = None
    motivo_cierre: Optional[str] = None

    class Config:
        from_attributes = True

# Datos de ejemplo (en producción usarías una base de datos)
trades_db = [
    {
        "id": 1,
        "par": "BTC/USDT",
        "precio_apertura": 65000.0,
        "take_profit": 67000.0,
        "stop_loss": 64000.0,
        "fecha_apertura": datetime.now(),
        "fecha_cierre": None,
        "motivo_cierre": None
    }
]

@app.get("/")
async def root():
    return {"message": "Trade Tracker API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/trades", response_model=List[Trade])
async def get_trades():
    """Obtener todas las operaciones"""
    return trades_db

@app.get("/trades/{trade_id}", response_model=Trade)
async def get_trade(trade_id: int):
    """Obtener una operación específica"""
    for trade in trades_db:
        if trade["id"] == trade_id:
            return trade
    return {"error": "Trade no encontrado"}

@app.post("/trades", response_model=Trade)
async def create_trade(trade: TradeCreate):
    """Crear una nueva operación"""
    new_trade = {
        "id": len(trades_db) + 1,
        **trade.dict(),
        "fecha_apertura": datetime.now(),
        "fecha_cierre": None,
        "motivo_cierre": None
    }
    trades_db.append(new_trade)
    return new_trade

@app.put("/trades/{trade_id}")
async def update_trade(trade_id: int, trade_update: TradeCreate):
    """Actualizar una operación"""
    for trade in trades_db:
        if trade["id"] == trade_id:
            trade.update(trade_update.dict())
            return trade
    return {"error": "Trade no encontrado"}

@app.delete("/trades/{trade_id}")
async def delete_trade(trade_id: int):
    """Eliminar una operación"""
    for i, trade in enumerate(trades_db):
        if trade["id"] == trade_id:
            deleted_trade = trades_db.pop(i)
            return {"message": "Trade eliminado", "trade": deleted_trade}
    return {"error": "Trade no encontrado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 