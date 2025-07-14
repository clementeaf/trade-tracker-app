import React, { useState, useRef } from 'react';
import { s3Service } from '../../services/s3Service';

interface ImageUploadProps {
  onUploadSuccess?: (fileKey: string, url: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      onUploadError?.('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Subir archivo
      const result = await s3Service.uploadFileComplete(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      onUploadSuccess?.(result.file_key, result.url);
      
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Error subiendo imagen');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        disabled={isUploading}
        className={`
          w-full p-4 border-2 border-dashed border-gray-300 rounded-lg
          hover:border-blue-500 hover:bg-blue-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isUploading ? 'bg-blue-50' : 'bg-white'}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Subiendo... {uploadProgress}%</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-sm text-gray-600">
              Haz clic para subir una imagen
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG hasta 5MB
            </span>
          </div>
        )}
      </button>
    </div>
  );
}; 