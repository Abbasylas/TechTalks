import Link from 'next/link';
import { opportunities } from '../dashboard/data';

export default function OpportunitiesPage() {
  return (
    <main>
      <h1>Available Opportunities</h1>
      <div>
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} style={{ margin: '1.5rem 0' }}>
            <h2>{opportunity.title}</h2>
            <p>Company: {opportunity.company}</p>
            <p>Location: {opportunity.location}</p>
            <Link href={`/opportunities/${opportunity.id}`}>
              View opportunity
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
