import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';

import { AdminAccountsTable } from '@kit/admin/components/admin-accounts-table';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { PageBody, PageHeader } from '@kit/ui/page';

interface SearchParams {
  page?: string;
  account_type?: 'all' | 'team' | 'personal';
  query?: string;
}

export const metadata = {
  title: `Accounts`,
};

function AccountsPage({ searchParams }: { searchParams: SearchParams }) {
  const client = getSupabaseServerAdminClient();

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const filters = getFilters(searchParams);

  return (
    <>
      <PageHeader
        title={'Accounts'}
        description={`Below is the list of all the accounts in your application.`}
      />
      <PageBody>
        <ServerDataLoader
          table={'accounts'}
          client={client}
          page={page}
          where={filters}
        >
          {({
            data: accountData,
            page: accountPage,
            pageSize: accountPageSize,
            pageCount: accountPageCount,
          }) => {
            return (
              <ServerDataLoader table={'subscriptions'} client={client}>
                {({ data: subscriptionData }) => {
                  return (
                    <ServerDataLoader
                      table={'subscription_items'}
                      client={client}
                    >
                      {({ data: subscriptionItemsData }) => {
                        const accountsWithSubscriptionsAndItems =
                          accountData.map((account) => {
                            const subscriptions =
                              subscriptionData.filter(
                                (sub) => sub.account_id === account.id,
                              ) || [];
                            const subscriptionItems = subscriptions.length
                              ? subscriptionItemsData.filter(
                                  (item) =>
                                    subscriptions[0] && item.subscription_id === subscriptions[0].id,
                                )
                              : [];

                            return {
                              ...account,
                              subscriptions,
                              subscription_items: subscriptionItems,
                            };
                          });

                        return (
                          <>
                            <AdminAccountsTable
                              page={accountPage}
                              pageSize={accountPageSize}
                              pageCount={accountPageCount}
                              data={accountsWithSubscriptionsAndItems}
                              filters={{
                                type: searchParams.account_type ?? 'all',
                              }}
                            />
                          </>
                        );
                      }}
                    </ServerDataLoader>
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

export default AdminGuard(AccountsPage);
