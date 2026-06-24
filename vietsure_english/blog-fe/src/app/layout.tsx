import type { Metadata } from 'next';
import { Nunito, Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/layout/header';
import Footer from '@/layout/footer';
import { BreadcrumbProvider } from '@/context/useBreadcrumb';
import FloatingContact from '@/components/custom/common/floating-contact';

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
      <body className={`${nunito.className} antialiased`}>
        <BreadcrumbProvider>
          <Header />
          {children}
          <Footer />
          <FloatingContact />
        </BreadcrumbProvider>
      </body>
    </html>
  );
}