import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@/styles/image-protection.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ProtectedContent from '@/components/auth/ProtectedContent';
import ProtectionOverlay from '@/components/ui/ProtectionOverlay';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '600D Photography Portfolio',
  description: 'Professional photography portfolio by 600D Photography',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  referrer: 'no-referrer',
  other: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProtectionOverlay />
        <AuthProvider>
          <ProtectedContent>
            {children}
          </ProtectedContent>
        </AuthProvider>
      </body>
    </html>
  );
}
