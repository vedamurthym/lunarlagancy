import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'hud';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'glass-panel rounded-2xl shadow-panel',
    elevated: 'glass-panel-elevated rounded-2xl shadow-panel',
    interactive:
      'glass-panel rounded-2xl shadow-panel hover:shadow-panel-hover hover:border-space-accent/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer',
    hud: 'glass-panel rounded-xl hud-bracket shadow-panel',
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
