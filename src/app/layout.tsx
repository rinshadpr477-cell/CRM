import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProspectProvider } from '@/context/ProspectContext';
import { MainLayout } from '@/components/layout/MainLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Prospect CRM — B2B Lead Management & Pipeline Analytics',
  description:
    'Modern enterprise prospect management platform. Track sales pipeline, qualify leads, and analyze account activity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#f9f9ff] text-slate-900 antialiased selection:bg-blue-100 selection:text-[#004e9f]">
        <ProspectProvider>
          <MainLayout>{children}</MainLayout>
        </ProspectProvider>
      </body>
    </html>
  );
}
