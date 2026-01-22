import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { AuthProvider } from '@/lib/use-auth';

export const metadata: Metadata = {
  title: 'Greenalytic Motors – Clean Mobility Monitoring & Emissions Analytics',
  description: 'Real-time vehicle emissions monitoring, GPS tracking, OBD-II diagnostics, and fleet analytics. Greenalytic Motors is powering cleaner transportation in Africa.',
  keywords: [
    'Vehicle Monitoring',
    'OBD II Data',
    'Emissions Analytics',
    'Fleet Management Rwanda',
    'Real-time GPS Tracking',
    'Speed Monitoring',
    'Fuel Efficiency',
    'Green Mobility',
    'Greenalytic Motors',
    'Clean Transport Africa'
  ],
  openGraph: {
    title: 'Greenalytic Motors – Fleet Monitoring & Emissions Insights',
    description:
      'Greenalytic Motors enables real-time tracking and analytics for emissions, speed, fuel, and diagnostics across your fleet.',
    url: 'https://greenalytic.rw',
    siteName: 'Greenalytic Motors',
    images: [
      {
        url: '/images/logo.png', // Public path
        width: 1200,
        height: 630,
        alt: 'Greenalytic Motors Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenalytic Motors – Real-time Fleet Monitoring Platform',
    description:
      'Reduce emissions, improve efficiency. Monitor your vehicles with Greenalytic Motors.',
    images: ['/images/logo.png'],
  },
  metadataBase: new URL('https://greenalytic.rw'),
  icons: {
    icon: '/favicon.ico',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Figtree:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-midnight_text bg-white dark:bg-darkmode transition-all duration-300 antialiased">
        <AuthProvider>
          {/* ✅ Page Content with Transitions */}
          <main className="">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

