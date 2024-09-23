'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formatDate } from 'date-fns';

import { Database } from '@kit/supabase/database';
import { Button } from '@kit/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@kit/ui/dropdown-menu';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { Form, FormControl, FormField, FormItem } from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';

import { AdminDeleteAccountDialog } from './admin-delete-account-dialog';
import { AdminDeleteUserDialog } from './admin-delete-user-dialog';
import { AdminImpersonateUserDialog } from './admin-impersonate-user-dialog';
type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionItem = Database['public']['Tables']['subscription_items']['Row'];

type Account = Database['public']['Tables']['accounts']['Row']& {
  subscriptions: Subscription[];
  subscription_items: SubscriptionItem[];
};

const FiltersSchema = z.object({
  type: z.enum(['all', 'team', 'personal']),
  query: z.string().optional(),
});

const tierRank = {
  starter: 1,
  pro: 2,
  enterprise: 3,
} as const;

type Tier = keyof typeof tierRank;

function isValidTier(tier: string | null): tier is Tier {
  return tier === 'starter' || tier === 'pro' || tier === 'enterprise';
}

function getTierChangeIcon(currentTier: Tier | null, previousTier: Tier | null) {
  if (!currentTier || !previousTier) return null;
  
  if (tierRank[currentTier] > tierRank[previousTier]) {
    return <ArrowUp className="text-green-500" />;
  } else if (tierRank[currentTier] < tierRank[previousTier]) {
    return <ArrowDown className="text-red-500" />;
  }
  
  return null;
}


export function AdminAccountsTable(
  props: React.PropsWithChildren<{
    data: Account[];
    pageCount: number;
    pageSize: number;
    page: number;
    filters: {
      type: 'all' | 'team' | 'personal';
    };
  }>,
) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex justify-end'}>
        <AccountsTableFilters filters={props.filters} />
      </div>
      <DataTable
        pageSize={props.pageSize}
        pageIndex={props.page - 1}
        pageCount={props.pageCount}
        data={props.data}
        columns={getColumns()}
      />
    </div>
  );
}

function AccountsTableFilters(props: {
  filters: z.infer<typeof FiltersSchema>;
}) {
  const form = useForm({
    resolver: zodResolver(FiltersSchema),
    defaultValues: {
      type: props.filters?.type ?? 'all',
      query: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const router = useRouter();
  const pathName = usePathname();

  const onSubmit = ({ type, query }: z.infer<typeof FiltersSchema>) => {
    const params = new URLSearchParams({
      account_type: type,
      query: query ?? '',
    });

    const url = `${pathName}?${params.toString()}`;

    router.push(url);
  };

  return (
    <Form {...form}>
      <form
        className={'flex gap-2.5'}
        onSubmit={form.handleSubmit((data) => onSubmit(data))}
      >
        <Select
          value={form.watch('type')}
          onValueChange={(value) => {
            form.setValue(
              'type',
              value as z.infer<typeof FiltersSchema>['type'],
              {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              },
            );

            return onSubmit(form.getValues());
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={'Account Type'} />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Account Type</SelectLabel>

              <SelectItem value={'all'}>All accounts</SelectItem>
              <SelectItem value={'team'}>Team</SelectItem>
              <SelectItem value={'personal'}>Personal</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <FormField
          name={'query'}
          render={({ field }) => (
            <FormItem>
              <FormControl className={'w-full min-w-36 md:min-w-80'}>
                <Input
                  className={'w-full'}
                  placeholder={`Search account...`}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function getColumns(): ColumnDef<Account>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <Link
            className={'hover:underline'}
            href={`/admin/accounts/${row.original.id}`}
          >
            {row.original.name}
          </Link>
        );
      },
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return row.original.is_personal_account ? 'Personal' : 'Team';
      },
    },
    {
      id: 'subscription_tier',
      header: 'Tier',
      cell: ({ row }) => {
        const subscriptions = row.original.subscriptions;
        const currentSubscription = subscriptions?.[0];
        const previousSubscription = subscriptions?.[1];

        const currentTier = currentSubscription?.tier ?? null;
        const previousTier = previousSubscription?.tier ?? null;

        const isCurrentTierValid = isValidTier(currentTier);
        const isPreviousTierValid = isValidTier(previousTier);

        return (
          <div className="flex items-center space-x-2">
            <span>{currentTier}</span>
            {isCurrentTierValid && isPreviousTierValid && getTierChangeIcon(currentTier, previousTier)}
          </div>
        );
      },
    },
    {
      id: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const subscriptionItem = row.original.subscription_items?.[0];
        return subscriptionItem && `$${subscriptionItem.price_amount}`;
      },
    },
    {
      id: 'created_at',
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        return row.original.created_at && formatDate(row.original.created_at,'P');
      },
    },
    {
      id: 'updated_at',
      header: 'Updated At',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        return row.original.updated_at && formatDate(row.original.updated_at,'P');
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const isPersonalAccount = row.original.is_personal_account;
        const userId = row.original.id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'}>
                <EllipsisVertical className={'h-4'} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={'end'}>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem>
                  <Link
                    className={'h-full w-full'}
                    href={`/admin/accounts/${userId}`}
                  >
                    View
                  </Link>
                </DropdownMenuItem>

                <If condition={isPersonalAccount}>
                  <AdminImpersonateUserDialog userId={userId}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Impersonate User
                    </DropdownMenuItem>
                  </AdminImpersonateUserDialog>

                  <AdminDeleteUserDialog userId={userId}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete Personal Account
                    </DropdownMenuItem>
                  </AdminDeleteUserDialog>
                </If>

                <If condition={!isPersonalAccount}>
                  <AdminDeleteAccountDialog accountId={row.original.id}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      Delete Team Account
                    </DropdownMenuItem>
                  </AdminDeleteAccountDialog>
                </If>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
