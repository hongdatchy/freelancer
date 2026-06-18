import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0f2d3f] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        {/* Về Chúng Tôi */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#27ba77] w-fit">Về Chúng Tôi</h3>
          <p className="mb-4">
            Dịch Vụ Mạng Xã Hội Phạm Tuấn là nền tảng hàng đầu cung cấp các khóa học và giải pháp toàn diện về marketing số và phát triển cá nhân.
          </p>
          <div className="flex gap-4 text-white">
            <Facebook className="w-5 h-5" />
            <Twitter className="w-5 h-5" />
            <Linkedin className="w-5 h-5" />
            <Instagram className="w-5 h-5" />
          </div>
        </div>

        {/* Liên Kết Nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#27ba77] w-fit">Liên Kết Nhanh</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-[#27ba77] transition-colors">Trang chủ</Link>
            </li>
            <li>
              <Link href="/search-post" className="hover:text-[#27ba77] transition-colors">Khóa học</Link>
            </li>
            <li>
              <Link href="/my-courses" className="hover:text-[#27ba77] transition-colors">Khóa học của tôi</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#27ba77] transition-colors">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#27ba77] transition-colors">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Thông Tin Liên Hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#27ba77] w-fit">Thông Tin Liên Hệ</h3>
          <ul className="space-y-2">
            <li>Biêt Thự Hải Âu 2-224 Vinhomes Ocean Park, Gia Lâm, Hà Nội</li>
            <li>Điện thoại: 0929522222 - 0911222229</li>
            <li>Email: phamtuanacademy@gmail.com</li>
            <li>Giờ làm việc: 8:00 - 22:00 hàng ngày</li>
          </ul>
        </div>

        {/* Đăng Ký Nhận Tin */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#27ba77] w-fit">Đăng Ký Nhận Tin</h3>
          <p className="mb-4">Nhận thông tin mới nhất về khóa học và ưu đãi đặc biệt qua email của bạn.</p>
          <div className="flex gap-2">
            <Input placeholder="Email của bạn" className="bg-white text-black" />
            <Button variant="default">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center mt-12 text-xs border-t border-white/20 pt-6">
        © 2024 Dịch Vụ Mạng Xã Hội Phạm Tuấn. Bảo lưu mọi quyền.
      </div>
    </footer>
  )
}
