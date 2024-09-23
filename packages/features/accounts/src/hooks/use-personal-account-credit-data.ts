import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

// Create a map to store the total time for each plan variant
const variantToTimeMap: { [key: string]: string } = {
    'price_1PzhAWJglZdczVxbd00Rhoiv': '00:05:00',  // Free Monthly (5 minutes)
    'free-yearly': '00:05:00',                    // Free Yearly (5 minutes)
    'price_1PuqsgJglZdczVxbw9H43ZBe': '01:00:00',  // Starter Monthly (60 minutes = 1 hour)
    'starter-yearly': '01:00:00',                 // Starter Yearly (60 minutes = 1 hour)
    'price_1PuqxUJglZdczVxbJNndtvd3': '02:40:00', // Pro Monthly (160 minutes = 2 hours 40 minutes)
    'pro-yearly': '02:40:00',                     // Pro Yearly (160 minutes = 2 hours 40 minutes)
    'price_1PuqyBJglZdczVxbfvPOMhqI': 'Custom',   // Enterprise Monthly (Custom)
    'enterprise-yearly': 'Custom'                 // Enterprise Yearly (Custom)
  };
  

export function usePersonalAccountCredit(
  userId: string,
  partialAccount?: {
    id: string | null;
    credit: string | null;
    name: string | null;
    tier: string | null;
    variant_id: string | null;
  } | undefined,
) {
  const client = useSupabase();
  const queryKey = ['account:credit', userId];

  const queryFn = async () => {
    if (!userId) {
      return null;
    }

    // Fetch account information from the accounts table
    const accountResponse = await client
      .from('accounts')
      .select(
        `
        id,
        name,
        credit
    `,
      )
      .eq('primary_owner_user_id', userId)
      .eq('is_personal_account', true)
      .single();

    if (accountResponse.error) {
      throw accountResponse.error;
    }

    const accountData = accountResponse.data;

    // Fetch active subscription and the corresponding tier from subscriptions table
    const subscriptionResponse = await client
      .from('subscriptions')
      .select('id, tier')
      .eq('account_id', userId)
      .eq('status', 'active')
      .single();

    if (subscriptionResponse.error) {
      throw subscriptionResponse.error;
    }

    const subscriptionData = subscriptionResponse.data;

    // Fetch the variant_id from subscription_items table based on the subscription_id
    const subscriptionItemsResponse = await client
      .from('subscription_items')
      .select('variant_id')
      .eq('subscription_id', subscriptionData.id)
      .single();

    if (subscriptionItemsResponse.error) {
      throw subscriptionItemsResponse.error;
    }

    const subscriptionItemsData = subscriptionItemsResponse.data;

    // Map the variant_id to the total time for that plan
    const totalTime = variantToTimeMap[subscriptionItemsData.variant_id] || '00:00:00';

    return {
      id: accountData.id,
      name: accountData.name,
      credit: accountData.credit,
      tier: subscriptionData.tier,
      variant_id: subscriptionItemsData.variant_id,
      totalTime,  // Add the total time based on the variant_id
    };
  };

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!userId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    initialData: partialAccount?.id
      ? {
          id: partialAccount.id,
          name: partialAccount.name,
          credit: partialAccount.credit,
          tier: partialAccount.tier,
          variant_id: partialAccount.variant_id,
          totalTime: variantToTimeMap[partialAccount.variant_id || ''] || '00:00:00',
        }
      : undefined,
  });
}

export function useRevalidatePersonalAccountCreditQuery() {
  const queryClient = useQueryClient();

  return useCallback(
    (userId: string) =>
      queryClient.invalidateQueries({
        queryKey: ['account:credit', userId],
      }),
    [queryClient],
  );
}
