import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Orbit, AlertTriangle, ArrowRight } from 'lucide-react';
import { Panel } from './Panel';
import { Badge } from './Badge';

export const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">
      <Panel variant="hud" padding="lg" className="max-w-lg w-full">
        <div className="mb-4 flex justify-center">
          <Badge variant="accent" withDot size="sm">
            ERROR 404 • SIGNAL LOST
          </Badge>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Uncharted Coordinate Sector
        </h1>
        <p className="text-sm text-space-muted mb-8 leading-relaxed max-w-sm mx-auto">
          The requested space sector or equipment registry ID does not correspond to an active planetary telemetry station.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-space-accent text-space-darkest font-semibold text-sm hover:bg-space-accent-hover transition-all shadow-sm shadow-space-accent/20"
          >
            <Orbit className="w-4 h-4" />
            <span>Earth Station</span>
          </Link>
          <Link
            to="/moon"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-space-surface border border-space-border text-white text-sm hover:bg-space-surface-elevated hover:border-space-border/80 transition-all"
          >
            <Compass className="w-4 h-4 text-space-accent" />
            <span>Moon Orbit</span>
            <ArrowRight className="w-3.5 h-3.5 text-space-muted" />
          </Link>
        </div>
      </Panel>
    </div>
  );
};
