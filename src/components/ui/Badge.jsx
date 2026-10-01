import React from 'react';

export function Badge({ className = '', variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-gray-50 text-gray-700 border border-gray-200',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
