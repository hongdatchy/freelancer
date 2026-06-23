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
      <section className="relative bg-gradient-to-b from-[#E2F0FF] to-white pb-16 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-24 relative z-10">
          <div className="grid items-center lg:gap-12 lg:grid-cols-2">
            
            {/* Left side: Banner composite image */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1 w-full">
              <div className="relative w-full max-w-[560px] select-none">
                <Image
                  src="/images/Group18.png"
                  alt="VietSure Ambassador Banner"
                  width={560}
                  height={560}
                  className="h-auto w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>

            {/* Right side: Introduction content */}
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right order-1 lg:order-2 w-full">
              <h1 className="section-title mb-3">
                GIỚI THIỆU KHÓA HỌC <span className="text-[#FF6B00]">CHẤT LƯỢNG CAO</span>
              </h1>
              
              <h2 className="section-subtitle mb-8">
                VỪA TẠO GIÁ TRỊ, VỪA NHẬN THƯỞNG TIỀN TRIỆU
              </h2>

              <ul className="mb-8 space-y-4 max-w-lg w-full flex flex-col items-center lg:items-end">
                <li className="flex items-center justify-end gap-3 text-right">
                  <p className="text-sm md:text-[16px] font-extrabold text-[#3F489A] leading-snug">
                    Thưởng hấp dẫn cho mỗi học viên đăng ký thành công
                  </p>
                  <div className="h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                </li>
                <li className="flex items-center justify-end gap-3 text-right">
                  <p className="text-sm md:text-[16px] font-extrabold text-[#3F489A] leading-snug">
                    Linh hoạt thời gian, phù hợp làm thêm tại nhà
                  </p>
                  <div className="h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                </li>
                <li className="flex items-center justify-end gap-3 text-right">
                  <p className="text-sm md:text-[16px] font-extrabold text-[#3F489A] leading-snug">
                    Chương trình cộng tác miễn phí linh hoạt
                  </p>
                  <div className="h-5 w-5 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    ✓
                  </div>
                </li>
              </ul>

              <Button className="h-12 rounded-full bg-[#3F489A] hover:bg-[#252a60] px-10 text-base font-bold uppercase transition-all duration-300 transform hover:scale-105 shadow-lg">
                Học thử miễn phí
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ĐỐI TƯỢNG THAM GIA SECTION */}
      <section className="bg-[#3F489A] py-20 text-white relative">
        <div className="container mx-auto px-6 lg:px-24">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="section-title !text-[#FFC700]">
              Đối tượng tham gia
            </h2>
            <div className="w-24 h-[1.5px] bg-white/60 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-10 max-w-6xl mx-auto">
            
            {/* Item 1 */}
            <div className="flex items-center w-full max-w-[520px] mx-auto relative">
              <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full border-[5px] border-white shadow-lg overflow-hidden shrink-0 z-10 select-none">
                <Image
                  src="/images/doituongthamgia1.png"
                  alt="Đối tượng 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 110px, 130px"
                />
              </div>
              <div className="bg-white rounded-[32px] md:rounded-[40px] pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-6 shadow-md flex-1 min-h-[96px] md:min-h-[114px] flex items-center relative ml-[-35px] md:ml-[-45px] z-0
                              before:content-[''] before:absolute before:top-1/2 before:-left-3 md:before:-left-4 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] md:before:border-t-[16px] before:border-t-transparent before:border-b-[12px] md:before:border-b-[16px] before:border-b-transparent before:border-r-[16px] md:before:border-r-[20px] before:border-r-white">
                <p className="text-sm md:text-[17px] text-[#2E357F] font-extrabold leading-tight text-left">
                  Bạn đang có con học tại <br /><span className="text-[#FF6B00] font-black">Vietsure English</span>
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center w-full max-w-[520px] mx-auto relative">
              <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full border-[5px] border-white shadow-lg overflow-hidden shrink-0 z-10 select-none">
                <Image
                  src="/images/doituongthamgia2.png"
                  alt="Đối tượng 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 110px, 130px"
                />
              </div>
              <div className="bg-white rounded-[32px] md:rounded-[40px] pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-6 shadow-md flex-1 min-h-[96px] md:min-h-[114px] flex items-center relative ml-[-35px] md:ml-[-45px] z-0
                              before:content-[''] before:absolute before:top-1/2 before:-left-3 md:before:-left-4 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] md:before:border-t-[16px] before:border-t-transparent before:border-b-[12px] md:before:border-b-[16px] before:border-b-transparent before:border-r-[16px] md:before:border-r-[20px] before:border-r-white">
                <p className="text-sm md:text-[17px] text-[#2E357F] font-extrabold leading-tight text-left">
                  Bạn là <span className="text-[#FF6B00] font-black">giáo viên, giảng viên</span> <br />trong mảng giáo dục
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center w-full max-w-[520px] mx-auto relative">
              <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full border-[5px] border-white shadow-lg overflow-hidden shrink-0 z-10 select-none">
                <Image
                  src="/images/doituongthamgia3.png"
                  alt="Đối tượng 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 110px, 130px"
                />
              </div>
              <div className="bg-white rounded-[32px] md:rounded-[40px] pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-6 shadow-md flex-1 min-h-[96px] md:min-h-[114px] flex items-center relative ml-[-35px] md:ml-[-45px] z-0
                              before:content-[''] before:absolute before:top-1/2 before:-left-3 md:before:-left-4 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] md:before:border-t-[16px] before:border-t-transparent before:border-b-[12px] md:before:border-b-[16px] before:border-b-transparent before:border-r-[16px] md:before:border-r-[20px] before:border-r-white">
                <p className="text-sm md:text-[17px] text-[#2E357F] font-extrabold leading-tight text-left">
                  Bạn là <span className="text-[#FF6B00] font-black">mẹ bỉm sữa, nhân viên văn phòng</span> kiếm thêm thu nhập
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center w-full max-w-[520px] mx-auto relative">
              <div className="relative w-[110px] h-[110px] md:w-[130px] md:h-[130px] rounded-full border-[5px] border-white shadow-lg overflow-hidden shrink-0 z-10 select-none">
                <Image
                  src="/images/doituongthamgia4.png"
                  alt="Đối tượng 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 110px, 130px"
                />
              </div>
              <div className="bg-white rounded-[32px] md:rounded-[40px] pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-6 shadow-md flex-1 min-h-[96px] md:min-h-[114px] flex items-center relative ml-[-35px] md:ml-[-45px] z-0
                              before:content-[''] before:absolute before:top-1/2 before:-left-3 md:before:-left-4 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[12px] md:before:border-t-[16px] before:border-t-transparent before:border-b-[12px] md:before:border-b-[16px] before:border-b-transparent before:border-r-[16px] md:before:border-r-[20px] before:border-r-white">
                <p className="text-sm md:text-[17px] text-[#2E357F] font-extrabold leading-tight text-left">
                  Bạn là <span className="text-[#FF6B00] font-black">Affiliate giáo dục</span>, <br />muốn thêm đối tác
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LỘ TRÌNH HỌC SECTION */}
      <LearningPathSection />

      {/* 4. 4 BƯỚC ĐƠN GIẢN SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-24">
          <h2 className="section-title text-center mb-16">
            4 BƯỚC ĐƠN GIẢN CÓ THÊM THU NHẬP LÊN ĐẾN <span className="text-[#FF6B00]">30 TRIỆU/THÁNG</span> CÙNG VIETSURE ENGLISH
          </h2>

          <div className="max-w-4xl mx-auto flex justify-center w-full">
            <Image
              src="/images/4_buoc.png"
              alt="4 BƯỚC ĐƠN GIẢN"
              width={1000}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* 5. CHÍNH SÁCH VÀ QUYỀN LỢI SECTION */}
      <section className="py-20 bg-[#F3F9FF]">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <h2 className="section-title text-center mb-16">
            CHÍNH SÁCH VÀ QUYỀN LỢI KHI TRỞ THÀNH CTV CỦA VIETSURE ENGLISH
          </h2>

          <div className="flex flex-col gap-10">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_10px_35px_rgba(46,53,127,0.06)] flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto w-full">
              <div className="flex-1 w-full text-left">
                <h3 className="mb-6 text-xl md:text-2xl font-black text-[#2E357F] leading-tight">
                  Hoa hồng & Thưởng hấp dẫn tháng
                </h3>
                <div className="space-y-3.5 text-sm md:text-[16px] font-bold text-[#2E357F]/80">
                  {/* Bullets 1 & 2 */}
                  <div className="space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="text-[#2E357F] shrink-0">•</span>
                      <span>
                        Hoa hồng ghi danh lần đầu: <span className="text-[#FF3B30] font-black">10% giá trị tổng đơn hàng</span> Phụ huynh đăng ký
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-[#2E357F] shrink-0">•</span>
                      <span>
                        Hoa hồng ghi danh lại: 3% giá trị đơn hàng
                      </span>
                    </p>
                  </div>
                  
                  {/* VD Section */}
                  <div className="text-slate-500 space-y-1 font-semibold text-sm md:text-[15px] leading-snug pl-4">
                    <p>
                      VD: Phụ huynh đóng khóa học 10.000.000 VNĐ thì CTV sẽ nhận theo công thức:
                    </p>
                    <p>
                      10.000.000 VNĐ → CTV nhận <span className="text-[#FF3B30] font-bold">x15%</span>
                    </p>
                    <p className="text-[#FF3B30] font-bold">
                      10,000,000 x 15% = 1,500,000 VNĐ / Phụ huynh đầu tiên
                    </p>
                  </div>

                  {/* Bullet 3 Group */}
                  <div className="space-y-1">
                    <p className="flex items-start gap-2">
                      <span className="text-[#2E357F] shrink-0">•</span>
                      <span>
                        <span className="font-extrabold text-[#2E357F]">Từ Phụ huynh thứ 2</span> sẽ là <span className="text-[#FF3B30] font-black">x3%</span>
                      </span>
                    </p>
                    <p className="text-[#FF3B30] font-bold pl-4">
                      10,000,000 x 3% = 300,000 VNĐ / Phụ huynh
                    </p>
                  </div>

                  {/* Bullet 4 Group */}
                  <div className="space-y-1">
                    <p className="flex items-start gap-2">
                      <span className="text-[#2E357F] shrink-0">•</span>
                      <span>
                        Nhận kèm thưởng hàng tháng <span className="text-[#FF3B30] font-black">8.000.000đ</span> nếu tổng doanh thu Phụ huynh
                      </span>
                    </p>
                    <p className="text-[#FF3B30] font-bold pl-4">
                      &gt; 500 triệu tháng
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-[380px] h-[240px] md:h-[260px] relative overflow-hidden rounded-[32px] shrink-0 shadow-sm select-none">
                <Image
                  src="/images/layer-13.png"
                  alt="Layer 13"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_10px_35px_rgba(46,53,127,0.06)] flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 max-w-6xl mx-auto w-full">
              <div className="flex-1 w-full text-left">
                <h3 className="mb-6 text-xl md:text-2xl font-black text-[#2E357F] leading-tight">
                  Theo dõi minh bạch, thanh toán đúng cam kết
                </h3>
                <div className="space-y-2.5 text-sm md:text-[16px] font-bold text-[#2E357F]/80">
                  <p className="flex items-start gap-2">
                    <span className="text-[#2E357F] shrink-0">•</span>
                    <span>Hợp đồng trực tuyến cam kết</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#2E357F] shrink-0">•</span>
                    <span>
                      Thanh toán mỗi tháng vào <span className="text-[#FF3B30] font-black">1-5 của tháng tiếp theo</span> (thời gian để Trung tâm đối chiếu doanh thu thực tế và kết toán doanh thu đúng của tháng đó)
                    </span>
                  </p>
                </div>
              </div>
              <div className="w-full md:w-[380px] h-[240px] md:h-[260px] relative overflow-hidden rounded-[32px] shrink-0 shadow-sm select-none">
                <Image
                  src="/images/layer-14.png"
                  alt="Layer 14"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_10px_35px_rgba(46,53,127,0.06)] flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto w-full">
              <div className="flex-1 w-full text-left">
                <h3 className="mb-6 text-xl md:text-2xl font-black text-[#2E357F] leading-tight">
                  CTV giới thiệu bằng niềm tin, Vietsure English bảo chứng chất lượng
                </h3>
                <div className="space-y-2.5 text-sm md:text-[16px] font-bold text-[#2E357F]/80">
                  <p className="flex items-start gap-2">
                    <span className="text-[#2E357F] shrink-0">•</span>
                    <span>CTV yên tâm giới thiệu bằng uy tín, không lo ảnh hưởng mối quan hệ</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#2E357F] shrink-0">•</span>
                    <span>Chất lượng khóa học và trải nghiệm học tập được Vietsure cam kết uy tín</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-[#2E357F] shrink-0">•</span>
                    <span>Giúp CTV xây dựng nguồn giới thiệu bền vững từ sự tin tưởng lâu dài</span>
                  </p>
                </div>
              </div>
              <div className="w-full md:w-[380px] h-[240px] md:h-[260px] relative overflow-hidden rounded-[32px] shrink-0 shadow-sm select-none">
                <Image
                  src="/images/layer-16.png"
                  alt="Layer 16"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. REGISTRATION FORM */}
      <section className="bg-white">
        <TrialSection />
      </section>

    </div>
  );
}