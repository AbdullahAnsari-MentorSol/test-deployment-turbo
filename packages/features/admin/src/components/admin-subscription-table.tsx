'use client';

import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { Input } from '@kit/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Database } from '@kit/supabase/database';

type Account = Database['public']['Tables']['accounts']['Row'];

const FiltersSchema = z.object({
  query: z.string().optional(),
});

export function SubscriptionAccountsTable(
  props: React.PropsWithChildren<{
    data: (Account )[]; // Joining subscription data with account
    pageCount: number;
    pageSize: number;
    page: number;
  }>,
) {

  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex justify-end'}>
        <AccountsTableFilters />
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

function AccountsTableFilters() {
  const form = useForm({
    resolver: zodResolver(FiltersSchema),
    defaultValues: {
      query: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = (data: z.infer<typeof FiltersSchema>) => {
    // Implement your query functionality here if needed
  };

  return (
    <form className={'flex gap-2.5'} onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        className={'w-full'}
        placeholder={`Search account...`}
        {...form.register('query')}
      />
    </form>
  );
}

function getColumns():  ColumnDef<Account>[] {
  return [
    {
      id: 'name',
      header: 'Account Name',
      cell: ({ row }) => {
        return (
          <Link className={'hover:underline'} href={`/admin/accounts/${row.original.id}`}>
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
      id: 'created_at',
      header: 'Subscription Created At',
      accessorKey: 'subscription.created_at',
    },
    {
      id: 'updated_at',
      header: 'Subscription Updated At',
      accessorKey: 'subscription.updated_at',
    },
  ];
}
