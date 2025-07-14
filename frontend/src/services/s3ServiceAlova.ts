import { alova, createApiUrl } from './alova';

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

// Métodos alovaJS para S3
export const s3Methods = {
  // Obtener información del bucket
  getBucketInfo: () => alova.Get(createApiUrl('/s3/bucket-info')),
  
  // Generar presigned URL
  generatePresignedUrl: (request: PresignedUrlRequest) => 
    alova.Post(createApiUrl('/s3/presigned-url'), request),
  
  // Listar archivos
  listFiles: (prefix?: string) => {
    const url = prefix 
      ? createApiUrl(`/s3/files?prefix=${encodeURIComponent(prefix)}`)
      : createApiUrl('/s3/files');
    return alova.Get(url);
  },
  
  // Eliminar archivo
  deleteFile: (fileKey: string) => 
    alova.Delete(createApiUrl(`/s3/files/${encodeURIComponent(fileKey)}`)),
};

// Servicio S3 usando alovaJS
export const s3ServiceAlova = {
  // Obtener información del bucket
  async getBucketInfo() {
    const response = await alova.Get(createApiUrl('/s3/bucket-info')).send();
    return response;
  },

  // Generar presigned URL
  async generatePresignedUrl(request: PresignedUrlRequest): Promise<PresignedUrlResponse> {
    const response = await alova.Post(createApiUrl('/s3/presigned-url'), request).send();
    return response as PresignedUrlResponse;
  },

  // Listar archivos
  async listFiles(prefix?: string): Promise<S3FilesResponse> {
    const url = prefix 
      ? createApiUrl(`/s3/files?prefix=${encodeURIComponent(prefix)}`)
      : createApiUrl('/s3/files');
    const response = await alova.Get(url).send();
    return response as S3FilesResponse;
  },

  // Eliminar archivo
  async deleteFile(fileKey: string): Promise<{ message: string }> {
    const response = await alova.Delete(createApiUrl(`/s3/files/${encodeURIComponent(fileKey)}`)).send();
    return response as { message: string };
  },

  // Subir archivo completo
  async uploadFileComplete(file: File): Promise<{ file_key: string; url: string }> {
    try {
      // 1. Generar presigned URL
      const presignedResponse = await this.generatePresignedUrl({
        file_name: file.name,
        file_type: file.type,
        operation: 'upload',
      });

      // 2. Subir archivo usando la URL
      const uploadResponse = await fetch(presignedResponse.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Error subiendo archivo: ${uploadResponse.status}`);
      }

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