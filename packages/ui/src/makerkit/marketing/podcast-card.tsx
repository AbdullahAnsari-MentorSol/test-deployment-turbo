import React, { forwardRef } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle, } from '../../shadcn/card';
import { Play} from 'lucide-react';
import { cn } from '../../utils';
import MusicPlayer from './mp3-player';

interface PodcastCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subTitle: string;
  description?: string;
  file: string;
  image?: React.ReactNode;
}

export const PodcastCard = forwardRef<HTMLDivElement, PodcastCardProps>(
  function PodcastCardComponent(
    { className, title,subTitle, description, image, file,children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-2 ring-2 ring-gray-100 dark:ring-primary/10 space-x-4 max-w-[300px]',
          className,
        )}
        {...props}
      >
        {image && (
          <div className="box-border m-auto relative rounded-lg h-[220px] max-w-[275px] lg:min-w-[275px]">
            {image}
          </div>
        )}
        <div>
          <CardHeader>
            <CardTitle className="text-lg items-center font-bold text-gray-900 dark:text-white">{title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-300 whitespace-normal">
              {subTitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2">
            <MusicPlayer fileUrl={file}/>
          </CardContent>
        </div>
      </div>
    );
  },
);