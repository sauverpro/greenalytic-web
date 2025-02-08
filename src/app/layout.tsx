import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Greenalytic - Vehicle Monitoring",
  description:
    "Real-time monitoring for vehicle health, location, emissions, and more.",
  keywords: [
    "Greenalytic",
    "Vehicle Monitoring",
    "Fleet Management",
    "Car Health",
    "Emissions Tracking",
    "GPS Tracking"
  ],
  authors: [{ name: "Imanariyo Baptiste" }],
  creator: "Imanariyo Baptiste",
  publisher: "Greenalytic",
  openGraph: {
    title: "Greenalytic - Vehicle Monitoring",
    description: "Real-time vehicle monitoring for efficient fleet management.",
    url: "https://www.greenalytic.com", // Replace with your actual URL
    siteName: "Greenalytic",
    images: [
      {
        url: "/images/logo.png", // Path to your logo image
        width: 1200,
        height: 630,
        alt: "Greenalytic - Vehicle Monitoring"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Greenalytic - Vehicle Monitoring",
    description:
      "Track vehicle health and emissions in real-time with Greenalytic.",
    images: ["/images/logo.png"], // Path to your logo image
    creator: "@imanariyobaptiste" // Replace with your Twitter handle
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body
>
        {children}
      </body>
    </html>
  );
}
