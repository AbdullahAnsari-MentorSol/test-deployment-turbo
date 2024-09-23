import * as React from 'react';
import { useState, useTransition } from 'react';

import { BillingConfig, getProductPlanPairByVariantId } from '@kit/billing';
import { Tables } from '@kit/supabase/database';
// import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@kit/ui/dialog';
import { If } from '@kit/ui/if';
import { Trans } from '@kit/ui/trans';

// import { createAccountsApi } from '../../../../features/accounts/src/server/api';

type Subscription = Tables<'subscriptions'>;
type LineItem = Tables<'subscription_items'>;

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  subscription: Subscription & {
    items: LineItem[];
  };
  config: BillingConfig;
}

export function ChangeSubscriptionDialog({
  isOpen,
  setIsOpen,
  subscription,
  config,
}: React.PropsWithChildren<Props>) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<boolean>(false);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        // Call the cancellation action or API here
        // await cancelSubscriptionAction(subscription.id);
        // const client = getSupabaseServerClient();
        // const api = createAccountsApi(client);
        // if (subscription.items[0]?.subscription_id) {
        //   await api.cancelSubscription(
        //     subscription.items[0]?.subscription_id,
        //     true,
        //   );
        // }
        setIsOpen(false); // Close the dialog after success
      } catch (error) {
        setError(true);
      }
    });
  };

  const firstLineItem = subscription.items[0];

  if (!firstLineItem) {
    throw new Error('No line items found in subscription');
  }

  const { product, plan } = getProductPlanPairByVariantId(
    config,
    firstLineItem.variant_id,
  );

  if (!product || !plan) {
    throw new Error(
      'Product or plan not found. Did you forget to add it to the billing config?',
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            <Trans
              i18nKey="billing:cancelSubscriptionTitle"
              defaults="Are you sure?"
            />
          </DialogTitle>

          <DialogDescription>
            <Trans
              i18nKey="billing:cancelSubscriptionDescription"
              defaults="You want to cancel your current subscription. Your credits will be added when you add a new subscription."
            />
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4">
          {/* Error Alert */}
          <If condition={error}>
            <div className="text-red-500">
              <Trans
                i18nKey="billing:cancelSubscriptionError"
                defaults="Something went wrong. Please try again."
              />
            </div>
          </If>

          <div className="flex justify-end space-x-2">
            {/* Cancel button */}
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={pending}
            >
              <Trans i18nKey="common:cancel" defaults="Cancel" />
            </Button>

            {/* Confirm button */}
            <Button
              data-test="confirm-cancel-subscription-button"
              onClick={handleConfirm}
              disabled={pending}
            >
              {pending ? (
                <Trans i18nKey="billing:cancelling" defaults="Cancelling..." />
              ) : (
                <Trans i18nKey="billing:confirmCancel" defaults="Yes" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
