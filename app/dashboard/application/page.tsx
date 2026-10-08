import { sampleApplications } from '../data';

export default function DashboardApplicationsPage() {
  return (
    <main>
      <h1>Your Applications</h1>
      <div>
        {sampleApplications.map((app) => (
          <div key={app.id} style={{ margin: '1rem 0' }}>
            <h2>{app.title}</h2>
            <p>Company: {app.company}</p>
            <p>Status: <strong>{app.status}</strong></p>
          </div>
        ))}
      </div>
    </main>
  );
}
