import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/layout/header';
import Footer from '@/layout/footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'PT Entertainment',
  description: 'Created by PT Entertainment',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header/>
        <div className="2xl:px-[250px] px-[20px]">
          <div className="grid gap-12 md:grid-cols-3  mt-20">
            {children}
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
