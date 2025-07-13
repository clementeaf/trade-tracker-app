import { createAlova } from 'alova';
import { xhrRequestAdapter } from '@alova/adapter-xhr';

const API_BASE_URL = 'https://api.tu-backend.com';

export const alova = createAlova({
  baseURL: API_BASE_URL,
  requestAdapter: xhrRequestAdapter(),
  
  cacheFor: {
    GET: {
      mode: 'memory',
      expire: 5 * 60 * 1000, // 5 minutos
    },
    POST: 0,
  },
  
  responded: {
    onSuccess: async (response: any) => {
      if (response.status !== 200) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response.data;
    },
    onError: (error) => {
      console.error('Error en la respuesta de la API:', error);
      throw error;
    }
  },
  
  timeout: 10000,
  shareRequest: true,
}); 