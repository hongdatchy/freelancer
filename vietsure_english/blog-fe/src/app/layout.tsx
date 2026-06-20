import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
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
      <body className={`${nunito.className} antialiased`}>
        <BreadcrumbProvider>
          <Header />
          {children}
          <Footer />
        </BreadcrumbProvider>
      </body>
    </html>
  );
}