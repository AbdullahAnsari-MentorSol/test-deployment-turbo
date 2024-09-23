import React, { forwardRef } from 'react';

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shadcn/card';
import { cn } from '../../utils';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  description: string;
  image?: React.ReactNode;
  icon?: React.ReactNode;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  function FeatureCardComponent(
    { className, label, description, image,icon, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-2 ring-2 ring-gray-100 dark:ring-primary/10',
          className,
        )}
        {...props}
      >
        {image && (
          <div className="box-border m-auto relative rounded-lg h-[220px]">
            {image}
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{label}</CardTitle>
          <CardDescription className="max-w-xs text-sm font-semibold tracking-tight text-current">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </div>
    );
  },
);
