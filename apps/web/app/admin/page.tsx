import { AdminDashboard } from '@kit/admin/components/admin-dashboard';
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { PageBody, PageHeader } from '@kit/ui/page';
import MrrChart from './_components/mrr-chart';

function AdminPage() {
  return (
    <>
      <PageHeader
        title={'Super Admin'}
        description={`Your SaaS stats at a glance`}
      />

      <PageBody>
        <AdminDashboard />
        <MrrChart/>
      </PageBody>
    </>
  );
}

export default AdminGuard(AdminPage);
