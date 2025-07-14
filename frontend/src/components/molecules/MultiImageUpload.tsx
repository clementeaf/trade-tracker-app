import React, { useState, useRef } from 'react';
import { s3Service } from '../../services/s3Service';

interface MultiImageUploadProps {
  onImagesUploaded?: (imageUrls: string[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesUploaded,
  onUploadError,
  className = '',
  maxImages = 5,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validar número máximo de imágenes
    if (uploadedImages.length + files.length > maxImages) {
      onUploadError?.(`Puedes subir máximo ${maxImages} imágenes`);
      return;
    }

    // Validar tipos de archivo
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      onUploadError?.('Solo se permiten archivos de imagen');
      return;
    }

    // Validar tamaños (máximo 5MB cada una)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      onUploadError?.('Algunos archivos son demasiado grandes. Máximo 5MB por imagen');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newImageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Actualizar progreso
        setUploadProgress((i / files.length) * 100);

        // Subir archivo
        const result = await s3Service.uploadFileComplete(file);
        newImageUrls.push(result.url);
      }

      setUploadProgress(100);

      // Actualizar lista de imágenes
      const allImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(allImages);
      
      // Notificar al componente padre
      onImagesUploaded?.(allImages);
      
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Error subiendo imágenes');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesUploaded?.(newImages);
  };

  return (
    <div className={`multi-image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Botón de subida */}
      {uploadedImages.length < maxImages && (
        <button
          onClick={handleClick}
          disabled={isUploading}
          className={`
            w-full p-4 border-2 border-dashed border-blue-300 rounded-lg
            hover:border-blue-500 hover:bg-blue-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isUploading ? 'bg-blue-50' : 'bg-white'}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Subiendo imágenes... {Math.round(uploadProgress)}%</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm text-gray-600">
                Haz clic para subir imágenes de la operativa
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG hasta 5MB cada una (máximo {maxImages})
              </span>
            </div>
          )}
        </button>
      )}

      {/* Vista previa de imágenes */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Imágenes subidas ({uploadedImages.length}/{maxImages})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 