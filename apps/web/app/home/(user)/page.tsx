import { Card, CardContent } from '@kit/ui/card';
import { PageBody } from '@kit/ui/page';
import { use } from 'react';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

// local imports
import { HomeLayoutPageHeader } from './_components/home-page-header';
import { PodcastGenerateForm } from './_components/podcast-generate-form';
import PodcastSettingsSidebar from './_components/podcast-settings-sidebar';
import { loadUserWorkspace } from '~/home/(user)/_lib/server/load-user-workspace';
export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

function UserHomePage() {
  const { user } = use(loadUserWorkspace());
  return (
    <>
    <div className='flex flex-wrap justify-between gap-1'>
      <HomeLayoutPageHeader
        title={"Podcast Genie"}
        description={"Create Your Podcast With Podcast Genie"}
      />
    <PodcastSettingsSidebar userId={user.id}/>
    </div>

      <PageBody>
        <div className="flex flex-col space-y-4">
          <Card>
            <CardContent className="mt-2 flex flex-col items-center">
              <div className={'w-full'}>
                <PodcastGenerateForm userId={user.id}/>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}

export default withI18n(UserHomePage);
