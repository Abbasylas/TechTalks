import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Yahya - Job Hunt Tracker',
  description: 'Track applications and professional career goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb', color: '#111827' }}>
        
        {/* Global Navigation Header */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <nav style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '1rem', 
            display: 'flex', 
            gap: '1.5rem', 
            flexWrap: 'wrap' 
          }}>
            <Link href="/" style={navLinkStyle}>Home</Link>
            <Link href="/plan" style={navLinkStyle}>Plan</Link>
            <Link href="/opportunities" style={navLinkStyle}>Opportunities</Link>
            <Link href="/dashboard" style={navLinkStyle}>Dashboard</Link>
          </nav>
        </header>

        {/* Layout Framework Wrapper */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
          {children}
        </div>

      </body>
    </html>
  );
}

const navLinkStyle = {
  textDecoration: 'none',
  color: '#4b5563',
  fontWeight: 500,
  fontSize: '0.95rem',
};
