import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {/* Persistent internal layout sub-navigation */}
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <Link href="/dashboard" style={subLinkStyle}>Overview</Link>
        <Link href="/dashboard/application" style={subLinkStyle}>Applications</Link>
      </nav>
      <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', marginBottom: '1.5rem' }} />
      {children}
    </section>
  );
}

const subLinkStyle = {
  textDecoration: 'none',
  color: '#2563eb',
  fontWeight: 500,
};
