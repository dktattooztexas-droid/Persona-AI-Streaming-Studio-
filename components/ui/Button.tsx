
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  // FIX: Added size prop to support different button sizes.
  size?: 'sm' | 'md';
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  // FIX: Destructure size prop with a default value.
  size = 'md',
  children,
  className,
  isLoading = false,
  ...props
}) => {
  // FIX: Removed padding from baseStyles to be handled by sizeStyles.
  const baseStyles = 'rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-brand-primary text-brand-bg hover:bg-brand-secondary focus:ring-brand-primary',
    secondary: 'bg-brand-surface text-brand-text-light hover:bg-gray-700 focus:ring-brand-secondary',
    ghost: 'bg-transparent text-brand-text-light hover:bg-brand-surface focus:ring-brand-secondary',
  };

  // FIX: Added sizeStyles to handle different button padding and text sizes.
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2',
  };

  return (
    <button
      // FIX: Added sizeStyles to the className string.
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
