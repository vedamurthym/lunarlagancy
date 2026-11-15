import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { Orbit, Compass, Moon, Sparkles } from 'lucide-react';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-space-darkest text-space-text bg-cosmic-grid selection:bg-space-accent/25 selection:text-white">
      {/* Top Mission Navigation */}
      <Navbar />

      {/* Main Mission Viewport */}
      <main className="flex-1 flex flex-col relative z-10">
        <Outlet />
      </main>

      {/* Minimal Scientific Footer */}
      <footer className="border-t border-space-border/50 bg-space-dark/80 py-6 text-xs text-space-muted relative z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <span className="font-semibold text-white tracking-wide">
              SPACE HERITAGE EXPLORER
            </span>
            <span className="hidden sm:inline text-space-border">•</span>
            <span className="text-space-subtle font-mono text-[11px]">
              Documenting Humanity's Planetary Footsteps
            </span>
          </div>

          <div className="flex items-center gap-4 text-space-subtle font-mono text-[11px]">
            <span className="flex items-center gap-1.5 hover:text-space-moon transition-colors">
              <Moon className="w-3 h-3 text-space-moon" /> Moon
            </span>
            <span className="text-space-border">•</span>
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <Compass className="w-3 h-3 text-amber-500" /> Mars
            </span>
            <span className="text-space-border">•</span>
            <span className="flex items-center gap-1.5 hover:text-indigo-300 transition-colors">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Deep Space
            </span>
            <span className="text-space-border">•</span>
            <span className="flex items-center gap-1.5 text-space-accent">
              <Orbit className="w-3 h-3" /> Earth Hub
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
