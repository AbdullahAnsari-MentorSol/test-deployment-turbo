'use client';

import type { User } from '@supabase/supabase-js';

import { useUser } from '@kit/supabase/hooks/use-user';

import { PersonalAccountCreditBar } from '@kit/accounts/personal-account-credit-bar';


export function ProfileAccountCreditRemaining(props: {
  collapsed: boolean;
  user: User;

  account?: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
  };
}) {
  const user = useUser(props.user);
  const userData = user.data as User;
  return (
    <div className={props.collapsed ? '' : 'w-full'}>
    <PersonalAccountCreditBar
        user={userData}
        account={props.account}
      />
    </div>
  );
}
