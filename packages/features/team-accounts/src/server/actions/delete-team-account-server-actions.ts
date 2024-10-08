'use server';

import { redirect } from 'next/navigation';

import { SupabaseClient } from '@supabase/supabase-js';

import { enhanceAction } from '@kit/next/actions';
import { Database } from '@kit/supabase/database';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { DeleteTeamAccountSchema } from '../../schema/delete-team-account.schema';
import { createDeleteTeamAccountService } from '../services/delete-team-account.service';

export const deleteTeamAccountAction = enhanceAction(
  async (formData: FormData, user) => {
    const params = DeleteTeamAccountSchema.parse(
      Object.fromEntries(formData.entries()),
    );

    const client = getSupabaseServerClient();
    const userId = user.id;
    const accountId = params.accountId;

    // Check if the user has the necessary permissions to delete the team account
    await assertUserPermissionsToDeleteTeamAccount(client, {
      accountId,
      userId,
    });

    // Get the Supabase client and create a new service instance.
    const service = createDeleteTeamAccountService();

    // Get the Supabase admin client.
    const adminClient = getSupabaseServerAdminClient();

    // Delete the team account and all associated data.
    await service.deleteTeamAccount(adminClient, {
      accountId,
      userId,
    });

    return redirect('/home');
  },
  {},
);

async function assertUserPermissionsToDeleteTeamAccount(
  client: SupabaseClient<Database>,
  params: {
    accountId: string;
    userId: string;
  },
) {
  const { data, error } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', params.userId)
    .eq('is_personal_account', false)
    .eq('id', params.accountId);

  if (error ?? !data) {
    throw new Error('Account not found');
  }
}
