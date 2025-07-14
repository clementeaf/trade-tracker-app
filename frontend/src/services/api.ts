import { alova, createApiUrl } from './alova';

export const api = {
  async get(endpoint: string) {
    try {
      const response = await alova.Get(createApiUrl(endpoint)).send();
      return response;
    } catch (error) {
      console.error('Error en GET request:', error);
      throw error;
    }
  },
  
  async post(endpoint: string, data: any) {
    try {
      const response = await alova.Post(createApiUrl(endpoint), data).send();
      return response;
    } catch (error) {
      console.error('Error en POST request:', error);
      throw error;
    }
  },
  
  async put(endpoint: string, data: any) {
    try {
      const response = await alova.Put(createApiUrl(endpoint), data).send();
      return response;
    } catch (error) {
      console.error('Error en PUT request:', error);
      throw error;
    }
  },
  
  async delete(endpoint: string) {
    try {
      const response = await alova.Delete(createApiUrl(endpoint)).send();
      return response;
    } catch (error) {
      console.error('Error en DELETE request:', error);
      throw error;
    }
  },
}; 