import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';

import { FeedbackTable } from '@kit/admin/components/admin-feedback-table';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { PageBody, PageHeader } from '@kit/ui/page';

interface SearchParams {
  page?: string;
  query?: string;
}

export const metadata = {
  title: `Feedback Page`,
};

function FeedbackPage({ searchParams }: { searchParams: SearchParams }) {
  const client = getSupabaseServerAdminClient();

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const filters = getFilters(searchParams);

  return (
    <>
      <PageHeader
        title={'Feedback'}
        description={`Below is the list of feedback provided by users.`}
      />
      <PageBody>
        <ServerDataLoader
          table={'feedback'}
          client={client}
          page={page}
          where={filters}
        >
          {({ data: feedbackData, page: feedbackPage, pageSize: feedbackPageSize, pageCount: feedbackPageCount }) => {
            return (
              <>
                <FeedbackTable
                  page={feedbackPage}
                  pageSize={feedbackPageSize}
                  pageCount={feedbackPageCount}
                  data={feedbackData}
                />
              </>
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
      ilike?: string;
    }
  > = {};

  if (params.query) {
    filters.comment = {
      ilike: `%${params.query}%`,
    };
  }

  return filters;
}

export default AdminGuard(FeedbackPage);
