import type { Metadata } from 'next';
import { getColorModeScript } from 'zenput/server';

export const metadata: Metadata = {
  title: 'Zenput Next.js App Router Smoke Test',
  description: 'Verifies zenput works with Next.js App Router',
};

/**
 * Root layout — a **Server Component**.
 *
 * Imports from `zenput/server` (which has no 'use client' and therefore is
 * safe to import in a Server Component), and inlines the color-mode script
 * so ThemeProvider picks up the right mode on first paint.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Inline script injected by zenput/server — prevents theme flash */}
        <script
          dangerouslySetInnerHTML={{ __html: getColorModeScript() }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
