import TrialSection from "@/components/custom/common/traial-section";
import { Mail, Phone, Facebook } from 'lucide-react';

export default function FAQ() {
  return (
    <>
      {/* Import Be Vietnam Pro and Material Symbols */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap" 
        rel="stylesheet" 
      />
      <link 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        rel="stylesheet" 
      />

      <style dangerouslySetInnerHTML={{__html: `
        .faq-page-body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background-color: #f7f9ff;
          color: #24389c;
        }
        .faq-container {
          box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.05);
        }
        .list-item::before {
          content: "•";
          color: #24389c;
          font-weight: bold;
          display: inline-block;
          width: 1em;
          margin-left: -1em;
        }
        .bg-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(circle at 10% 20%, rgba(36, 56, 156, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(36, 56, 156, 0.03) 0%, transparent 40%);
        }
      `}} />

      <div className="faq-page-body min-h-screen relative flex flex-col items-center py-20 px-6 overflow-hidden">
        <div className="bg-glow"></div>
        
        <main className="w-full max-w-[1100px] relative z-10 text-[#24389c]">
          
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] leading-[1.2] font-extrabold text-[#24389c] mb-2 tracking-tight">
              CÂU HỎI THƯỜNG GẶP
            </h1>
          </div>

          {/* Document Container */}
          <article className="faq-container bg-white rounded-xl p-8 md:p-12 text-[#24389c] mb-8">
            
            {/* Section: Payment Methods */}
            <section className="mb-8" id="payment-methods">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                Phương thức thanh toán
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2 text-[#24389c]">
                  Phụ huynh có thể thanh toán học phí qua các hình thức:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4 mb-6">
                  <li className="list-item">Chuyển khoản ngân hàng: <strong>MB Bank</strong></li>
                  <li className="list-item">Thanh toán trả góp 0%</li>
                  <li className="list-item">Thanh toán tiền mặt</li>
                </ul>

                {/* Specific Method 1 */}
                <div className="mb-6 p-5 bg-[#f0f7ff] rounded-2xl border border-blue-100/50 text-[#24389c]">
                  <h3 className="font-bold text-[#24389c] mb-2 text-base">Phương thức 1: Chuyển khoản ngân hàng</h3>
                  <p className="text-sm text-[#24389c] mb-3 italic">Quý phụ huynh và học viên có thể chuyển khoản theo thông tin ngân hàng sau:</p>
                  <div className="space-y-1.5 font-semibold text-[#24389c] text-sm">
                    <p>Ngân hàng Thương mại cổ phần Quân đội (MB Bank)</p>
                    <p>• Chủ tài khoản: Công ty TNHH Việt Sure Education</p>
                    <p>• Số tài khoản: 500593979</p>
                    <p>• Chi nhánh: Nam Hồ Chí Minh</p>
                    <p>• Nội dung chuyển khoản: Họ và tên + SĐT</p>
                  </div>
                </div>

                {/* Specific Method 2 */}
                <div className="p-5 bg-[#f0f7ff] rounded-2xl border border-blue-100/50 text-[#24389c]">
                  <h3 className="font-bold text-[#24389c] mb-2 text-base">Phương thức 2: Thanh toán tiền mặt</h3>
                  <p className="text-sm text-[#24389c] mb-3 italic">Quý phụ huynh và học viên có thể thanh toán tiền mặt theo thông tin sau:</p>
                  <div className="text-sm text-[#24389c] space-y-1.5 font-medium">
                    <p className="font-extrabold text-[#24389c]">CÔNG TY TNHH VIỆT SURE EDUCATION</p>
                    <p>Trụ sở: A12, Khu nhà ở Hoàng Hùng 5, đường Nguyễn Thị Khắp, khu phố Chiêu Liêu, Phường Tân Đông Hiệp, TP. HCM</p>
                    <p>Số điện thoại: 0357 171 381</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Refund Policy */}
            <section id="refund-policy" className="border-t border-gray-100 pt-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-6">
                Chính sách hoàn học phí
              </h2>
              <div className="pl-6 space-y-6">
                
                {/* Item 1 */}
                <div>
                  <h4 className="font-bold text-[#24389c] mb-2 text-base">1. Quy định chung</h4>
                  <p className="text-[16px] leading-[1.6] font-normal text-[#24389c]">
                    Không hoàn lại học phí đã đóng đối với bất kỳ trường hợp nào chủ động xin dừng học, trừ các trường hợp đặc biệt như: bệnh nặng, tai nạn, tử vong không thể tiếp tục việc học.
                  </p>
                </div>

                {/* Item 2 */}
                <div>
                  <h4 className="font-bold text-[#24389c] mb-2 text-base">2. Mức hoàn trả học phí</h4>
                  <p className="text-[16px] leading-[1.6] font-normal text-[#24389c]">
                    Mức hoàn trả học phí = Tổng học phí khóa học đã đóng - Chi phí các buổi học đã học - phí giao hàng (nếu có) - quà tặng (nếu có) - phí chuyển khoản (nếu có)
                  </p>
                </div>

                {/* Item 3 */}
                <div>
                  <h4 className="font-bold text-[#24389c] mb-2 text-base">3. Phương thức hoàn học phí</h4>
                  <p className="text-[16px] leading-[1.6] font-normal text-[#24389c] mb-4">
                    Vietsure English sẽ chỉ dùng 1 phương thức chuyển khoản qua ngân hàng để hoàn trả học phí.
                  </p>
                  <div className="bg-[#f0f7ff] p-5 rounded-2xl border border-blue-100/50 text-[#24389c]">
                    <p className="text-sm font-semibold mb-2 text-[#24389c]">Để tiến hành thủ tục hoàn học phí, ba mẹ vui lòng để lại thông tin tài khoản như sau:</p>
                    <ul className="text-sm text-[#24389c] space-y-1.5 font-medium pl-2">
                      <li>• Tên ngân hàng kèm chi nhánh</li>
                      <li>• Số tài khoản</li>
                      <li>• Chủ tài khoản</li>
                    </ul>
                  </div>
                </div>

                {/* Item 3 repeat (Process) */}
                <div>
                  <h4 className="font-bold text-[#24389c] mb-2 text-base">3. Quy trình thực hiện</h4>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                    <li className="list-item">Thời gian xét duyệt: Tối đa 15 ngày kể từ ngày Trung tâm nhận được đơn xin rút học phí của học viên.</li>
                    <li className="list-item">Thời gian hoàn học phí: Tối đa 30 ngày kể từ ngày cả 2 bên xác nhận đồng ý hoàn trả học phí.</li>
                  </ul>
                </div>

                {/* Item 4 */}
                <div>
                  <h4 className="font-bold text-[#24389c] mb-2 text-base">4. Các điều kiện không được xét duyệt hoàn phí</h4>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4 mb-4">
                    <li className="list-item">Học viên đã tham gia vào khóa học 1 phần hoặc toàn bộ khóa học.</li>
                    <li className="list-item">Phụ huynh/học viên không còn nhu cầu học do thay đổi kế hoạch cá nhân, lịch học, chưa tham khảo kỹ nội dung khóa học trước khi đăng ký, học viên không thích học nữa hoặc những lý do cá nhân khác.</li>
                    <li className="list-item">Phụ huynh muốn hoàn tiền để đăng ký khóa học khác cho con không phải ở Vietsure English.</li>
                    <li className="list-item">Một số lý do đến từ lỗi kỹ thuật từ phía học viên (đường truyền kém, thiết bị chưa đáp ứng được việc học online,...)</li>
                    <li className="list-item">Học viên vắng mặt, bỏ buổi học hoặc không hoàn thành khóa học.</li>
                  </ul>
                  <p className="text-[16px] leading-[1.6] font-normal text-[#24389c] italic">
                    Mặc dù Vietsure English chưa hỗ trợ hoàn học phí nhưng để đảm bảo quyền lợi cho Phụ huynh, chúng tôi đề xuất các phương án sau:
                  </p>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4 mt-2 font-semibold text-[#24389c]">
                    <li className="list-item">Bảo lưu khóa học theo quy định.</li>
                    <li className="list-item">Chuyển nhượng khóa học cho Phụ huynh khác, Vietsure English sẽ hỗ trợ thay đổi thông tin học viên và cập nhật với mức học phí còn lại của Phụ huynh.</li>
                    <li className="list-item">Điều chỉnh sang khóa học khác phù hợp hơn với bé vẫn tại Vietsure English.</li>
                  </ul>
                </div>

              </div>
            </section>
          </article>

          {/* Contact Channels Section */}
          <article className="faq-container bg-white rounded-xl p-8 md:p-12 text-[#24389c]">
            <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-6">
              Các kênh liên lạc
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
              
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="bg-[#24389c] p-2.5 rounded-xl text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[#24389c] font-bold text-sm">
                  Email: <a className="hover:underline text-[#24389c] font-medium" href="mailto:vietsureenglish@gmail.com">vietsureenglish@gmail.com</a>
                </span>
              </div>

              {/* Hotline */}
              <div className="flex items-center space-x-4">
                <div className="bg-[#24389c] p-2.5 rounded-xl text-white">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[#24389c] font-bold text-sm">
                  Hotline: <a className="hover:underline text-[#24389c] font-medium" href="tel:0357171381">0357 171 381</a>
                </span>
              </div>

              {/* Fanpage */}
              <div className="flex items-center space-x-4">
                <div className="bg-[#24389c] p-2.5 rounded-xl text-white">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-[#24389c] font-bold text-sm">
                  Fanpage: <a className="hover:underline text-[#24389c] font-medium" target="_blank" href="https://www.facebook.com/vietsureenglish">Vietsure English</a>
                </span>
              </div>

              {/* Tiktok */}
              <div className="flex items-center space-x-4">
                <div className="bg-[#24389c] p-2.5 rounded-xl text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.47-.15-.1-.3-.21-.45-.32v6.59c.02 2.1-.82 4.21-2.45 5.55-1.89 1.54-4.57 1.94-6.85 1.14-2.32-.8-4.11-2.99-4.33-5.45-.31-3.2 1.93-6.4 5.1-7.14.78-.18 1.58-.21 2.38-.12v4.01c-.9-.24-1.91-.12-2.7.41-.8.53-1.28 1.52-1.15 2.47.15 1.15 1.13 2.11 2.27 2.18 1.05.07 2.1-.53 2.53-1.48.16-.36.21-.75.2-1.14V.02z"></path>
                  </svg>
                </div>
                <span className="text-[#24389c] font-bold text-sm">
                  Tiktok: <a className="hover:underline text-[#24389c] font-medium" target="_blank" href="https://www.tiktok.com">Vietsure English</a>
                </span>
              </div>

            </div>
          </article>



        </main>
      </div>

      {/* Trial Register Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>
    </>
  );
}