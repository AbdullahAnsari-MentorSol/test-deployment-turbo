import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { useQuery } from '@tanstack/react-query';

export function useMrrData() {
  const client = useSupabase();

  const queryFn = async () => {
    const response = await client
      .from('subscription_items')
      .select('price_amount,created_at, subscription_id, subscriptions(created_at)');

    if (response.error) {
      throw new Error(response.error.message);
    }

    const subscriptionItems = response.data;

    if (!subscriptionItems.length) {
      return {}; 
    }

    const mrrData = subscriptionItems.reduce((acc, item) => {
      const month = new Date(item.created_at).getMonth();
      const year = new Date(item.created_at).getFullYear();
      const key = `${month}-${year}`;

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key] += item.price_amount ?? 0; 

      return acc;
    }, {} as Record<string, number>);

    return mrrData;
  };

  return useQuery({
    queryKey: ['mrr:data'],
    queryFn,
    refetchOnWindowFocus: false, 
    refetchOnMount: false,      
  });
}
