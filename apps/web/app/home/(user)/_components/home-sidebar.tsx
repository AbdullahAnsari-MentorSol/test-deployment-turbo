import { If } from '@kit/ui/if';
import { Sidebar, SidebarContent, SidebarNavigation } from '@kit/ui/sidebar';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import { ProfileAccountCreditRemaining } from '~/components/personal-account-credit-remaing';
import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserNotifications } from '~/home/(user)/_components/user-notifications';

// home imports
import type { UserWorkspace } from '../_lib/server/load-user-workspace';
import { HomeAccountSelector } from './home-account-selector';

export function HomeSidebar(props: { workspace: UserWorkspace }) {
  const { workspace, user, accounts } = props.workspace;

  return (
    <Sidebar>
      {/* <SidebarContent className={'h-16 justify-center'}>
      <AppLogo className={'py-2 mt-4'} href='/home'/>
      </SidebarContent> */}
      <SidebarContent className={'h-16 justify-center mt-4'}>
        <div className={'flex items-center justify-between space-x-2'}>
          <If
            condition={featuresFlagConfig.enableTeamAccounts}
            fallback={<AppLogo href='/home' className={'py-2'} />}
          >
            <HomeAccountSelector
              userId={user.id}
              collapsed={false}
              accounts={accounts}
            />
          </If>

          <UserNotifications userId={user.id} />
        </div>
      </SidebarContent>

      <SidebarContent className={`mt-5 h-[calc(100%-160px)] overflow-y-auto`}>
        <SidebarNavigation config={personalAccountNavigationConfig} />
      </SidebarContent>

      <div className={'absolute bottom-4 left-0 w-full'}>
        <SidebarContent>
          <ProfileAccountCreditRemaining
            collapsed={false}
            user={user}
            account={workspace}
          />
        </SidebarContent>
        <SidebarContent>
          <ProfileAccountDropdownContainer
            collapsed={false}
            user={user}
            account={workspace}
          />
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
