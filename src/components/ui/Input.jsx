import React from 'react';

/**
 * Input Component
 * @param {Object} props
 * @param {string} props.id - The ID of the input element
 * @param {string} [props.label] - The text for the input's label
 * @param {string} [props.type='text'] - The type of input (e.g., 'text', 'password', 'email')
 * @param {string} [props.placeholder=''] - The placeholder text
 * @param {string} [props.value] - The current value of the input
 * @param {Function} [props.onChange] - Change handler function
 * @param {string} [props.error] - Error message to display below input
 * @param {string} [props.className=''] - Additional custom CSS classes for the wrapper
 */
const Input = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 
          focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:border-transparent
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 dark:text-red-400">{error}</span>
      )}
    </div>
  );
};

export default Input;
