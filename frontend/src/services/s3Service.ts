import { api } from './api';

export interface PresignedUrlRequest {
  file_name: string;
  file_type: string;
  operation: 'upload' | 'download';
}

export interface PresignedUrlResponse {
  url: string;
  expires_in: number;
  file_key: string;
}

export interface S3File {
  key: string;
  size: number;
  last_modified: string;
  url: string;
}

export interface S3FilesResponse {
  files: S3File[];
}

export const s3Service = {
  // Generar presigned URL para subir o descargar archivos
  async generatePresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    return api.post('/s3/presigned-url', request);
  },

  // Subir archivo usando presigned URL
  async uploadFile(presignedUrl: string, file: File): Promise<void> {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Error subiendo archivo: ${response.status}`);
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  },

  // Listar archivos en S3
  async listFiles(prefix?: string): Promise<S3FilesResponse> {
    const endpoint = prefix ? `/s3/files?prefix=${encodeURIComponent(prefix)}` : '/s3/files';
    return api.get(endpoint);
  },

  // Eliminar archivo de S3
  async deleteFile(fileKey: string): Promise<{ message: string }> {
    return api.delete(`/s3/files/${encodeURIComponent(fileKey)}`);
  },

  // Obtener información del bucket
  async getBucketInfo(): Promise<{
    bucket_name: string;
    region: string;
    status: string;
    url: string;
  }> {
    return api.get('/s3/bucket-info');
  },

  // Método helper para subir archivo completo (genera URL y sube)
  async uploadFileComplete(file: File): Promise<{ file_key: string; url: string }> {
    try {
      // 1. Generar presigned URL
      const presignedResponse = await this.generatePresignedUrl({
        file_name: file.name,
        file_type: file.type,
        operation: 'upload',
      });

      // 2. Subir archivo usando la URL
      await this.uploadFile(presignedResponse.url, file);

      // 3. Retornar información del archivo subido
      return {
        file_key: presignedResponse.file_key,
        url: `https://trade-tracker-assets-20250713-151538-f0d3341a.s3.amazonaws.com/${presignedResponse.file_key}`,
      };
    } catch (error) {
      console.error('Error en uploadFileComplete:', error);
      throw error;
    }
  },
}; 