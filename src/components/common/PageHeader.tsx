import React from 'react';
import { Badge } from './Badge';

export interface PageHeaderProps {
  destination: string;
  title: string;
  subtitle: string;
  badge?: string;
  coordinates?: string;
  badgeVariant?: 'default' | 'accent' | 'moon' | 'mars' | 'deep-space';
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  destination,
  title,
  subtitle,
  badge,
  coordinates,
  badgeVariant = 'accent',
  children,
}) => {
  return (
    <div className="border-b border-space-border/60 bg-gradient-to-b from-space-dark/90 via-space-dark/50 to-transparent py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          {/* Top Metadata Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-space-accent font-semibold">
              {destination}
            </span>
            {badge && (
              <Badge variant={badgeVariant} size="xs" withDot>
                {badge}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-space-muted max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Right side controls or telemetry coordinates */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {coordinates && (
            <div className="font-mono text-xs text-space-muted bg-space-surface/80 border border-space-border px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-panel">
              <span className="w-1.5 h-1.5 rounded-full bg-space-accent animate-pulse-subtle" />
              <span className="text-space-subtle text-[11px]">COORDS:</span>
              <span className="text-space-accent font-medium">{coordinates}</span>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
