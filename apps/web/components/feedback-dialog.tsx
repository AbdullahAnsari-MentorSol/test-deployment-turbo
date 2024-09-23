'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { z } from 'zod';

// Define a feedback form schema using Zod
const FeedbackSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  comment: z.string().min(5, 'Comment must be at least 5 characters long'),
  rating: z.string()
});

export function FeedbackFormDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            We would love to hear your thoughts or suggestions!
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}

function FeedbackForm({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(FeedbackSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues: {
      email: '',
      comment: '',
      rating: '1',
    },
  });

  const onSubmit = (data: z.infer<typeof FeedbackSchema>) => {
    startTransition(async () => {
      try {
        console.log('Feedback submitted:', data);

        setIsOpen(false);
      } catch {
        setError(true);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={'flex flex-col space-y-6'}
      >
        <If condition={error}>
          <FeedbackErrorAlert />
        </If>

        <FormField
          name={'email'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={'comment'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder="Share your thoughts"
                  className="textarea"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name={'rating'}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="number"
                  min="1"
                  max="5"
                  className="input"
                  placeholder="Rate from 1 to 5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          Submit Feedback
        </Button>
      </form>
    </Form>
  );
}

function FeedbackErrorAlert() {
  return (
    <Alert variant={'destructive'}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>There was a problem submitting your feedback.</AlertDescription>
    </Alert>
  );
}
