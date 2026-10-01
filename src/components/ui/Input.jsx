import React from 'react';

export const Input = React.forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-50 bg-white dark:bg-white/[0.05] dark:border-white/[0.08] dark:text-white/80 dark:placeholder-white/30 ${
          error ? 'border-red-500 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200 dark:border-white/[0.12] hover:border-gray-300 dark:hover:border-white/[0.16]'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';