import React, { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
} from 'lucide-react';
import { Panel } from '@/components/common/Panel';
import type { EquipmentImage } from '@/types';

interface ImageGalleryProps {
  images?: EquipmentImage[];
  equipmentName: string;
  accentColor: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  equipmentName,
  accentColor,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const hasImages = images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (!hasImages) return;
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [hasImages, images.length]);

  const handleNext = useCallback(() => {
    if (!hasImages) return;
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [hasImages, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  return (
    <Panel variant="default" padding="md" className="flex flex-col gap-4">
      {/* Gallery Header */}
      <div className="flex items-center justify-between pb-3 border-b border-space-border/50">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center border"
            style={{
              backgroundColor: `${accentColor}15`,
              borderColor: `${accentColor}35`,
              color: accentColor,
            }}
          >
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Historical Archival Gallery</h3>
            <p className="text-[10px] font-mono text-space-subtle">
              {hasImages
                ? `${images.length} verified NASA primary photo records`
                : 'Awaiting Supabase storage bucket sync (Prompt 8)'}
            </p>
          </div>
        </div>

        {hasImages && (
          <span className="text-xs font-mono text-space-muted">
            {selectedIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Main Preview or Graceful Empty State */}
      {hasImages && currentImage ? (
        <div className="flex flex-col gap-3">
          <div className="relative group w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-space-darkest border border-space-border/60 flex items-center justify-center">
            <img
              src={currentImage.storage_path}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Lightbox Trigger */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-lg bg-space-darkest/80 border border-space-border text-space-muted hover:text-white hover:bg-space-surface transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
              title="Expand to Fullscreen"
              aria-label="Expand image to fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Previous / Next Overlay Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-space-darkest/80 border border-space-border text-space-muted hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-space-darkest/80 border border-space-border text-space-muted hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Caption Box */}
          <div className="text-xs text-space-muted leading-relaxed font-mono bg-space-surface/40 p-2.5 rounded-lg border border-space-border/40">
            <div className="text-white font-semibold mb-0.5">{currentImage.title}</div>
            <div>{currentImage.caption}</div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border transition-all ${
                    selectedIndex === idx
                      ? 'border-space-accent ring-2 ring-space-accent/40 scale-105'
                      : 'border-space-border/60 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}: ${img.title}`}
                >
                  <img
                    src={img.storage_path}
                    alt={img.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full py-12 flex flex-col items-center justify-center text-center rounded-xl bg-space-surface/30 border border-dashed border-space-border/60 p-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
            style={{
              backgroundColor: `${accentColor}12`,
              color: accentColor,
            }}
          >
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            Archival Images Ingest Pending
          </h4>
          <p className="text-xs text-space-muted max-w-sm leading-relaxed mb-3">
            Five high-resolution NASA historical photographs for {equipmentName} will populate from
            the Supabase storage bucket in Prompt 8.
          </p>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-space-subtle bg-space-darkest/60 px-3 py-1 rounded-md border border-space-border/40">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span>Ready for <code>equipment_images</code> binding</span>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 p-2 text-space-muted hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Fullscreen Image */}
            <img
              src={currentImage.storage_path}
              alt={currentImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl border border-space-border shadow-2xl"
            />

            {/* Lightbox Info */}
            <div className="mt-4 text-center max-w-2xl">
              <h4 className="text-sm font-bold text-white mb-1">{currentImage.title}</h4>
              <p className="text-xs text-space-muted font-mono">{currentImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};
