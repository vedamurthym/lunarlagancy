import React from 'react';
import { Database } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data In Range',
  description = 'No telemetry or planetary artifacts match the current query parameters.',
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl glass-panel border border-dashed border-space-border/80 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-space-surface border border-space-border flex items-center justify-center text-space-muted mb-4 shadow-panel">
        {icon || <Database className="w-6 h-6 text-space-accent" />}
      </div>
      <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-space-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
