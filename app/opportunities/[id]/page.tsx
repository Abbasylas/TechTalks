import Link from 'next/link';
import { opportunities } from '../../dashboard/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const opportunity = opportunities.find((opt) => opt.id === id);

  if (!opportunity) {
    return (
      <main>
        <h1>Opportunity Not Found</h1>
        <Link href="/opportunities">Back to Opportunities</Link>
      </main>
    );
  }

  return (
    <main>
      <p><Link href="/opportunities">← Back to all opportunities</Link></p>
      <h1>{opportunity.title}</h1>
      <p>Company: {opportunity.company}</p>
      <p>Location: {opportunity.location}</p>
      <p>{opportunity.description}</p>
    </main>
  );
}
