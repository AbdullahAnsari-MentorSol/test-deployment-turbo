// import * as React from 'react';

// import { cn } from '../utils/cn';

// export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
//           className,
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   },
// );
// Textarea.displayName = 'Textarea';

// export { Textarea };

import * as React from 'react';
import { cn } from '../utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, value, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(value?.toString().length || 0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCharCount(newValue.length);
      if (onChange) onChange(e); 
    };

    React.useEffect(() => {
      setCharCount(value?.toString().length || 0);
    }, [value]);

    return (
      <div className="relative">
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          maxLength={maxLength} 
          value={value}
          onChange={handleChange} 
          {...props}
        />
        {maxLength && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };

