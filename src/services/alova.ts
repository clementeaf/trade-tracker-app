import { createAlova } from 'alova';
import { ReactHook } from 'alova/react';
import { GlobalFetch } from 'alova/adapter/globalFetch';

// Crear instancia de Alova
export const alovaInstance = createAlova({
  // Configurar el adaptador para usar fetch
  requestAdapter: GlobalFetch(),

  // Configurar hooks para React
  hooks: {
    ...ReactHook(),
  },

  // Configuración base
  baseURL: 'https://jsonplaceholder.typicode.com', // API de ejemplo

  // Configuración de respuestas
  responded: (response) => {
    return response.json();
  },
});

// Tipos para las respuestas de la API
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}
