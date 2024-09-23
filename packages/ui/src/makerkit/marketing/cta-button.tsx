import { forwardRef } from 'react';

import { Button } from '../../shadcn/button';
import { cn } from '../../utils';

export const CtaButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(function CtaButtonComponent({ className, children, ...props }, ref) {
  return (
    <Button
      className={cn(
        'h-12 rounded-xl text-white bg-[#A08FFF] px-4 text-base font-semibold transition-all hover:bg-[#9d8cff] dark:shadow-primary/30',
        className,
      )}
      asChild
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  );
});
