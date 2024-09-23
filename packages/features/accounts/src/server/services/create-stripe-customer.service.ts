import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@kit/supabase/database';

type BillingCustomer = Database['public']['Tables']['billing_customers'];

/**
 * Factory function to create the BillingService.
 * @param client - The Supabase client instance.
 */
export function createBillingService(client: SupabaseClient<Database>) {
  return new BillingService(client);
}

class BillingService {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name createBillingCustomer
   * @description Create a new billing customer in the database.
   * @param params - The parameters for inserting a new billing customer.
   */
  async createBillingCustomer(params: BillingCustomer['Insert']) {
    const { error } = await this.client.from('billing_customers').insert(params);

    if (error) {
      throw error;
    }
  }

}
