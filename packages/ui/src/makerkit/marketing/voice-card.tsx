"use client"
import React, { forwardRef, useState, useRef } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '../../shadcn/card';
import { Play, Pause } from 'lucide-react';
import { cn } from '../../utils';

interface VoiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  audio: string;
  image?: React.ReactNode;
}

export const VoiceCard = forwardRef<HTMLDivElement, VoiceCardProps>(
  function VoiceCardComponent(
    { className, name, description, image, audio, children, ...props },
    ref,
  ) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlayPause = () => {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg shadow-lg items-center space-x-4 bg-[#02223b]',
          className,
        )}
        {...props}
      >
        {image && (
          <div className="p-0 relative rounded-t-lg h-[180px] w-[300px] bg-[#A08FFF]">
            {image}
          </div>
        )}
        <div>
          <CardHeader>
            <CardTitle className="text-lg flex gap-2 items-center font-bold text-gray-900 dark:text-white">
              {/* Button toggles between play and pause icons */}
              <button onClick={togglePlayPause}>
                {isPlaying ? <Pause className={'h-4'} /> : <Play className={'h-4'} />}
              </button>
              {name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300 whitespace-normal">
              {description}
            </CardDescription>
          </CardHeader>
          {/* Audio element with ref */}
          <audio ref={audioRef} src={audio} onEnded={() => setIsPlaying(false)} />
        </div>
      </div>
    );
  },
);
