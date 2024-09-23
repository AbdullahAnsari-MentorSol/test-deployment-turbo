import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';
import { SubscriptionAccountsTable } from '@kit/admin/components/admin-subscription-table';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { PageBody, PageHeader } from '@kit/ui/page';

interface SearchParams {
  page?: string;
  account_type?: 'all' | 'team' | 'personal';
  query?: string;
  status?: 'all' | 'active' | 'canceled' | 'trialing';
  updated_at?: string;
}

export const metadata = {
  title: `Subscription Accounts`,
};

function SubscriptionsAccountsPage({ searchParams }: { searchParams: SearchParams }) {
  const client = getSupabaseServerAdminClient();

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const filters = getFilters(searchParams);
  const subscriptionFilters = getSubscriptionFilters('updated_at'); // Filter based on updated_at in subscriptions table

  return (
    <>
      <PageHeader
        title={'Subscription Accounts'}
        description={`Below is the list of accounts with updated subscriptions.`}
      />
      <PageBody>
        <ServerDataLoader
          table={'accounts'}
          client={client}
          page={page}
          where={filters}
        >
          {({ data: accountData, page: accountPage, pageSize: accountPageSize, pageCount: accountPageCount }) => {
            return (
              <ServerDataLoader
                table={'subscriptions'}
                client={client}
                where={subscriptionFilters}
              >
                {({ data: subscriptionData }) => {
                  const accountsWithUpdatedSubscriptions = accountData
                    .filter(account => {
                      return subscriptionData.some(subscription => 
                        subscription.account_id === account.id && subscription.updated_at !== null
                      );
                    });

                  return (
                    <>
                      <SubscriptionAccountsTable
                        page={accountPage}
                        pageSize={accountPageSize}
                        pageCount={accountPageCount}
                        data={accountsWithUpdatedSubscriptions}
                      />
                    </>
                  );
                }}
              </ServerDataLoader>
            );
          }}
        </ServerDataLoader>
      </PageBody>
    </>
  );
}

function getFilters(params: SearchParams) {
  const filters: Record<
    string,
    {
      eq?: boolean | string;
      like?: string;
    }
  > = {};

  if (params.account_type && params.account_type !== 'all') {
    filters.is_personal_account = {
      eq: params.account_type === 'personal',
    };
  }

  if (params.query) {
    filters.name = {
      like: `%${params.query}%`,
    };
  }

  return filters;
}

function getSubscriptionFilters(updatedField: string) {
  const filters: Record<string, { notNull?: boolean }> = {};

  if (updatedField === 'updated_at') {
    filters.updated_at = {
      notNull: true,  // Ensure the `updated_at` field is not null
    };
  }

  return filters;
}

export default AdminGuard(SubscriptionsAccountsPage);
