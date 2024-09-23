"use client";
import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { FeedbackFormDialog } from './feedback-dialog';

export default function FeedbackUser() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const openFeedbackForm = () => setIsFeedbackOpen(true);

  return (
    <>
      {/* A Button to Open the Feedback Form */}
      <Button className="absolute right-3 bottom-3 z-20" onClick={openFeedbackForm}>Give Feedback</Button>

      {/* Feedback Form Dialog Component */}
      <FeedbackFormDialog
        isOpen={isFeedbackOpen}
        setIsOpen={setIsFeedbackOpen}
      />
    </>
  );
}
