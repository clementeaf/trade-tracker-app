import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium mb-1">{label}</label>}
    <input
      className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  </div>
);

export default Input; 