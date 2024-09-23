import { useMutation } from '@tanstack/react-query';
import { Database } from '@kit/supabase/database';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

type UpdateData = Database['public']['Tables']['podcast_settings']['Update'];

export function useUpdatePodcastSettings(accountId: string, podcastSettingId: string) {
  const client = useSupabase();

  // Mutation key based on account and podcast setting IDs
  const mutationKey = ['podcast:settings', accountId, podcastSettingId];

  // Mutation function to update podcast settings
  const mutationFn = async (data: UpdateData) => {
    const response = await client
      .from('podcast_settings')
      .update(data)
      .match({ id: podcastSettingId, account_id: accountId });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
}