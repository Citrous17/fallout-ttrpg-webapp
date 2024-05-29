import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import type { Metadata } from 'next';
 
const metadata: Metadata = {
  title: {
    template: '%s | Fallout',
    default: 'Fallout Dashboard',
  },
  description: 'A Fallout dashboard for the TTRPG',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  };

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}