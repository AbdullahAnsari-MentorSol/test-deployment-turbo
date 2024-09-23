"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '../../shadcn/slider';
import { PlayIcon, PauseIcon } from '@radix-ui/react-icons';

interface MusicPlayerProps {
  fileUrl: string; 
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ fileUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;

    const newProgress = value[0] ?? 0; // Use nullish coalescing to default to 0 if undefined
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  // Format time to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (!audioRef.current) return;

    // Set duration when metadata is loaded
    const setAudioDuration = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    audioRef.current.addEventListener('loadedmetadata', setAudioDuration);

    // Cleanup the event listener on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
      }
    };
  }, [fileUrl]); // Re-run this effect if the file URL changes

  useEffect(() => {
    if (!audioRef.current) return;

    // Update current time while playing
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    };

    audioRef.current.addEventListener('timeupdate', updateCurrentTime);

    // Cleanup the event listener on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateCurrentTime);
      }
    };
  }, []);

  return (
    <div className="music-player lg:flex gap-2">
      <audio ref={audioRef} src={fileUrl} />
      <div className="controls">
        <button onClick={togglePlayPause}>
          <div className="bg-[#A08FFF] rounded-full p-4 w-fit">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </div>
        </button>
        {/* <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.currentTime -= 10;
          }}
        >
          Rewind
        </button>
        <button
          onClick={() => {
            if (!audioRef.current) return;
            audioRef.current.currentTime += 10;
          }}
        >
          Fast Forward
        </button> */}
      </div>
      <div className='w-full'>
      <div className="time-display mb-1 text-right">
        <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[progress]}
        onValueChange={handleProgressChange}
        min={0}
        max={100}
        step={1}
      />
      </div>
    </div>
  );
};

export default MusicPlayer;
