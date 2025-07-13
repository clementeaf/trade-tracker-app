# Trade Tracker App

Una aplicación moderna para rastrear y gestionar operaciones de trading, construida con React + Vite y un stack tecnológico de última generación.

## 🚀 Stack Tecnológico

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v3 (versión clásica y estable)
- **State Management:** TanStack Query para gestión de estado del servidor
- **HTTP Client:** AlovaJS para manejo de solicitudes HTTP
- **Date Handling:** date-fns para manipulación de fechas
- **Code Quality:** ESLint + Prettier para código limpio y consistente

## 🏗️ Arquitectura

La aplicación sigue los principios de **Atomic Design** con una estructura de carpetas organizada:

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, etc.)
│   ├── molecules/      # Componentes compuestos (Card, Form, etc.)
│   └── organisms/      # Componentes complejos (PostList, etc.)
├── hooks/              # Custom hooks (usePosts, etc.)
├── services/           # Configuración de APIs (AlovaJS)
├── utils/              # Utilidades (date-fns, helpers)
├── pages/              # Páginas de la aplicación
└── styles/             # Estilos globales
```

## ✨ Características

- ✅ **React + Vite:** Configuración moderna y rápida
- ✅ **Tailwind CSS v3:** Estilos utilitarios sin configuración experimental
- ✅ **TanStack Query:** Gestión de estado del servidor con cache inteligente
- ✅ **AlovaJS:** Cliente HTTP moderno y eficiente
- ✅ **date-fns:** Manipulación de fechas en español
- ✅ **TypeScript:** Tipado estático para mayor seguridad
- ✅ **ESLint + Prettier:** Código limpio y consistente
- ✅ **Atomic Design:** Arquitectura de componentes escalable

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/clementeaf/trade-tracker-app.git

# Navegar al directorio
cd trade-tracker-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run preview          # Previsualizar build

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Corregir errores de ESLint
npm run format           # Formatear código con Prettier
npm run format:check     # Verificar formato
npm run type-check       # Verificar tipos de TypeScript

# Testing
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con cobertura
npm run test:ui          # Tests con interfaz visual

# Despliegue
npm run deploy           # Despliegue preview
npm run deploy:prod      # Despliegue a producción
npm run vercel           # Despliegue directo con Vercel CLI
npm run vercel:prod      # Despliegue a producción con Vercel CLI
```

## 🚀 Despliegue Automático

El proyecto está configurado para despliegue automático a Vercel con CI/CD.

### Despliegue Rápido
```bash
# Despliegue preview
npm run deploy

# Despliegue a producción
npm run deploy:prod
```

### Configuración Automática
- **GitHub Actions:** Despliegue automático en push a main
- **Preview Deployments:** Cada PR genera un preview único
- **Tests Automáticos:** Ejecución de tests antes del despliegue

Para más detalles, consulta [DEPLOYMENT.md](DEPLOYMENT.md).

## 🎯 Demostración

La aplicación incluye ejemplos funcionales de:

1. **TanStack Query + AlovaJS:** Obtención de datos de API externa
2. **date-fns:** Formateo de fechas en español
3. **Atomic Design:** Componentes reutilizables
4. **Tailwind CSS:** Estilos modernos y responsivos

## 🔧 Configuración

### Tailwind CSS
- Configurado con PostCSS
- Purga automática de estilos no utilizados
- Sin opciones experimentales de v4

### TanStack Query
- QueryClient configurado con opciones optimizadas
- Cache de 5 minutos por defecto
- Retry limitado a 1 intento

### AlovaJS
- Configurado con GlobalFetch adapter
- Base URL configurada para APIs externas
- Hooks de React integrados

## 📁 Estructura de Archivos

```
trade-tracker-app/
├── src/
│   ├── components/
│   │   ├── atoms/Button.tsx
│   │   ├── molecules/Card.tsx
│   │   └── organisms/PostList.tsx
│   ├── hooks/usePosts.ts
│   ├── services/alova.ts
│   ├── utils/dateUtils.ts
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── deploy.sh        # Script de despliegue
├── .github/workflows/
│   └── deploy.yml       # GitHub Actions workflow
├── vercel.json          # Configuración de Vercel
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
└── package.json
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.
