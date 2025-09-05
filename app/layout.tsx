import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GigFlow - Your curated path to online earning',
  description: 'Discover legitimate online earning opportunities and learn micro-skills to boost your income.',
  keywords: 'freelance, gigs, online earning, skills, remote work',
  openGraph: {
    title: 'GigFlow - Your curated path to online earning',
    description: 'Discover legitimate online earning opportunities and learn micro-skills to boost your income.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
