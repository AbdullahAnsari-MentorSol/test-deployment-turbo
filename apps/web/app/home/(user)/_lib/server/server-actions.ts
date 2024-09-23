'use server';

import { fetchWithInterceptor } from 'api';

import { createAccountsApi } from '@kit/accounts/api';
import { enhanceAction } from '@kit/next/actions';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import settingsConfig from '~/config/podcast-settings.config';

import { ContentGenerateSchema } from '../content-generate.schema';
import { PodcastGenerateSchema } from '../podcast-generate.schema';
import { convertIntervalToSeconds, convertSecondsToInterval } from '~/lib/helpers';

interface GeneratedContentResponse {
  response: string;
}
interface GeneratedFileResponse {
  mp3_base64: string;
  duration_seconds: string;
}
export const generateContent = enhanceAction(
  async (data: { topic: string; accountId: string }) => {
    const client = getSupabaseServerClient();
    const api = createAccountsApi(client);
    const settings = await api.getPodcastSettings(data.accountId);
    const generatedContent =
      await fetchWithInterceptor<GeneratedContentResponse>('/topic', {
        topic: data.topic,
        settings: settings || settingsConfig,
      });
    if(!generatedContent?.data?.response){
      throw new Error(`Failed to create content`);
    }
    return { response: generatedContent?.data?.response || '' };
  },
  {
    schema: ContentGenerateSchema,
    auth: true,
  },
);

function createBase64AudioUrl(
  base64Data: string,
  mimeType: string = 'audio/mpeg',
): string {
  return `data:${mimeType};base64,${base64Data}`;
}
export const generatePodcast = enhanceAction(
  async (data: {
    content: string;
    accountId: string;
  }): Promise<{ audioUrl: string }> => {
    const client = getSupabaseServerClient();
    const api = createAccountsApi(client);
    
    const user = await api.getAccount(data.accountId);
    const currentCreditInSeconds = convertIntervalToSeconds(user.credit);
    
    if(currentCreditInSeconds<=0){
      throw new Error('Insufficient credit to generate the podcast.');
    }

    const settings = await api.getPodcastSettings(data.accountId);
    const generatedFile = await fetchWithInterceptor<GeneratedFileResponse>(
      '/podcast',
      { script: data.content, settings: settings || settingsConfig },
    );
    const base64Audio = generatedFile.data?.mp3_base64;
    if (!base64Audio) {
      throw new Error('Failed to generate podcast audio.');
    }
    const podcastLengthInSeconds = generatedFile.data?.duration_seconds  && parseFloat(generatedFile.data?.duration_seconds) || 0;
    
    const updatedCreditInSeconds = currentCreditInSeconds - podcastLengthInSeconds; 

    const audioUrl = createBase64AudioUrl(base64Audio, 'audio/mpeg');
    const podcastDetail = {
      podcastTitle: 'Generated Podcast',
      podcastAudioLength: generatedFile.data?.duration_seconds||'',
      podcastAudio: '',
      accountId: data.accountId,
    };
    const result = await api.addPodcastDetail(podcastDetail);

    if (updatedCreditInSeconds < 0) {
      throw new Error('Insufficient credit to generate the podcast.');
    }

    // Convert updated credit back to PostgreSQL INTERVAL format
    const updatedCreditInterval = convertSecondsToInterval(updatedCreditInSeconds);
    console.log(updatedCreditInterval,generatedFile.data?.duration_seconds,"Interval seconds")
    // Update the account credit
    await api.updateAccountCredit(data.accountId, updatedCreditInterval);

    if (result.error) {
      throw new Error(`Failed to store podcast details: ${result.error}`);
    }
    return { audioUrl };
  },
  {
    schema: PodcastGenerateSchema,
    auth: true,
  },
);