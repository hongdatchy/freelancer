import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import { NotificationProvider } from "@/context/notification-context";
import { AuthProvider } from "@/context/auth-context";

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Thái Hương Schedule - Theo Dõi Tiến Độ Sản Xuất",
  description:
    "Hệ thống quản lý tiến độ 7 mốc sản xuất mỹ phẩm và thông báo tự động giữa Dược Mỹ Phẩm Thái Hương và Khách Hàng",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Thái Hương",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Thái Hương" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50/50 font-sans antialiased text-slate-900">
        <AuthProvider>
          <NotificationProvider>
            <Header />
            <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
