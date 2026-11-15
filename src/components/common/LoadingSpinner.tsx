import React from 'react';

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Synchronizing orbital telemetry...',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center select-none ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={`relative ${sizeMap[size]} mb-4`}>
        {/* Outer orbital track */}
        <div className="absolute inset-0 rounded-full border border-space-border/60" />
        
        {/* Primary rotating orbital beacon */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-space-accent animate-spin" />
        
        {/* Inner reverse orbit */}
        <div
          className="absolute inset-1.5 rounded-full border border-transparent border-b-cyan-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.8s' }}
        />
        
        {/* Core signal beacon */}
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-space-accent shadow-glow-accent animate-pulse-subtle" />
      </div>

      {message && (
        <p className="text-xs font-mono uppercase tracking-wider text-space-muted">
          {message}
        </p>
      )}
    </div>
  );
};
