import 'server-only';

import { SupabaseClient } from '@supabase/supabase-js';
import { createAccountsApi } from '../../../../../../features/accounts/src/server/api';
import { BillingWebhookHandlerService } from '@kit/billing';
import {
  UpsertOrderParams,
  UpsertSubscriptionParams,
} from '@kit/billing/types';
import { getLogger } from '@kit/shared/logger';
import { Database } from '@kit/supabase/database';
import { createBillingGatewayService } from '../billing-gateway/billing-gateway.service';

/**
 * @name CustomHandlersParams
 * @description Allow consumers to provide custom handlers for the billing events
 * that are triggered by the webhook events.
 */
interface CustomHandlersParams {
  onSubscriptionDeleted: (subscriptionId: string) => Promise<unknown>;
  onSubscriptionUpdated: (
    subscription: UpsertSubscriptionParams,
  ) => Promise<unknown>;
  onCheckoutSessionCompleted: (
    subscription: UpsertSubscriptionParams | UpsertOrderParams,
    customerId: string,
  ) => Promise<unknown>;
  onPaymentSucceeded: (sessionId: string) => Promise<unknown>;
  onPaymentFailed: (sessionId: string) => Promise<unknown>;
  onInvoicePaid: (subscription: UpsertSubscriptionParams) => Promise<unknown>;
  onEvent(event: unknown): Promise<unknown>;
}

/**
 * @name createBillingEventHandlerService
 * @description Create a new instance of the `BillingEventHandlerService` class
 * @param clientProvider
 * @param strategy
 */
export function createBillingEventHandlerService(
  clientProvider: () => SupabaseClient<Database>,
  strategy: BillingWebhookHandlerService,
) {
  return new BillingEventHandlerService(clientProvider, strategy);
}

/**
 * @name BillingEventHandlerService
 * @description This class is used to handle the webhook events from the billing provider
 */
class BillingEventHandlerService {
  private readonly namespace = 'billing';

  constructor(
    private readonly clientProvider: () => SupabaseClient<Database>,
    private readonly strategy: BillingWebhookHandlerService,
  ) {}

  /**
   * @name handleWebhookEvent
   * @description Handle the webhook event from the billing provider
   * @param request
   * @param params
   */
  async handleWebhookEvent(
    request: Request,
    params: Partial<CustomHandlersParams> = {},
  ) {
    const event = await this.strategy.verifyWebhookSignature(request);

    if (!event) {
      throw new Error('Invalid signature');
    }

    return this.strategy.handleWebhookEvent(event, {
      onSubscriptionDeleted: async (subscriptionId: string) => {
        const client = this.clientProvider();
        const logger = await getLogger();

        const ctx = {
          namespace: this.namespace,
          subscriptionId,
        };

        // Handle the subscription deleted event
        // here we delete the subscription from the database
        logger.info(ctx, 'Processing subscription deleted event...');

        const { error } = await client
          // .from('subscriptions')
          // .delete()
          // .match({ id: subscriptionId });
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() }) // Update status to 'canceled'
          .eq('id', subscriptionId);

        if (error) {
          logger.error(
            {
              error,
              ...ctx,
            },
            `Failed to delete subscription`,
          );

          throw new Error('Failed to delete subscription');
        }

        if (params.onSubscriptionDeleted) {
          await params.onSubscriptionDeleted(subscriptionId);
        }

        logger.info(ctx, 'Successfully deleted subscription');
      },
      onSubscriptionUpdated: async (subscription) => {
        // const client = this.clientProvider();
        // const logger = await getLogger();

        // const ctx = {
        //   namespace: this.namespace,
        //   subscriptionId: subscription.target_subscription_id,
        //   provider: subscription.billing_provider,
        //   accountId: subscription.target_account_id,
        //   customerId: subscription.target_customer_id,
        // };

        // logger.info(ctx, 'Processing subscription updated event ...');

        // // Handle the subscription updated event
        // // here we update the subscription in the database
        // const { error } = await client.rpc('upsert_subscription', subscription);

        // if (error) {
        //   logger.error(
        //     {
        //       error,
        //       ...ctx,
        //     },
        //     'Failed to update subscription',
        //   );

        //   throw new Error('Failed to update subscription');
        // }

        // if (params.onSubscriptionUpdated) {
        //   await params.onSubscriptionUpdated(subscription);
        // }

        // logger.info(ctx, 'Successfully updated subscription');
        // const creditPayload = {
        //   accountId:subscription.target_account_id ||"",
        //   priceId:subscription.line_items[0]?.variant_id||""
        // }
        // const api = createAccountsApi(client);
        // await api.updateAccountCredits(creditPayload)
        const client = this.clientProvider();
        const logger = await getLogger();
      
        const ctx = {
          namespace: this.namespace,
          subscriptionId: subscription.target_subscription_id,
          provider: subscription.billing_provider,
          accountId: subscription.target_account_id,
          customerId: subscription.target_customer_id,
        };
      
        logger.info(ctx, 'Processing subscription updated event for upgrade...');
      
        const { data: existingSubscription, error: fetchError } = await client
          .from('subscriptions')
          .select('*')
          .eq('account_id', subscription.target_account_id)
          .eq('status', 'active')  // Only fetch active subscriptions
          .single();
        
      
        if (fetchError) {
          logger.error({ ...ctx, fetchError }, 'Failed to fetch existing active subscription');
          // throw new Error('Failed to fetch existing active subscription');
        }
      
        if (existingSubscription) {
          if (existingSubscription.id !==subscription.target_subscription_id) {
            logger.info(ctx, `Canceling existing Stripe subscription: ${existingSubscription.id}`);
            
            try {
              const gateway = createBillingGatewayService(subscription.billing_provider);
              await gateway.cancelSubscription({ subscriptionId: existingSubscription.id, invoiceNow: true });
            } catch (stripeError) {
              logger.error({ ...ctx, stripeError }, 'Failed to cancel subscription in Stripe');
              throw new Error('Failed to cancel subscription in Stripe');
            }
          } else {
            logger.info(ctx, 'Skipping cancellation as the subscription was created less than one minute ago.');
          }
        }
      
        const { error: upsertError } = await client.rpc('upsert_subscription', subscription);
      
        if (upsertError) {
          logger.error({ ...ctx, upsertError }, 'Failed to create new subscription with upgraded plan');
          throw new Error('Failed to create new subscription with upgraded plan');
        }
      
        logger.info(ctx, 'Successfully created new subscription with upgraded plan');
      
        const creditPayload = {
          accountId: subscription.target_account_id || "",
          priceId: subscription.line_items[0]?.variant_id || ""
        };
        const api = createAccountsApi(client);
        await api.updateAccountCredits(creditPayload);
      
        logger.info(ctx, 'Successfully updated account credits after subscription upgrade');
      
        if (params.onSubscriptionUpdated) {
          await params.onSubscriptionUpdated(subscription);
        }
      },
      onCheckoutSessionCompleted: async (payload) => {
        // Handle the checkout session completed event
        // here we add the subscription to the database
        const client = this.clientProvider();
        const logger = await getLogger();

        // Check if the payload contains an order_id
        // if it does, we add an order, otherwise we add a subscription
        if ('target_order_id' in payload) {
          const ctx = {
            namespace: this.namespace,
            orderId: payload.target_order_id,
            provider: payload.billing_provider,
            accountId: payload.target_account_id,
            customerId: payload.target_customer_id,
          };

          logger.info(ctx, 'Processing order completed event...');

          const { error } = await client.rpc('upsert_order', payload);

          if (error) {
            logger.error({ ...ctx, error }, 'Failed to add order');

            throw new Error('Failed to add order');
          }

          if (params.onCheckoutSessionCompleted) {
            await params.onCheckoutSessionCompleted(
              payload,
              payload.target_customer_id,
            );
          }

          logger.info(ctx, 'Successfully added order');
        } else {
          const ctx = {
            namespace: this.namespace,
            subscriptionId: payload.target_subscription_id,
            provider: payload.billing_provider,
            accountId: payload.target_account_id,
            customerId: payload.target_customer_id,
          };
          const { data: existingSubscription, error: fetchError } = await client
          .from('subscriptions')
          .select('*')
          .eq('account_id', payload.target_account_id)
          .eq('status', 'active')  // Only fetch active subscriptions
          .single();
        
      
        if (fetchError) {
          logger.error({ ...ctx, fetchError }, 'Failed to fetch existing active subscription');
          // throw new Error('Failed to fetch existing active subscription');
        }
      
        if (existingSubscription) {
          if (existingSubscription.id !==payload.target_subscription_id) {
            logger.info(ctx, `Canceling existing Stripe subscription: ${existingSubscription.id}`);
            
            try {
              const gateway = createBillingGatewayService("stripe");
              await gateway.cancelSubscription({ subscriptionId: existingSubscription.id, invoiceNow: true });
            } catch (stripeError) {
              logger.error({ ...ctx, stripeError }, 'Failed to cancel subscription in Stripe');
              throw new Error('Failed to cancel subscription in Stripe');
            }
          } else {
            logger.info(ctx, 'Skipping cancellation as the subscription was created less than one minute ago.');
          }
        }

          logger.info(ctx, 'Processing checkout session completed event...');

          const { error } = await client.rpc('upsert_subscription', payload);

          // handle the error
          if (error) {
            logger.error({ ...ctx, error }, 'Failed to add subscription');

            throw new Error('Failed to add subscription');
          }

          // allow consumers to provide custom handlers for the event
          if (params.onCheckoutSessionCompleted) {
            await params.onCheckoutSessionCompleted(
              payload,
              payload.target_customer_id,
            );
          }

          // all good
          logger.info(ctx, 'Successfully added subscription');
          if(payload.tier=="Free"){
            const creditPayload = {
              accountId: payload.target_account_id || "",
              priceId: payload.line_items[0]?.variant_id|| ""
            };
            const api = createAccountsApi(client);
            await api.updateAccountCredits(creditPayload);
          }
        }
      },
      onPaymentSucceeded: async (sessionId: string) => {
        const client = this.clientProvider();
        const logger = await getLogger();

        const ctx = {
          namespace: this.namespace,
          sessionId,
        };

        // Handle the payment succeeded event
        // here we update the payment status in the database
        logger.info(ctx, 'Processing payment succeeded event...');

        const { error } = await client
          .from('orders')
          .update({ status: 'succeeded' })
          .match({ session_id: sessionId });

        // handle the error
        if (error) {
          logger.error({ error, ...ctx }, 'Failed to update payment status');

          throw new Error('Failed to update payment status');
        }

        // allow consumers to provide custom handlers for the event
        if (params.onPaymentSucceeded) {
          await params.onPaymentSucceeded(sessionId);
        }

        logger.info(ctx, 'Successfully updated payment status');
      },
      onPaymentFailed: async (sessionId: string) => {
        const client = this.clientProvider();
        const logger = await getLogger();

        const ctx = {
          namespace: this.namespace,
          sessionId,
        };

        // Handle the payment failed event
        // here we update the payment status in the database
        logger.info(ctx, 'Processing payment failed event');

        const { error } = await client
          .from('orders')
          .update({ status: 'failed' })
          .match({ session_id: sessionId });

        if (error) {
          logger.error({ error, ...ctx }, 'Failed to update payment status');

          throw new Error('Failed to update payment status');
        }

        // allow consumers to provide custom handlers for the event
        if (params.onPaymentFailed) {
          await params.onPaymentFailed(sessionId);
        }

        logger.info(ctx, 'Successfully updated payment status');
      },
      onInvoicePaid: async (payload) => {
        if (params.onInvoicePaid) {
          return params.onInvoicePaid(payload);
        }
      },
      onEvent: params.onEvent,
    });
  }
}
