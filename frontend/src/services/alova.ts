import { createAlova } from 'alova';
import { xhrRequestAdapter } from '@alova/adapter-xhr';

// Crear instancia de alova
export const alova = createAlova({
  // Configurar el adapter XHR
  requestAdapter: xhrRequestAdapter(),
});

// Configurar URL base
export const API_BASE_URL = 'http://localhost:8000';

// Helper para crear URLs completas
export const createApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`; 