import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToasterProvider } from "@/components/providers/toaster-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR Code Scanner',
  description: 'A modern QR code scanner progressive web app',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}