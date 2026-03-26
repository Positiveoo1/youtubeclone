/**
 * Global Layout
 * Wrapper for the entire application
 */

import React from 'react';
import RootLayoutClient from './layout-client.tsx';
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="YouTube Clone - Stream your favorite videos with modern design and features"
        />
        <title>YouTube Clone 2026</title>
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
