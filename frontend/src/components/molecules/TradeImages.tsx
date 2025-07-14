import React, { useState } from 'react';

interface TradeImagesProps {
  images: string[];
  maxDisplay?: number;
  className?: string;
}

export const TradeImages: React.FC<TradeImagesProps> = ({
  images,
  maxDisplay = 3,
  className = '',
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        Sin imágenes
      </div>
    );
  }

  const displayImages = showAll ? images : images.slice(0, maxDisplay);
  const hasMore = images.length > maxDisplay;

  return (
    <div className={`trade-images ${className}`}>
      <div className="flex flex-wrap gap-1">
        {displayImages.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Imagen ${index + 1}`}
              className="w-8 h-8 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.open(imageUrl, '_blank')}
              title="Haz clic para ver en tamaño completo"
            />
          </div>
        ))}
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-8 h-8 bg-gray-200 rounded border text-xs text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center"
            title={`Ver ${images.length - maxDisplay} imágenes más`}
          >
            +{images.length - maxDisplay}
          </button>
        )}
        {hasMore && showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="w-8 h-8 bg-gray-200 rounded border text-xs text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center"
            title="Mostrar menos"
          >
            -
          </button>
        )}
      </div>
    </div>
  );
}; 