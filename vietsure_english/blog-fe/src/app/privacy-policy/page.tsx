import TrialSection from "@/components/custom/common/traial-section";

export default function PrivacyPolicy() {
  return (
    <>
      {/* Fonts loaded via layout */}

      <style dangerouslySetInnerHTML={{__html: `
        .privacy-page-body {
          background-color: #f7f9ff;
          color: #091d2e;
        }
        .policy-container {
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

      <div className="privacy-page-body min-h-screen relative flex flex-col items-center py-20 px-6 overflow-hidden">
        <div className="bg-glow"></div>
        
        <main className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 relative z-10">
          
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="section-title">
              CHÍNH SÁCH BẢO MẬT
            </h1>
          </div>

          {/* Document Container */}
          <article className="policy-container bg-white rounded-xl p-8 md:p-12 text-[#24389c]">
            <div className="mb-8">
              <p className="text-[16px] leading-[1.6] font-normal mb-4">
                Vietsure English cam kết bảo vệ tuyệt đối thông tin cá nhân của học viên và phụ huynh. Chính sách bảo mật này được xây dựng nhằm giúp người dùng hiểu rõ cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu trong quá trình sử dụng website và dịch vụ.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                1. Thông tin chúng tôi thu thập
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Vietsure English có thể thu thập các thông tin sau:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Họ và tên phụ huynh/học viên</li>
                  <li className="list-item">Số điện thoại, email liên hệ, địa chỉ nhà</li>
                  <li className="list-item">Độ tuổi và nhu cầu học tập của trẻ</li>
                  <li className="list-item">Thông tin liên quan đến quá trình học tập</li>
                  <li className="list-item">Dữ liệu truy cập website (cookies, hành vi người dùng)</li>
                  <li className="list-item">Việc thu thập thông tin tin giúp chúng tôi tư vấn chính xác và nâng cao chất lượng đào tạo.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                2. Mục đích sử dụng thông tin
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Thông tin cá nhân được sử dụng với các mục đích:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Tư vấn khóa học phù hợp cho từng học viên</li>
                  <li className="list-item">Xây dựng lộ trình học tập cá nhân hóa</li>
                  <li className="list-item">Theo dõi và đánh giá tiến độ học tập</li>
                  <li className="list-item">Hỗ trợ phụ huynh trong suốt quá trình học</li>
                  <li className="list-item">Cải thiện chất lượng dịch vụ và trải nghiệm người dùng</li>
                  <li className="list-item">Chúng tôi cam kết chỉ sử dụng thông tin đúng mục đích và minh bạch.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                3. Cam kết bảo mật thông tin
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Chúng tôi cam kết:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Không chia sẻ, mua bán hoặc trao đổi thông tin cá nhân với bên thứ ba</li>
                  <li className="list-item">Áp dụng các biện pháp bảo mật kỹ thuật và quản lý chặt chẽ</li>
                  <li className="list-item">Chỉ cho phép nhân sự liên quan truy cập dữ liệu khi cần thiết</li>
                  <li className="list-item">Thông tin của bạn luôn được bảo vệ theo tiêu chuẩn an toàn cao nhất.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                4. Quyền của phụ huynh và học viên
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Người dùng có quyền:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Yêu cầu xem, chỉnh sửa hoặc cập nhật thông tin cá nhân</li>
                  <li className="list-item">Yêu cầu xóa hoặc ngừng sử dụng dữ liệu</li>
                  <li className="list-item">Từ chối nhận thông tin quảng cáo bất kỳ lúc nào</li>
                  <li className="list-item">Chúng tôi luôn tôn trọng quyền riêng tư và quyết định của người dùng.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                5. Cookies và công nghệ theo dõi
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Website sử dụng cookies để:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Ghi nhớ thông tin người dùng</li>
                  <li className="list-item">Phân tích và cải thiện trải nghiệm</li>
                  <li className="list-item">Người dùng có thể chủ động tắt cookies trong trình duyệt.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                6. Thay đổi chính sách
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-normal">
                  Chính sách này có thể được cập nhật để phù hợp với quy định pháp luật và hoạt động của Vietsure English. Mọi thay đổi sẽ được công bố trên website.
                </p>
              </div>
            </section>
          </article>



        </main>
      </div>

      {/* Trial Section at the bottom */}
      <section className="bg-white">
        <TrialSection />
      </section>
    </>
  );
}