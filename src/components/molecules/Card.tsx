import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-md ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="text-gray-700">{children}</div>
    </div>
  );
};

export default Card;
