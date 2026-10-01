import React from 'react';

export function Card({ className = '', children, ...props }) {
  return (
    <div className={`bg-white dark:bg-[#161b22] rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_2px_0_rgba(0,0,0,0.03)] border border-gray-200 dark:border-white/[0.06] overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`px-6 py-5 border-b border-gray-100 dark:border-white/[0.06] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02] ${className}`} {...props}>
      {children}
    </div>
  );
}
