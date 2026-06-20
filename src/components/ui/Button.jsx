import React from 'react';

/**
 * Button Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside the button
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The type of the button
 * @param {'primary' | 'secondary' | 'outline' | 'danger'} [props.variant='primary'] - The visual style variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the button
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className=''] - Additional custom CSS classes
 * @param {Function} [props.onClick] - Click handler function
 */
const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-leaf-600 text-white hover:bg-leaf-700 dark:bg-leaf-500 dark:hover:bg-leaf-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
