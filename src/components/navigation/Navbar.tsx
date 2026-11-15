import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Moon, Rocket, Sparkles, Orbit, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu automatically on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: 'Earth Hub', path: '/', icon: Orbit, subtitle: 'Launch Portal' },
    { name: 'Moon', path: '/moon', icon: Moon, subtitle: 'Apollo & Surveyor' },
    { name: 'Mars', path: '/mars', icon: Compass, subtitle: 'Rovers & Landers' },
    { name: 'Deep Space', path: '/deep-space', icon: Sparkles, subtitle: 'Outer Probes' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-space-darkest/85 border-b border-space-border/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Telemetry Identity */}
          <NavLink
            to="/"
            className="flex items-center gap-3 text-white font-semibold tracking-wider text-base sm:text-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-space-accent flex items-center justify-center shadow-sm shadow-sky-500/30 group-hover:shadow-glow-accent transition-all duration-300">
              <Rocket className="w-5 h-5 text-white transform -rotate-45 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white leading-none">
                SPACE HERITAGE <span className="text-space-accent font-light">EXPLORER</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-space-subtle uppercase mt-0.5">
                Planetary Artifact Archive
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-space-surface text-space-accent border border-space-accent/40 shadow-sm shadow-space-accent/10'
                        : 'text-space-muted hover:text-white hover:bg-space-surface/50 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-space-muted hover:text-white hover:bg-space-surface border border-space-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-space-border/80 bg-space-darkest/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-space-subtle px-3 py-1">
            EXPLORATION DOMAINS
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-space-surface text-space-accent border border-space-accent/30 font-semibold'
                      : 'text-space-muted hover:text-white hover:bg-space-surface/50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] text-space-subtle font-sans normal-case">
                  {item.subtitle}
                </span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
};
