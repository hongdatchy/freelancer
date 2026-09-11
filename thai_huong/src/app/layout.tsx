import type { Metadata } from "next";
import "./globals.css";
import Header from "@/layout/header";
import Footer from "@/layout/footer";
import { NotificationProvider } from "@/context/notification-context";

export const metadata: Metadata = {
  title: "Thái Hương Schedule - Theo Dõi Tiến Độ Sản Xuất",
  description:
    "Hệ thống quản lý tiến độ 7 mốc sản xuất mỹ phẩm và thông báo tự động giữa Dược Mỹ Phẩm Thái Hương và Khách Hàng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-slate-50/50 font-sans antialiased text-slate-900">
        <NotificationProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
