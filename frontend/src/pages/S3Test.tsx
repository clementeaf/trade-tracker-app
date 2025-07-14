import React, { useState } from 'react';
import { ImageUpload } from '../components/molecules/ImageUpload';
import { S3FileList } from '../components/molecules/S3FileList';
import { s3Service } from '../services/s3Service';
import type { S3File } from '../services/s3Service';

export const S3Test: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<S3File | null>(null);
  const [bucketInfo, setBucketInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (fileKey: string, url: string) => {
    console.log('Archivo subido exitosamente:', { fileKey, url });
    alert(`Archivo subido exitosamente!\nClave: ${fileKey}\nURL: ${url}`);
  };

  const handleUploadError = (error: string) => {
    console.error('Error subiendo archivo:', error);
    alert(`Error subiendo archivo: ${error}`);
  };

  const handleFileSelect = (file: S3File) => {
    setSelectedFile(file);
  };

  const loadBucketInfo = async () => {
    try {
      setLoading(true);
      const info = await s3Service.getBucketInfo();
      setBucketInfo(info);
    } catch (error) {
      console.error('Error cargando información del bucket:', error);
      alert('Error cargando información del bucket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Prueba de S3</h1>
      
      {/* Información del Bucket */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Información del Bucket</h2>
        <button
          onClick={loadBucketInfo}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Cargando...' : 'Cargar Información del Bucket'}
        </button>
        
        {bucketInfo && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-semibold mb-2">Detalles del Bucket:</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Nombre:</strong> {bucketInfo.bucket_name}</li>
              <li><strong>Región:</strong> {bucketInfo.region}</li>
              <li><strong>Estado:</strong> {bucketInfo.status}</li>
              <li><strong>URL:</strong> <a href={bucketInfo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{bucketInfo.url}</a></li>
            </ul>
          </div>
        )}
      </div>

      {/* Subir Imagen */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Imagen</h2>
        <ImageUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          className="max-w-md"
        />
      </div>

      {/* Lista de Archivos */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Archivos en S3</h2>
        <S3FileList
          onFileSelect={handleFileSelect}
          className="max-w-2xl"
        />
      </div>

      {/* Archivo Seleccionado */}
      {selectedFile && (
        <div className="mb-8 p-6 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Archivo Seleccionado</h2>
          <div className="space-y-2">
            <p><strong>Clave:</strong> {selectedFile.key}</p>
            <p><strong>Tamaño:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
            <p><strong>Última modificación:</strong> {new Date(selectedFile.last_modified).toLocaleString('es-ES')}</p>
            <p><strong>URL:</strong> <a href={selectedFile.url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">{selectedFile.url}</a></p>
            
            {/* Vista previa de la imagen */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Vista previa:</h3>
              <img
                src={selectedFile.url}
                alt="Vista previa"
                className="max-w-xs max-h-48 object-contain border rounded"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <p className="hidden text-sm text-gray-500 mt-2">
                No se puede mostrar la vista previa de este archivo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 