import React, { useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import type { EquipmentImage } from '@/types';

interface SectionImageProps {
  image: EquipmentImage;
  accentColor?: string;
}

/**
 * SectionImage — A historical image placed alongside a mission information section.
 * Clicking opens a lightbox with the full-resolution image.
 */
export const SectionImage: React.FC<SectionImageProps> = ({ image, accentColor }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      {/* Inline image card */}
      <div className="mt-4 group">
        <div
          className="relative rounded-xl overflow-hidden border border-space-border/50 bg-space-darkest cursor-pointer transition-colors"
          style={accentColor ? { borderColor: `${accentColor}40` } : undefined}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={image.storage_path}
            alt={image.title}
            loading="lazy"
            className="w-full h-auto max-h-64 sm:max-h-72 object-contain bg-space-darkest transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Expand overlay icon */}
          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-space-darkest/70 border border-space-border/50 text-space-muted opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>
        {/* Caption */}
        <div className="mt-2 px-1">
          <p className="text-[11px] font-mono text-space-muted leading-relaxed">
            <span className="font-semibold text-white/80">{image.title}</span>
            {image.caption && (
              <span className="text-space-subtle"> — {image.caption}</span>
            )}
          </p>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 p-2 text-space-muted hover:text-white transition-colors"
              aria-label="Close image"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={image.storage_path}
              alt={image.title}
              className="max-w-full max-h-[78vh] object-contain rounded-xl border border-space-border shadow-2xl"
            />

            <div className="mt-4 text-center max-w-2xl">
              <h4 className="text-sm font-bold text-white mb-1">{image.title}</h4>
              {image.caption && (
                <p className="text-xs text-space-muted font-mono">{image.caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
