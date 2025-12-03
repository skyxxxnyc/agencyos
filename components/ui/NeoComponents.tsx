import React from 'react';

// Neobrutalist Card
interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  noShadow?: boolean;
}
export const NeoCard: React.FC<NeoCardProps> = ({ children, className = '', noShadow = false }) => {
  return (
    <div className={`
      bg-white dark:bg-slate-900 
      border-2 border-black dark:border-white 
      ${noShadow ? '' : 'shadow-neo dark:shadow-neo-dark'} 
      p-6 ${className}
    `}>
      {children}
    </div>
  );
};

// Neobrutalist Button
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent1' | 'accent2' | 'danger';
  icon?: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyle = "px-6 py-3 font-bold border-2 border-black dark:border-white transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-2 justify-center";
  
  const variants = {
    primary: "bg-black text-white hover:bg-slate-800 shadow-neo dark:shadow-neo-dark dark:bg-white dark:text-black dark:hover:bg-slate-200",
    secondary: "bg-white text-black hover:bg-gray-50 shadow-neo dark:shadow-neo-dark dark:bg-slate-900 dark:text-white",
    accent1: "bg-neo-accent1 text-black hover:bg-lime-300 shadow-neo dark:shadow-neo-dark", // Lime
    accent2: "bg-neo-accent2 text-black hover:bg-cyan-300 shadow-neo dark:shadow-neo-dark", // Cyan
    danger: "bg-neo-accent3 text-black hover:bg-rose-300 shadow-neo dark:shadow-neo-dark", // Coral
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};

// Neobrutalist Input
interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="font-bold text-sm uppercase tracking-wider">{label}</label>}
      <input 
        className={`
          w-full px-4 py-3 
          bg-white dark:bg-slate-900 
          border-2 border-black dark:border-white 
          focus:outline-none focus:ring-2 focus:ring-neo-accent2 focus:border-transparent
          placeholder:text-gray-500
          ${className}
        `}
        {...props} 
      />
    </div>
  );
};

// Badge
export const NeoBadge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-gray-200' }) => {
  return (
    <span className={`
      ${color} px-3 py-1 
      border-2 border-black dark:border-white 
      text-xs font-bold uppercase tracking-wider
    `}>
      {children}
    </span>
  );
};
