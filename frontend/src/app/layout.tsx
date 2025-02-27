"use client";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isAdminDash = pathname?.startsWith("/admin-dash");
    const isFamilyDash = pathname?.startsWith("/client-dash");
    const shouldShowHeaderFooter = !isAdminDash && !isFamilyDash;
  return (
    <html lang="en">
      <head>
        {/* Meta tags for SEO and social media sharing */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Imanariyo Baptiste" />
        <meta
          name="description"
          content="Real-time monitoring for vehicle health, location, emissions, and more."
        />
        <meta
          name="keywords"
          content="Greenalytic, Vehicle Monitoring, Fleet Management, Car Health, Emissions Tracking, GPS Tracking"
        />
        <meta name="generator" content="Next.js" />

        {/* Favicon */}
        <link rel="icon" href="/images/logo.png" sizes="32x32" />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Greenalytic - Vehicle Monitoring" />
        <meta
          property="og:description"
          content="Real-time vehicle monitoring for efficient fleet management."
        />
        <meta property="og:url" content="https://www.greenalytic.com" />
        <meta property="og:image" content="/images/logo.png" />

        {/* Twitter */}
        <meta
          property="twitter:title"
          content="Greenalytic - Vehicle Monitoring"
        />
        <meta
          property="twitter:description"
          content="Track vehicle health and emissions in real-time with Greenalytic."
        />
        <meta property="twitter:image" content="/images/logo.png" />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {shouldShowHeaderFooter && <Header />}
          <main className="flex-grow bg-bg-primary dark:bg-bg-fourth text-tx-third dark:text-tx-primary">
            {children}
          </main>
          {shouldShowHeaderFooter && <Footer />}
        </div>
      </body>
    </html>
  );
}
