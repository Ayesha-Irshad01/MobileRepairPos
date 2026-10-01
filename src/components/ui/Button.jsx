import React from 'react';

export const Button = React.forwardRef(({ className = '', variant = 'primary', size = 'md', children, loading = false, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm dark:shadow-lg dark:shadow-blue-500/20',
    secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm dark:bg-white/[0.05] dark:border-white/[0.1] dark:text-white/80 dark:hover:bg-white/[0.1]',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 text-gray-700 dark:border-white/[0.1] dark:hover:bg-white/[0.05] dark:text-white/80',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/20',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/[0.05] dark:text-white/70',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm dark:shadow-lg dark:shadow-green-500/20',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 py-2 text-sm',
    lg: 'h-10 px-6 text-sm',
    icon: 'h-9 w-9',
  };
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
});

Button.displayName = 'Button';