import type { Metadata } from 'next';
import { Nunito, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import Header from '@/layout/header';
import Footer from '@/layout/footer';
import { BreadcrumbProvider } from '@/context/useBreadcrumb';

if (typeof Promise.withResolvers === 'undefined') {
  (Promise as any).withResolvers = function() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

const nunito = Nunito({
  subsets: ['vietnamese', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-nunito',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-be-vietnam-pro',
});

export const metadata: Metadata = {
  title: 'Vietsure English - Tiếng Anh phản xạ online chuẩn Quốc tế',
  description: 'Vietsure English - Tiếng Anh phản xạ online chuẩn Quốc tế',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${nunito.className} ${beVietnamPro.variable} antialiased`}>
        <BreadcrumbProvider>
          <Header />
          {children}
          <Footer />
        </BreadcrumbProvider>
      </body>
    </html>
  );
}