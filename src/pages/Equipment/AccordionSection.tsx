import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MissionSection } from './missionData';
import type { EquipmentImage } from '@/types';
import { SectionImage } from './SectionImage';

interface AccordionSectionProps {
  section: MissionSection;
  index: number;
  accentColor: string;
  defaultOpen?: boolean;
  /** Optional historical image to display alongside this section's content */
  image?: EquipmentImage;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({
  section,
  index,
  accentColor,
  defaultOpen = false,
  image,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const sectionNumber = String(index + 1).padStart(2, '0');

  return (
    <div className="border border-space-border/60 rounded-xl overflow-hidden bg-space-surface/40 hover:border-space-border transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-space-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-space-accent"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
          {/* Section index badge */}
          <span
            className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold border"
            style={{
              backgroundColor: `${accentColor}12`,
              borderColor: `${accentColor}40`,
              color: accentColor,
            }}
          >
            {sectionNumber}
          </span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base sm:text-lg select-none">{section.icon}</span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase truncate">
              {section.title}
            </h3>
          </div>
        </div>

        <div
          className={`flex-shrink-0 w-6 h-6 rounded-md border border-space-border/60 flex items-center justify-center text-space-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180 bg-space-surface text-white' : ''
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </button>

      {/* Expandable Content Container */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="px-5 pb-5 pt-1 border-t border-space-border/30">
          <p className="text-xs sm:text-sm text-space-muted leading-relaxed whitespace-pre-line font-sans">
            {section.content}
          </p>

          {/* Historical image placed inside this section */}
          {image && (
            <SectionImage image={image} accentColor={accentColor} />
          )}
        </div>
      </div>
    </div>
  );
};
