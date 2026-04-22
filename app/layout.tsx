import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";


import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: {
    default: 'TrustRent NG | Verified Property Rentals in Nigeria',
    template: `%s - TrustRent NG`,
  },
  description: 'The safest platform for finding verified rentals, escrow payments, and reliable tenants in Abuja, Nigeria.',
  keywords: ['rent in abuja', 'nigeria property', 'escrow rent', 'trustrent ng'],
  authors: [{ name: 'TrustRent NG' }],
  creator: 'TrustRent NG',
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://muftipay.com',
    title: 'Mufti Pay | Instant Data & Airtime VTU',
    description: 'The smart way to connect. Instant Data, Airtime, Cable TV, and Utility payments. Fast, secure, and built for your daily needs.',
    siteName: 'Mufti Pay',
    images: [
      {
        url: '/muftipay-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Mufti Pay - Reliable VTU Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mufti Pay | Cheap Data, Airtime & Utility Bills',
    description: 'The smart and reliable platform for instant cheap data, airtime VTU, Cable TV subscriptions in Nigeria.',
    creator: '@muftipay',
    images: ['/muftipay-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b6fbf" },
    { media: "(prefers-color-scheme: dark)", color: "#0a3057" },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(

        )}
      >


        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
