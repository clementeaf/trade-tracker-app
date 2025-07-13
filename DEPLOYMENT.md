# 🚀 Despliegue Automático a Vercel

Este proyecto está configurado para despliegue automático a Vercel con CI/CD.

## 📋 Configuración Inicial

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Configurar Vercel (Primera vez)
```bash
vercel login
vercel
```

## 🔄 Despliegue Automático

### GitHub Actions
El proyecto incluye un workflow de GitHub Actions que se ejecuta automáticamente en:
- Push a `main` o `master`
- Pull Requests a `main` o `master`

### Variables de Entorno Requeridas
Configura estos secrets en tu repositorio de GitHub:

1. `VERCEL_TOKEN` - Token de Vercel
2. `VERCEL_ORG_ID` - ID de la organización
3. `VERCEL_PROJECT_ID` - ID del proyecto

### Obtener las Variables
```bash
# Token de Vercel
vercel whoami

# ID de Organización y Proyecto
vercel project ls
```

## 🛠️ Comandos de Despliegue

### Despliegue Local
```bash
# Preview
npm run deploy

# Producción
npm run deploy:prod

# Directo con Vercel CLI
npm run vercel
npm run vercel:prod
```

### Despliegue Manual
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Build
npm run build

# Desplegar
vercel --prod
```

## 📁 Archivos de Configuración

### `vercel.json`
- Configuración del framework (Vite)
- Rewrites para SPA
- Headers de caché
- Regiones de despliegue

### `.github/workflows/deploy.yml`
- Workflow de GitHub Actions
- Tests automáticos
- Build automático
- Despliegue automático

### `scripts/deploy.sh`
- Script de despliegue local
- Verificación de dependencias
- Tests automáticos
- Build y despliegue

## 🔧 Configuración Avanzada

### Variables de Entorno
Crea un archivo `.env.local` para variables locales:
```env
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Trade Tracker
```

### Dominio Personalizado
1. Ve a tu dashboard de Vercel
2. Configura el dominio en Settings > Domains
3. Sigue las instrucciones de DNS

### Preview Deployments
Cada PR genera automáticamente un preview deployment con URL única.

## 📊 Monitoreo

### Vercel Analytics
- Performance metrics
- Error tracking
- User analytics

### Logs
```bash
vercel logs
vercel logs --follow
```

## 🚨 Troubleshooting

### Error de Build
```bash
# Verificar dependencias
npm ci

# Limpiar caché
rm -rf node_modules package-lock.json
npm install

# Verificar TypeScript
npm run type-check
```

### Error de Despliegue
```bash
# Verificar configuración
vercel project ls

# Re-desplegar
vercel --prod --force
```

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html) 