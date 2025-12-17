import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({ error, label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-400 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-slate-900/50 border ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-violet-500 focus:ring-violet-500'
        } rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  );
};