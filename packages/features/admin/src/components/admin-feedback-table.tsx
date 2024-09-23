'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { Input } from '@kit/ui/input';
import { Button } from '@kit/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { Database } from '@kit/supabase/database';
import { formatDate } from 'date-fns';

type Feedback = Database['public']['Tables']['feedback']['Row'];

const FiltersSchema = z.object({
  query: z.string().optional(),
});

export function FeedbackTable(
  props: React.PropsWithChildren<{
    data: (Feedback)[];
    pageCount: number;
    pageSize: number;
    page: number;
  }>,
) {

  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex justify-end'}>
        <FeedbackTableFilters />
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

function FeedbackTableFilters() {
  const form = useForm({
    resolver: zodResolver(FiltersSchema),
    defaultValues: {
      query: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const router = useRouter();
  const pathName = usePathname();
  const onSubmit = ({query }: z.infer<typeof FiltersSchema>) => {
    const params = new URLSearchParams({
        query: query ?? '',
      });
  
      const url = `${pathName}?${params.toString()}`;
  
      router.push(url);
  };

  return (
    <form className={'flex gap-2.5'} onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        className={'w-full'}
        placeholder={`Search feedback...`}
        {...form.register('query')}
      />
    <Button type="submit" className={'ml-2'}>
        Search
    </Button>
    </form>
  );
}

function getColumns(): ColumnDef<Feedback>[] {
  return [
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'comment',
      header: 'Comment',
      accessorKey: 'comment',
    },
    {
      id: 'rating',
      header: 'Rating',
      accessorKey: 'rating',
    },
    {
      id: 'liked',
      header: 'Liked',
      accessorKey: 'liked',
      cell: ({ row }) => (row.original.liked ? 'Yes' : 'No'),
    },
    {
      id: 'created_at',
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        return row.original.created_at && formatDate(row.original.created_at,'P');
      },
    },
  ];
}
