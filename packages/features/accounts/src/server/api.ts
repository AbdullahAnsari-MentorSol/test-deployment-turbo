import { SupabaseClient } from '@supabase/supabase-js';

import { createBillingGatewayService } from '@kit/billing-gateway';
import { Database } from '@kit/supabase/database';

type BillingCustomer = Database['public']['Tables']['billing_customers'];
type Subscriptions = Database['public']['Tables']['subscriptions'];
type SubscriptionItems = Database['public']['Tables']['subscription_items'];

/**
 * Class representing an API for interacting with user accounts.
 * @constructor
 * @param {SupabaseClient<Database>} client - The Supabase client instance.
 */
class AccountsApi {
  constructor(private readonly client: SupabaseClient<Database>) {}

  /**
   * @name getAccount
   * @description Get the account data for the given ID.
   * @param id
   */
  async getAccount(id: string) {
    const { data, error } = await this.client
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name getAccountWorkspace
   * @description Get the account workspace data.
   */
  async getAccountWorkspace() {
    const { data, error } = await this.client
      .from('user_account_workspace')
      .select(`*`)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name loadUserAccounts
   * Load the user accounts.
   */
  async loadUserAccounts() {
    const { data: accounts, error } = await this.client
      .from('user_accounts')
      .select(`name, slug, picture_url`);

    if (error) {
      throw error;
    }

    return accounts.map(({ name, slug, picture_url }) => {
      return {
        label: name,
        value: slug,
        image: picture_url,
      };
    });
  }

  /**
   * @name getSubscription
   * Get the subscription data for the given user.
   * @param accountId
   */
  async getSubscription(accountId: string) {
    const response = await this.client
      .from('subscriptions')
      .select('*, items: subscription_items !inner (*)')
      .eq('account_id', accountId)
      .eq('status', 'active')
      .maybeSingle();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * Get the orders data for the given account.
   * @param accountId
   */
  async getOrder(accountId: string) {
    const response = await this.client
      .from('orders')
      .select('*, items: order_items !inner (*)')
      .eq('account_id', accountId)
      .maybeSingle();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }

  /**
   * @name getCustomerId
   * Get the billing customer ID for the given user.
   * If the user does not have a billing customer ID, it will return null.
   * @param accountId
   */
  async getCustomerId(accountId: string) {
    const response = await this.client
      .from('billing_customers')
      .select('customer_id')
      .eq('account_id', accountId)
      .maybeSingle();

    // if (response.error) {
    //   throw response.error;
    // }
    // if (!response.data?.customer_id) {
    //   await this.getOrCreateCustomer(accountId);
    // }
    return response.data?.customer_id;
  }

  /**
   * @name createSubscription
   * @description Create a new subscription if it does not already exist.
   * @param {Subscriptions['Insert']} params - The details of the subscription to create.
   * @returns {Promise<Subscriptions | null>} - The created subscription record or null if the subscription already exists.
   */
  async createSubscription(params: any): Promise<Subscriptions | null> {
    const {
      active,
      status,
      cancel_at_period_end,
      period_starts_at,
      period_ends_at,
      currency,
      target_subscription_id,
      target_customer_id,
      line_items
    } = params;
    const customerResponse = await this.client
      .from('billing_customers')
      .select('account_id, id')
      .eq('customer_id', target_customer_id)
      .maybeSingle();

    if (customerResponse.error) {
      throw new Error(
        `Failed to fetch customer details: ${customerResponse.error.message}`,
      );
    }

    if (!customerResponse.data) {
      throw new Error('Customer not found.');
    }

    const existingSubscription = await this.client
      .from('subscriptions')
      .select('*')
      .eq('id', target_subscription_id)
      .maybeSingle();

    if (existingSubscription.error) {
      throw new Error(
        `Failed to check existing subscription: ${existingSubscription.error.message}`,
      );
    }

    if (existingSubscription.data) {
      return null;
    }
  // Determine the tier based on the selected plan
  const planTier = this.getPlanTierFromPlanId(line_items[0].variant_id);

    const subscriptionPayload: Subscriptions['Insert'] = {
      billing_customer_id: customerResponse.data.id,
      account_id: customerResponse.data.account_id,
      id: target_subscription_id,
      billing_provider: 'stripe',
      active,
      status,
      cancel_at_period_end,
      period_starts_at,
      period_ends_at,
      currency,
      tier:planTier
    };

    const { data, error } = await this.client
      .from('subscriptions')
      .insert(subscriptionPayload);

    if (error) {
      throw new Error(`Failed to create subscription: ${error.message}`);
    }
    const {subscription_item_id,price_amount,...rest} = line_items[0];

    const subscriptionItemPayload={
      ...rest,
      price_amount:price_amount/100,
      type:'flat'
    }
    console.log(line_items[0]);
    await this.createSubscriptionItem(subscriptionItemPayload);

  // Determine the credit limit based on the selected plan
  const planCredit = this.getPlanCreditFromFeatures(line_items[0].variant_id);

  // Update the account with the new credit limit
  await this.updateAccountCredit(customerResponse.data.account_id, planCredit);

    return data || null;
  }

  /**
   * @name createSubscriptionItem
   * @description Create a new subscription item if it does not already exist.
   * @param {SubscriptionItems['Insert']} params - The details of the subscription item to create.
   * @returns {Promise<SubscriptionItems | null>} - The created subscription item record or null if the item already exists.
   */
  async createSubscriptionItem(
    params: SubscriptionItems['Insert'],
  ): Promise<SubscriptionItems | null> {
    const { data, error } = await this.client
      .from('subscription_items')
      .insert(params);

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * @name createCustomer
   * @description Create a new billing customer.
   * @param {BillingCustomer} params - The ID of the account.
   */
  private async createCustomer(params: BillingCustomer['Insert']) {
    const { data, error } = await this.client
      .from('billing_customers')
      .insert(params);

    if (error) {
      throw error;
    }

    return data;
  }

  async getBillingProvider() {
    const { data, error } = await this.client
      .from('config')
      .select('billing_provider')
      .single();

    if (error ?? !data.billing_provider) {
      throw error;
    }

    return data.billing_provider;
  }

  /**
   * @name getOrCreateCustomer
   * @description Check if the customer exists in the database, if not create a new customer.
   * @param {string} accountId - The ID of the account.
   * @returns {Promise<string | null>} - The customer ID or null if it couldn't be created.
   */
  async getOrCreateCustomer(accountId: string): Promise<string | null> {
    const { data, error } = await this.client
      .from('billing_customers')
      .select('customer_id')
      .eq('account_id', accountId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data?.customer_id) {
      return data.customer_id;
    }

    const account = await this.client
      .from('accounts')
      .select('id, name, email')
      .eq('id', accountId)
      .single();

    if (account.error || !account.data) {
      throw new Error('Account not found');
    }

    const provider = await this.getBillingProvider();
    const gateway = createBillingGatewayService(provider);
    const payloadStripeCustomer = {
      email: account.data.email,
      name: account.data.name,
    };

    const customer = await gateway.createStripeCustomer(payloadStripeCustomer);

    if (customer) {
      await this.createCustomer({
        account_id: accountId,
        customer_id: customer.id,
        email: customer.email,
        provider: provider,
      });
      return customer.id;
    }

    return null;
  }

/**
 * @name cancelSubscription
 * @description Cancels the subscription for a given subscription ID, charging the customer immediately if requested.
 * @param {string} subscriptionId - The ID of the subscription to be canceled.
 * @param {boolean} invoiceNow - Whether to invoice the customer immediately.
 * @returns {Promise<boolean>} - Returns true if the subscription was successfully canceled, false otherwise.
 */
async cancelSubscription(subscriptionId: string, invoiceNow: boolean): Promise<boolean> {
  try {
    const provider = await this.getBillingProvider();
    const gateway = createBillingGatewayService(provider);
        
    const result = await gateway.cancelSubscription({
      subscriptionId,
      invoiceNow,
    });

    // Return true if cancellation is successful, false otherwise
    return !!result.success;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return false;
  }
}

/**
 * @name getPlanCreditFromFeatures
 * @description Extract the credit limit from the plan's `planId`.
 * @param {string} planId - The variant ID of the plan (e.g., 'price_1PzhAWJglZdczVxbd00Rhoiv', 'price_1PuqsgJglZdczVxbw9H43ZBe').
 * @returns {string} - The credit limit in PostgreSQL INTERVAL format (e.g., '5 minutes').
 */
 getPlanCreditFromFeatures(planId: string): string {
  const planCreditMap: { [key: string]: string } = {
    'price_1Q18KrIViLzP3Qt9OeIDUDre': '5 minutes',  // Free Monthly
    'price_1Q18N5IViLzP3Qt9388qo65k': '5 minutes',                    // Free Yearly
    'price_1Q18MIIViLzP3Qt9zQBZWLJx': '60 minutes', // Starter Monthly
    'price_1Q18MkIViLzP3Qt92iXEwszf': '60 minutes',                // Starter Yearly
    'price_1Q18NnIViLzP3Qt9J2s4lGjs': '160 minutes',// Pro Monthly
    'price_1Q18OWIViLzP3Qt9gQZpNp1p': '160 minutes',                   // Pro Yearly
    'price_1PuqyBJglZdczVxbfvPOMhqI': 'Custom',    // Enterprise Monthly
    'enterprise-yearly': 'Custom'                  // Enterprise Yearly
  };

  return planCreditMap[planId] || '0 seconds'; // Default to '0 seconds' if no match
}

/**
 * @name getPlanTierFromPlanId
 * @description Extract the tier name from the plan's `planId`.
 * @param {string} planId - The variant ID of the plan (e.g., 'price_1PzhAWJglZdczVxbd00Rhoiv', 'price_1PuqsgJglZdczVxbw9H43ZBe').
 * @returns {string} - The name of the tier (e.g., 'Free', 'Starter').
 */
 getPlanTierFromPlanId(planId: string): string {
  const planTierMap: { [key: string]: string } = {
    'price_1PzhAWJglZdczVxbd00Rhoiv': 'Free',     // Free Monthly
    'free-yearly': 'Free',                        // Free Yearly
    'price_1PuqsgJglZdczVxbw9H43ZBe': 'Starter', // Starter Monthly
    'starter-yearly': 'Starter',                  // Starter Yearly
    'price_1PuqxUJglZdczVxbJNndtvd3': 'Pro',     // Pro Monthly
    'pro-yearly': 'Pro',                          // Pro Yearly
    'price_1PuqyBJglZdczVxbfvPOMhqI': 'Enterprise', // Enterprise Monthly
    'enterprise-yearly': 'Enterprise'             // Enterprise Yearly
  };

  return planTierMap[planId] || 'Unknown Plan'; // Default to 'Unknown Plan' if no match
}

/**
 * @name updateAccountCredit
 * @description Update the credit field in the accounts table.
 * @param {string} accountId - The ID of the account to update.
 * @param {string} creditInterval - The new credit limit in PostgreSQL INTERVAL format (e.g., '5 minutes').
 */
async updateAccountCredit(accountId: string, creditInterval: string): Promise<void> {
  if (creditInterval === 'Custom') {
    return; // Skip updating for custom plans
  }
  const { error } = await this.client
    .from('accounts')
    .update({ credit: creditInterval }) // Update the credit field
    .eq('id', accountId);

  if (error) {
    console.log(error)
    throw new Error(`Failed to update account credit: ${error.message}`);
  }
}

/**
 * @name updateAccountCredits
 * @description Update the credit field in the accounts table by adding the new credit to the existing value.
 * @param {string} accountId - The ID of the account to update.
 * @param {string} priceId - The new credit amount in PostgreSQL INTERVAL format (e.g., '5 minutes').
 */
async updateAccountCredits(params:{accountId: string, priceId: string}): Promise<void> {
  const credit_Interval = this.getPlanCreditFromFeatures(params.priceId)|| "0 seconds";

  if (credit_Interval === 'Custom') return;
  console.log(credit_Interval,params.priceId,"Test")
  const { error } = await this.client
    .rpc('add_credit_to_account', {  // Use a raw query or an RPC call
      target_account_id: params.accountId,
      credit_interval: credit_Interval
    });

  if (error) {
    console.log(error);
    // throw new Error(`Failed to update account credit: ${error.message}`);
  }
}
  /**
 * @name getPodcastSettings
 * Get the podcast settings for the given account.
 * If the account does not have any podcast settings, it will return null.
 * @param accountId
 */
async getPodcastSettings(accountId: string) {
  const response = await this.client
    .from('podcast_settings')
    .select('*')
    .eq('account_id', accountId)
    .single(); 

  return response.data || null;
}

/**
 * @name addPodcastDetail
 * Inserts podcast details into the podcast_detail table.
 * @param podcastDetail {Object} The podcast detail data
 * @param podcastDetail.podcastTitle {string} The title of the podcast
 * @param podcastDetail.podcastAudioLength {string} The length of the podcast audio (e.g., '01:00:00' for 1 hour)
 * @param podcastDetail.podcastAudio {Uint8Array} The file path or URL of the podcast audio (binary data as Uint8Array)
 * @param podcastDetail.accountId {string} The account ID to associate with this podcast
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>} The inserted podcast detail record or an error
 */
async addPodcastDetail(podcastDetail: {
  podcastTitle: string;
  podcastAudioLength: string;
  podcastAudio: string | null;
  accountId: string;
}): Promise<{data?: any; error?: string }> {
    // Insert podcast details into the database
    const { data, error } = await this.client
      .from('podcast_detail')
      .insert({
        podcast_title: podcastDetail.podcastTitle,
        podcast_audio_length: podcastDetail.podcastAudioLength,
        podcast_audio: podcastDetail.podcastAudio,
        account_id: podcastDetail.accountId,
      })
      .single();

    // Handle any error from the insert operation
    if (error) {
      throw new Error(`Error inserting podcast details: ${error.message}`);
    }
    return { data };
}


}
export function createAccountsApi(client: SupabaseClient<Database>) {
  return new AccountsApi(client);
}