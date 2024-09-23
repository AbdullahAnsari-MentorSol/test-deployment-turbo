'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../../utils';

interface SliderProps {
  children: React.ReactNode;
  slideSpeed?: number; // Speed of the scroll in milliseconds per step
}

const VoiceSlider: React.FC<SliderProps> = ({ children, slideSpeed = 10 }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    // Scroll logic
    const scrollContent = () => {
      // Scroll one pixel per interval
      slider.scrollLeft += 1;

      // If scrolled to the end, reset to start (simulating infinite scroll)
      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
    };

    let interval: NodeJS.Timeout | undefined;

    // Start scrolling only when not hovered
    if (!isHovered) {
      interval = setInterval(scrollContent, slideSpeed); // Control speed via slideSpeed
    }

    // Clean up
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, slideSpeed]);

  return (
    <div
      ref={sliderRef}
      className={cn('flex overflow-hidden whitespace-nowrap')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'hidden',
      }}
    >
      <div style={{ display: 'flex', gap: '16px' }}>
        {children}
        {children}
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {children}
        {children}
      </div>
    </div>
  );
};

export default VoiceSlider;
