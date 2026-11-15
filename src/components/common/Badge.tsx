import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'moon' | 'mars' | 'deep-space' | 'success';
  size?: 'xs' | 'sm';
  withDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'xs',
  withDot = false,
  className = '',
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 gap-1.5',
    sm: 'text-xs px-2.5 py-1 gap-2',
  };

  const variantStyles = {
    default:
      'bg-space-surface/80 text-space-muted border border-space-border',
    accent:
      'bg-space-accent-muted text-space-accent border border-space-accent/30',
    moon:
      'bg-space-moon-muted text-space-moon border border-slate-600/40',
    mars:
      'bg-space-mars-muted text-amber-400 border border-amber-500/30',
    'deep-space':
      'bg-space-deep-space-muted text-indigo-300 border border-indigo-500/30',
    success:
      'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30',
  };

  const dotColors = {
    default: 'bg-space-muted',
    accent: 'bg-space-accent',
    moon: 'bg-slate-300',
    mars: 'bg-amber-400',
    'deep-space': 'bg-indigo-400',
    success: 'bg-emerald-400',
  };

  return (
    <span
      className={`inline-flex items-center font-mono uppercase tracking-wider rounded-full font-medium ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse-subtle flex-shrink-0`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
