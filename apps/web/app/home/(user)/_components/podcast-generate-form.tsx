'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea-word-limit';
import { toast } from 'sonner';
import { generateContent, generatePodcast } from '~/home/(user)/_lib/server/server-actions';
import { useRevalidatePersonalAccountCreditQuery,usePersonalAccountCredit } from '../../../../../../packages/features/accounts/src/hooks/use-personal-account-credit-data';
import { ContentGenerateSchema } from '~/home/(user)/_lib/content-generate.schema';
import { PodcastGenerateSchema } from '~/home/(user)/_lib/podcast-generate.schema';
import { convertIntervalToSeconds } from '~/lib/helpers';

export function PodcastGenerateForm(
  props: React.PropsWithChildren<{
    userId: string;
  }>,
) {
  const revalidateCredits = useRevalidatePersonalAccountCreditQuery();
  const { data: user} = usePersonalAccountCredit(props.userId);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPodcastLoading, setIsPodcastLoading] = useState(false);
  const [state, setState] = useState({success: false,error: false,});
  const accountId = props.userId;
  const contentForm = useForm({
    resolver: zodResolver(ContentGenerateSchema),
    defaultValues: {
      topic: '',
    },
  });

  const podcastForm = useForm({
    resolver: zodResolver(PodcastGenerateSchema),
    defaultValues: {
      content: '',
    },
  });

  const handleGenerateContent = async () => {
    setIsLoading(true);
    try {
      const data = await generateContent({ topic, accountId });
      setContent(data.response);
      toast.success('Content Generate Successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePodcast = async () => {
    setIsPodcastLoading(true);
    try {
      const data = await generatePodcast({ content, accountId });
      setAudioSrc(data.audioUrl);
      setState({ success: true, error: false });
      revalidateCredits(props.userId);
      toast.success('Podcast Generate Successfully');
    } catch (error:any) {
      console.error('Error:', error);
      toast.error(error.message||'An error occurred while generating podcast. Please try again.');
      setState({ error: true, success: false });
    } finally {
      setIsPodcastLoading(false);
    }
  };
  const currentCreditInSeconds = convertIntervalToSeconds(user?.credit ? user?.credit:'00:00:00');
  return (
    <>
      {/* Form for generating content */}
      {!user?.tier &&      
      <Alert variant={'destructive'} className="my-4">
          <AlertTitle>No Subscription Found</AlertTitle>
          <AlertDescription>Please Subscribe Plan for Generating Podcast.</AlertDescription>
        </Alert>
      }
      {user?.tier && currentCreditInSeconds<=0 &&<Alert variant={'destructive'} className="my-4">
          <AlertTitle>Limit Reached</AlertTitle>
          <AlertDescription>You have reached your limit. Please wait, or your credits will renew next month.</AlertDescription>
        </Alert>}
      <Form {...contentForm}>
        <form className="flex flex-col space-y-4">
          <FormField
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter podcast topic"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='bg-[#A08FFF] hover:bg-[#7f69f9] text-white w-fit' onClick={handleGenerateContent} disabled={isLoading || !topic ||isPodcastLoading || !user?.tier || user?.credit==='00:00:00'}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Generating Content...
              </>
            ) : (
              'Generate Content'
            )}
          </Button>
        </form>
      </Form>

      {/* Form for generating podcast */}
      <Form {...podcastForm}>
        <form className="flex flex-col space-y-4 mt-8">
          <FormField
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    maxWords={user?.tier && user?.tier!="Free"?5000:2000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Edit your podcast content"
                    rows={10}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className='bg-[#A08FFF] hover:bg-[#7f69f9] text-white w-fit' onClick={handleGeneratePodcast} disabled={!content || isLoading ||isPodcastLoading || !user?.tier || user?.credit==='00:00:00'}>
            {isPodcastLoading ? (
              <>
                <span className="spinner"></span>
                Generating Podcast...
              </>
            ) : (
              'Generate Podcast'
            )}
          </Button>
        </form>
      </Form>

      {audioSrc && (
        <div className="audio-player mt-8">
          <audio controls src={audioSrc} className='w-full'>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {state.success && (
        <Alert variant={'success'} className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your podcast has been successfully generated.</AlertDescription>
        </Alert>
      )}

      {state.error && (
        <Alert variant={'destructive'} className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>There was an error generating your podcast.</AlertDescription>
        </Alert>
      )}
    </>
  );
}
