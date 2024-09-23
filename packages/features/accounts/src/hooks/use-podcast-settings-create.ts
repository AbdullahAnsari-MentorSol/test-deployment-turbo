import { useMutation } from '@tanstack/react-query';
import { Database } from '@kit/supabase/database';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

type CreateData = Database['public']['Tables']['podcast_settings']['Insert'];

export function useCreatePodcastSettings(accountId: string) {
  const client = useSupabase();

  // Mutation key based on account ID
  const mutationKey = ['podcast:settings', accountId];

  // Mutation function to create podcast settings
  const mutationFn = async (data: CreateData) => {    
    // Ensure the account_id is included in the data to link it to the account
    const response = await client
      .from('podcast_settings')
      .insert({
        ...data,
        account_id: accountId, // Linking the setting to the correct account
      });

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
