"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import TrialSection from "@/components/custom/common/traial-section";
import LearningPathSection from "@/components/custom/common/learning-path-section";

const steps = [
  {
    id: 1,
    text: "Đăng ký nhận mã CTV miễn phí 100%",
    position: "left",
  },
  {
    id: 2,
    text: "Nhận trọn bộ tài liệu hướng dẫn tư vấn khóa học",
    position: "right",
  },
  {
    id: 3,
    text: "Giới thiệu đến Phụ huynh có nhu cầu cho con học tiếng Anh online (4-12+) qua: Facebook, Tiktok, hội nhóm, Zalo, truyền miệng,...",
    position: "left",
  },
  {
    id: 4,
    text: "Nhận hoa hồng sau khi Phụ huynh hoàn tất đóng học phí thành công",
    position: "right",
  },
];

export default function BrandAmbassadorPage() {
  return (
    <div className="bg-[#F3F9FF]">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-b from-[#E2F0FF] to-white py-16 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-24 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Left side: Banner composite image */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="relative max-w-full">
                <Image
                  src="/images/img-banner.png"
                  alt="VietSure Ambassador Banner"
                  width={560}
                  height={560}
                  className="h-auto max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                  priority
                />
              </div>
            </div>

            {/* Right side: Introduction content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
              <h1 className="text-3xl md:text-[40px] font-black leading-[1.2] tracking-wide text-[#2E357F] uppercase mb-4">
                GIỚI THIỆU KHÓA HỌC <br className="hidden md:inline" />
                <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
              </h1>
              
              <h2 className="text-lg md:text-xl font-extrabold text-[#3F489A] mb-8 leading-snug">
                VỪA TRAO GIÁ TRỊ, VỪA NHẬN THƯỞNG TIỀN TRIỆU
              </h2>

              <ul className="mb-8 space-y-4 max-w-lg">
                <li className="flex items-start gap-3 text-left">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <p className="text-sm md:text-base font-semibold text-slate-600">
                    Thu nhập thụ động - chia sẻ mọi lúc mọi nơi để phát triển bền vững
                  </p>
                </li>
                <li className="flex items-start gap-3 text-left">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <p className="text-sm md:text-base font-semibold text-slate-600">
                    Định hướng thời gian, phát triển bản thân và mở rộng quan hệ
                  </p>
                </li>
                <li className="flex items-start gap-3 text-left">
                  <div className="mt-1 h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  <p className="text-sm md:text-base font-semibold text-slate-600">
                    Chương trình cộng tác hoàn toàn miễn phí
                  </p>
                </li>
              </ul>

              <Button className="h-14 rounded-2xl bg-[#2E357F] hover:bg-[#3F489A] px-10 text-base font-bold uppercase transition-all duration-300 transform hover:scale-105 shadow-md">
                Học thử miễn phí
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ĐỐI TƯỢNG THAM GIA SECTION */}
      <section className="bg-[#3F489A] py-16 text-white relative">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-[#FBBC05] tracking-widest">
              Đối tượng tham gia
            </h2>
            <div className="w-16 h-1 bg-white mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            
            {/* Item 1 */}
            <div className="relative flex items-center bg-white rounded-3xl pl-16 pr-6 py-4 shadow-md max-w-[280px] w-full mx-auto min-h-[80px]">
              <div className="absolute left-[-16px] w-[64px] h-[64px] rounded-full border-[3px] border-[#3F489A] bg-white overflow-hidden shadow-md">
                <Image
                  src="/images/people-1.png"
                  alt="people"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-[#2E357F] font-bold leading-tight text-left">
                Bạn đang có con học tại <span className="text-[#FF6B00]">Vietsure English</span>
              </p>
            </div>

            {/* Item 2 */}
            <div className="relative flex items-center bg-white rounded-3xl pl-16 pr-6 py-4 shadow-md max-w-[280px] w-full mx-auto min-h-[80px]">
              <div className="absolute left-[-16px] w-[64px] h-[64px] rounded-full border-[3px] border-[#3F489A] bg-white overflow-hidden shadow-md">
                <Image
                  src="/images/people-3.png"
                  alt="people"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-[#2E357F] font-bold leading-tight text-left">
                Bạn là <span className="text-[#FF6B00]">giáo viên, giảng viên</span> trong mảng giáo dục
              </p>
            </div>

            {/* Item 3 */}
            <div className="relative flex items-center bg-white rounded-3xl pl-16 pr-6 py-4 shadow-md max-w-[280px] w-full mx-auto min-h-[80px]">
              <div className="absolute left-[-16px] w-[64px] h-[64px] rounded-full border-[3px] border-[#3F489A] bg-white overflow-hidden shadow-md">
                <Image
                  src="/images/people-2.png"
                  alt="people"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-[#2E357F] font-bold leading-tight text-left">
                Bạn là <span className="text-[#FF6B00]">mẹ bỉm sữa, NV văn phòng</span> muốn kiếm thêm thu nhập
              </p>
            </div>

            {/* Item 4 */}
            <div className="relative flex items-center bg-white rounded-3xl pl-16 pr-6 py-4 shadow-md max-w-[280px] w-full mx-auto min-h-[80px]">
              <div className="absolute left-[-16px] w-[64px] h-[64px] rounded-full border-[3px] border-[#3F489A] bg-white overflow-hidden shadow-md">
                <Image
                  src="/images/people-4.png"
                  alt="people"
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs md:text-sm text-[#2E357F] font-bold leading-tight text-left">
                Bạn là <span className="text-[#FF6B00]">Affiliate giáo dục</span>, muốn tìm đối tác uy tín
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LỘ TRÌNH HỌC SECTION */}
      <LearningPathSection />

      {/* 4. 4 BƯỚC ĐƠN GIẢN SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <h2 className="mb-16 text-center text-2xl md:text-[34px] font-black uppercase leading-tight text-[#2E357F]">
            4 BƯỚC ĐƠN GIẢN CÓ THÊM THU NHẬP LÊN ĐẾN <br className="hidden md:inline" />
            <span className="text-[#FF6B00]">30 TRIỆU/THÁNG</span> CÙNG VIETSURE ENGLISH
          </h2>

          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {steps.map((step) => {
              const isLeft = step.position === "left";
              return (
                <div
                  key={step.id}
                  className={`flex items-center w-full min-h-[96px] rounded-2xl border-2 border-[#3F489A]/20 bg-[#F5FAFF] px-8 py-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#3F489A]/60 ${
                    isLeft ? "flex-row justify-start" : "flex-row-reverse justify-between"
                  }`}
                >
                  <span className="text-3xl md:text-4xl font-black text-[#FF6B00] shrink-0 mx-4">
                    {step.id}
                  </span>
                  <p className="text-sm md:text-base font-extrabold text-[#2E357F] leading-snug flex-1">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CHÍNH SÁCH VÀ QUYỀN LỢI SECTION */}
      <section className="py-16 bg-[#F3F9FF]">
        <div className="container mx-auto px-6 lg:px-24">
          <h2 className="mb-16 text-center text-2xl lg:text-3xl font-black uppercase text-[#2E357F]">
            CHÍNH SÁCH VÀ QUYỀN LỢI KHI TRỞ THÀNH <br className="hidden md:inline" />
            CTV CỦA VIETSURE ENGLISH
          </h2>

          <div className="grid gap-8 grid-cols-1">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto w-full">
              <div className="flex-1">
                <h3 className="mb-4 text-xl font-black text-[#2E357F] uppercase">
                  Hoa hồng & Thưởng hấp dẫn tháng
                </h3>
                <ul className="space-y-3 text-sm md:text-[15px] font-semibold text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B00] font-black">•</span>
                    <span>
                      Hoa hồng ghi danh lần đầu: <span className="font-extrabold text-[#FF6B00]">10% giá trị tổng đơn hàng phụ huynh đăng ký</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B00] font-black">•</span>
                    <span>
                      Hoa hồng ghi danh lại: <span className="font-extrabold text-[#FF6B00]">3% giá trị đơn hàng</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6B00] font-black">•</span>
                    <span>
                      Tổng doanh thu &gt;500 triệu/tháng: thưởng <span className="font-extrabold text-[#FF6B00]">25,000,000 VNĐ/tháng</span>
                    </span>
                  </li>
                  <li className="text-xs text-slate-400 italic pt-2">
                    Ví dụ: Phụ huynh đóng học phí 10.000.000 VNĐ ⇒ CTV nhận: 10.000.000 x 10% = 1.000.000 VNĐ (phụ huynh đầu tiên).
                    Đạt doanh thu &gt;500 triệu/tháng ⇒ thưởng thêm 10.000.000 VNĐ/tháng.
                  </li>
                </ul>
              </div>
              <div className="w-[180px] h-[120px] relative overflow-hidden rounded-2xl shrink-0">
                <Image
                  src="/images/policy-1.png"
                  alt="policy 1"
                  width={180}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row-reverse items-center gap-8 max-w-4xl mx-auto w-full">
              <div className="flex-1">
                <h3 className="mb-4 text-xl font-black text-[#2E357F] uppercase">
                  Theo dõi minh bạch, thanh toán đúng cam kết
                </h3>
                <ul className="space-y-3 text-sm md:text-[15px] font-semibold text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3BAEFF] font-black">•</span>
                    <span>Hợp đồng trực tuyến cam kết rõ ràng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3BAEFF] font-black">•</span>
                    <span>
                      Thanh toán mỗi tháng từ ngày 1 - 5 của tháng tiếp theo (đối soát doanh thu thực tế)
                    </span>
                  </li>
                </ul>
              </div>
              <div className="w-[180px] h-[120px] relative overflow-hidden rounded-2xl shrink-0">
                <Image
                  src="/images/policy-2.png"
                  alt="policy 2"
                  width={180}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto w-full">
              <div className="flex-1">
                <h3 className="mb-4 text-xl font-black text-[#2E357F] uppercase">
                  CTV giới thiệu bằng niềm tin, Vietsure english bảo chứng chất lượng
                </h3>
                <ul className="space-y-3 text-sm md:text-[15px] font-semibold text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-[#3F489A] font-black">•</span>
                    <span>CTV yên tâm giới thiệu bằng uy tín, không lo ảnh hưởng quan hệ cá nhân</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3F489A] font-black">•</span>
                    <span>Chất lượng khóa học và trải nghiệm học tập được Vietsure cam kết</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#3F489A] font-black">•</span>
                    <span>Xây dựng nguồn thu nhập bền vững từ niềm tin lâu dài</span>
                  </li>
                </ul>
              </div>
              <div className="w-[180px] h-[120px] relative overflow-hidden rounded-2xl shrink-0">
                <Image
                  src="/images/policy-3.png"
                  alt="policy 3"
                  width={180}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. REGISTRATION FORM */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>

    </div>
  );
}