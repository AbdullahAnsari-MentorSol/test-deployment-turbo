import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useCallback } from 'react';


export function usePodcastSettingsData(
    accountId: string,
    partialPodcastSettings?:
      | {
          id: string | null;
          podcast_prompt: string | null;
          brand_information: string | null;
          speaker1: string | null;
          speaker2: string | null;
          cta: string | null;
          style: string[] | null;
          number_of_words: number | null;
          no_of_speakers: number | null;
          voice1: any | null; // Adjust `any` to a specific type if available
          voice2: any | null; // Adjust `any` to a specific type if available
          ai_model: any | null; // Adjust `any` to a specific type if available
          search_the_web: boolean | null;
          quality: 'HD' | 'SD' | null;
        }
      | undefined,
  ) {
    const client = useSupabase();
    const queryKey = ['podcast:settings', accountId];
  
    const queryFn = async () => {
      if (!accountId) {
        return null;
      }
  
      const response = await client
        .from('podcast_settings')
        .select(`
          id,
          podcast_prompt,
          brand_information,
          style,
          number_of_words,
          voice1,
          voice2,
          ai_model,
          search_the_web,
          quality,
          cta,
          speaker1,
          speaker2,
          no_of_speakers
        `)
        .eq('account_id', accountId)
        .single();
  
      if (response.error) {
        throw response.error;
      }
  
      return response.data;
    };
  
    return useQuery({
      queryKey,
      queryFn,
      enabled: !!accountId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      initialData: partialPodcastSettings?.id
        ? {
            id: partialPodcastSettings.id,
            podcast_prompt: partialPodcastSettings.podcast_prompt,
            brand_information: partialPodcastSettings.brand_information,
            style: partialPodcastSettings.style,
            number_of_words: partialPodcastSettings.number_of_words,
            voice1: partialPodcastSettings.voice1,
            voice2: partialPodcastSettings.voice2,
            cta: partialPodcastSettings.cta,
            no_of_speakers: partialPodcastSettings.no_of_speakers,
            speaker1: partialPodcastSettings.speaker1,
            speaker2: partialPodcastSettings.speaker2,
            ai_model: partialPodcastSettings.ai_model,
            search_the_web: partialPodcastSettings.search_the_web,
            quality: partialPodcastSettings.quality,
          }
        : undefined,
    });
  }
  
  
  export function useRevalidatePodcastSettingsQuery() {
    const queryClient = useQueryClient();
  
    return useCallback(
      (accountId: string) =>
        queryClient.invalidateQueries({
          queryKey: ['podcast:settings', accountId],
        }),
      [queryClient],
    );
  }