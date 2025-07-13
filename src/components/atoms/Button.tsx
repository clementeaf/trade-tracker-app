import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const base = 'px-5 py-2 rounded-lg font-semibold transition-colors focus:outline-none';
const variants = {
  primary: 'bg-black text-white shadow hover:bg-gray-900',
  secondary: 'bg-gray-200 text-black hover:bg-gray-300',
  ghost: 'bg-transparent text-black hover:bg-gray-100',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => (
  <button className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
