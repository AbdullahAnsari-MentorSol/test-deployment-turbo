import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';
// local imports
import { HomeLayoutPageHeader } from '~/home/(user)/_components/home-page-header';
import { CreditBarChart } from '../_components/credit-bar-chart';
import { loadUserWorkspace } from '~/home/(user)/_lib/server/load-user-workspace';
import { use } from 'react';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:CreditTab');

  return {
    title,
  };
};

function UserCreditsPage() {
  const { user } = use(loadUserWorkspace());
  return (
    <>
      <HomeLayoutPageHeader
        title={<Trans i18nKey={'common:routes.credits'} />}
        description={<AppBreadcrumbs />}
      />

      <PageBody>
      <div className={'flex flex-col space-y-4'}>
        <CreditBarChart userId={user.id}/>
        </div>
      </PageBody>
    </>
  );
}

export default withI18n(UserCreditsPage);