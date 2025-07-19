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
    <html lang="en">
         
            
            <head>
                    <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Figtree:wght@400;500;700&display=swap"
                rel="stylesheet"
              />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
        {/* Primary SEO */}
        <meta name="author" content="Greenalytic Motors Ltd" />
        <meta name="theme-color" content="#1B9C85" />
        <meta name="robots" content="index, follow" />
      
        {/* Open Graph for social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Greenalytic Motors – Clean Mobility in Africa" />
        <meta property="og:description" content="Fleet emissions monitoring, fuel tracking, diagnostics, and reports." />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:url" content="https://greenalytic.rw" />
      
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Greenalytic Motors – Real-time Fleet Monitoring" />
        <meta name="twitter:description" content="Track emissions, speed, and fuel data across your fleet in Africa." />
        <meta name="twitter:image" content="/images/logo.png" />
      
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Figtree:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      
 
    <AuthProvider>
      <body className="font-body text-midnight_text bg-white dark:bg-darkmode transition-all duration-300 antialiased">
        {/* ✅ Client-side Navbar */}


        {/* ✅ Page Content with Transitions */}
        <main className="">
          {/* <PageTransition> */}
            {children}
            
          {/* </PageTransition> */}
        </main>



      </body>
          </AuthProvider>
    </html>
  );
}

