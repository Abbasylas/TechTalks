import { sampleApplications } from './data';

export default function DashboardOverviewPage() {
  const totalApplications = sampleApplications.length;

  return (
    <main>
      <h1>Dashboard Overview</h1>
      <p><strong>Total Applications:</strong> {totalApplications}</p>
      <p><em>Keep pushing forward! You are making great progress tracking your opportunities.</em></p>
    </main>
  );
}
