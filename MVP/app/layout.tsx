import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import SessionWrapper from '@/components/SessionWrapper';
import ClientLayout from '@/components/ClientLayout';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-family-sans',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-family-serif',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-family-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LocalLens - Discover Your City',
  description: 'Find local businesses, events, and experiences within your perfect radius',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-background text-text-primary antialiased">
        <ToastProvider>
          <SessionWrapper>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SessionWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
