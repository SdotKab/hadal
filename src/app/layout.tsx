import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: 'Hadal',
  description: 'Social Media dApp',
  icons: {
    icon: [
      {
        url: 'icons/hadal2.svg',
        href: 'icons/hadal2.svg',
      },
    ]
  }
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {/* <QueryProvider> */}
        <html lang="en">
          <body>{children}</body>
        </html>
      {/* </QueryProvider> */}
    </ClerkProvider>
  );
}