# Trade Tracker Backend

Backend API para la aplicación Trade Tracker, construido con FastAPI.

## 🚀 Instalación

### 1. Crear entorno virtual
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

## 🏃‍♂️ Ejecutar

### Desarrollo
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Producción
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📚 Documentación API

Una vez ejecutado el servidor, puedes acceder a:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 🔗 Endpoints

### Operaciones (Trades)
- `GET /trades` - Obtener todas las operaciones
- `GET /trades/{id}` - Obtener operación específica
- `POST /trades` - Crear nueva operación
- `PUT /trades/{id}` - Actualizar operación
- `DELETE /trades/{id}` - Eliminar operación

### Otros
- `GET /` - Información de la API
- `GET /health` - Health check

## 🛠️ Estructura

```
backend/
├── main.py              # Aplicación principal
├── requirements.txt     # Dependencias
├── README.md           # Este archivo
└── venv/              # Entorno virtual
```

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` para configuraciones:

```env
DATABASE_URL=sqlite:///./trades.db
SECRET_KEY=tu-clave-secreta
DEBUG=True
```

### CORS
La API está configurada para aceptar peticiones desde:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (React dev server)

## 📦 Dependencias

- **FastAPI**: Framework web moderno y rápido
- **Uvicorn**: Servidor ASGI
- **Pydantic**: Validación de datos
- **python-multipart**: Manejo de formularios 