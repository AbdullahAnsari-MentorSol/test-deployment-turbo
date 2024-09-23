import * as React from 'react';
import { cn } from '../utils/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  maxWords?: number; // New prop to handle max words
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxWords, value = '', onChange, ...props }, ref) => {
    const [wordCount, setWordCount] = React.useState(0);

    // Helper function to count words
    const countWords = (text: string) => {
      return text.trim().split(/\s+/).filter(Boolean).length; // Split on spaces and filter out empty strings
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const words = countWords(newValue);

      // Only allow change if word count is within maxWords limit
      if (!maxWords || words <= maxWords) {
        setWordCount(words);
        if (onChange) onChange(e); // Forward the change event
      } else {
        // If user exceeds the word count limit, slice the input to match the word limit
        const trimmedValue = newValue
          .split(/\s+/)
          .slice(0, maxWords)
          .join(' ');

        setWordCount(maxWords);

        // Create a synthetic event with the trimmed value
        const event = { ...e, target: { ...e.target, value: trimmedValue } };
        if (onChange) onChange(event as React.ChangeEvent<HTMLTextAreaElement>);
      }
    };

    React.useEffect(() => {
      setWordCount(countWords(value?.toString() || ''));
    }, [value]);

    return (
      <div className="relative">
        <textarea
          className={cn(
            'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {maxWords && (
          <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
            {wordCount}/{maxWords} words
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
