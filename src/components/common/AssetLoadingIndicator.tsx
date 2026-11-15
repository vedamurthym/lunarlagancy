import React from 'react';
import { useProgress } from '@react-three/drei';
import { AlertCircle } from 'lucide-react';

interface AssetLoadingIndicatorProps {
  label?: string;
  accentColor?: string;
  className?: string;
  inline?: boolean;
}

export const AssetLoadingIndicator: React.FC<AssetLoadingIndicatorProps> = ({
  label = 'Streaming 3D Telemetry',
  accentColor = '#38bdf8',
  className = '',
  inline = false,
}) => {
  const { active, progress, errors, item, loaded, total } = useProgress();

  if (!active && progress === 100 && errors.length === 0) {
    return null;
  }

  const roundedProgress = Math.min(100, Math.round(progress));

  // Extract clean filename from path
  const currentItem = item ? item.split('/').pop()?.split('?')[0] : '';

  if (inline) {
    return (
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-space-darkest/90 border border-space-border/60 text-xs font-mono backdrop-blur-md ${className}`}
      >
        <div
          className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
          style={{ borderColor: accentColor, borderTopColor: 'transparent' }}
        />
        <span className="text-white font-medium">{roundedProgress}%</span>
        {currentItem && (
          <span className="text-space-subtle text-[10px] truncate max-w-[120px]">
            {currentItem}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center bg-space-darkest/85 backdrop-blur-sm z-30 pointer-events-none p-6 ${className}`}
    >
      <div className="flex flex-col items-center gap-3.5 max-w-xs w-full text-center">
        {/* Animated Pulsing Ring */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: `${accentColor}33`,
              borderTopColor: accentColor,
            }}
          />
          <span
            className="absolute font-mono text-xs font-bold"
            style={{ color: accentColor }}
          >
            {roundedProgress}%
          </span>
        </div>

        {/* Title & Item details */}
        <div>
          <h4 className="text-sm font-semibold text-white tracking-wide mb-0.5">
            {label}
          </h4>
          <p className="text-[11px] font-mono text-space-subtle">
            {loaded} of {total || 1} assets cached
          </p>
          {currentItem && (
            <p className="text-[10px] font-mono text-space-muted truncate max-w-[220px] mt-1 mx-auto">
              {currentItem}
            </p>
          )}
        </div>

        {/* Real Progress Bar */}
        <div className="w-full bg-space-surface border border-space-border rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${roundedProgress}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>

        {/* Error Notification */}
        {errors.length > 0 && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-[10px] font-mono text-red-200 mt-2 text-left">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span>Asset stream interrupted. Falling back to local twin.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetLoadingIndicator;
