import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';

import { CancelledAccountsTable } from '@kit/admin/components/admin-cancelled-subscription-table';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { PageBody, PageHeader } from '@kit/ui/page';

interface SearchParams {
  page?: string;
  account_type?: 'all' | 'team' | 'personal';
  query?: string;
  status?: 'all' | 'active' | 'canceled' | 'trialing';
}

export const metadata = {
  title: `Cancelled Accounts`,
};

function CancelledAccountsPage({ searchParams }: { searchParams: SearchParams }) {
  const client = getSupabaseServerAdminClient();

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const filters = getFilters(searchParams);
  const subscriptionFilters = getSubscriptionFilters('canceled');
  return (
    <>
      <PageHeader
        title={'Cancelled Accounts'}
        description={`Below is the list of accounts with cancelled subscriptions.`}
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
            const accountsWithCancelledSubscriptions = accountData
              .map(account => {
                const subscription = subscriptionData.find(sub => sub.account_id === account.id);
                return {
                  ...account,
                  subscription,
                };
              })
              .filter(account => account.subscription);

                  return (
                    <>
                      <CancelledAccountsTable
                        page={accountPage}
                        pageSize={accountPageSize}
                        pageCount={accountPageCount}
                        data={accountsWithCancelledSubscriptions}
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
function getSubscriptionFilters(status:string) {
  const filters: Record<string, { eq?: string }> = {};

  if (status) {
    filters.status = {
      eq: status,
    };
  }

  return filters;
}

export default AdminGuard(CancelledAccountsPage);
