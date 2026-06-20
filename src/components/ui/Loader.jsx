import React from 'react';

/**
 * Loader Component
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the loader
 * @param {string} [props.className=''] - Additional custom CSS classes
 */
const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div 
        className={`
          ${sizes[size]}
          rounded-full
          border-gray-200 border-t-leaf-600
          dark:border-gray-700 dark:border-t-leaf-500
          animate-spin
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
