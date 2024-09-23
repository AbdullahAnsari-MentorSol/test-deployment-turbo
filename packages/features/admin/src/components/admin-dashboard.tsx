import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@kit/ui/card';

import { loadAdminDashboard } from '../lib/server/loaders/admin-dashboard.loader';

export async function AdminDashboard() {
  const data = await loadAdminDashboard();

  return (
    <div
      className={
        'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3' +
        ' xl:grid-cols-4 mb-4'
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>

          <CardDescription>
            The number of personal accounts that have been created.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={'flex justify-between'}>
            <Figure>{data.accounts}</Figure>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Starter Plan</CardTitle>

          <CardDescription>
            The number of starter plan subscriptions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={'flex justify-between'}>
            <Figure>{data.starterSubscriptions}</Figure>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pro Plan</CardTitle>

          <CardDescription>
            The number of pro plan subscriptions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={'flex justify-between'}>
            <Figure>{data.proSubscriptions}</Figure>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Plan</CardTitle>

          <CardDescription>
            The number of enterprise plan subscriptions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className={'flex justify-between'}>
            <Figure>{data.enterpriseSubscriptions}</Figure>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Figure(props: React.PropsWithChildren) {
  return <div className={'text-3xl font-bold'}>{props.children}</div>;
}
