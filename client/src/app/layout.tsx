import type { Metadata } from 'next';
import { Outfit, Inter, Space_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';

// Optimize Google Fonts loading
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ParkSense — Real-Time Smart Campus Parking Tracker',
  description: 'Frosted, real-time parking tracking HUD, customized for AKTU campuses.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${spaceMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('parksense-theme') || 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body bg-bg-base text-text-primary antialiased selection:bg-accent-glow selection:text-text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

