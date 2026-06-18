import TrialSection from "@/components/custom/common/traial-section";

export default function TermsOfService() {
  return (
    <>
      {/* Import Be Vietnam Pro */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700;800&display=swap" 
        rel="stylesheet" 
      />

      <style dangerouslySetInnerHTML={{__html: `
        .terms-page-body {
          font-family: 'Be Vietnam Pro', sans-serif;
          background-color: #f7f9ff;
          color: #24389c;
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

      <div className="terms-page-body min-h-screen relative flex flex-col items-center py-20 px-6 overflow-hidden">
        <div className="bg-glow"></div>
        
        <main className="w-full max-w-[1100px] relative z-10 text-[#24389c]">
          
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-[40px] leading-[1.2] font-extrabold text-[#24389c] mb-2 tracking-tight">
              ĐIỀU KHOẢN SỬ DỤNG
            </h1>
          </div>

          {/* Document Container */}
          <article className="policy-container bg-white rounded-xl p-8 md:p-12 text-[#24389c]">
            <div className="mb-8">
              <p className="text-[16px] leading-[1.6] font-normal italic mb-4">
                Chào mừng bạn đến với Vietsure English. Khi truy cập website và đăng ký sử dụng dịch vụ của chúng tôi, phụ huynh/học viên đồng ý tuân thủ các điều khoản dịch vụ được quy định dưới đây. Các điều khoản này nhằm đảm bảo quyền lợi của cả hai bên và xây dựng môi trường học tập trực tuyến minh bạch, hiệu quả.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                1. Phạm vi áp dụng
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Điều khoản này áp dụng cho:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Người truy cập website Vietsure English phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của bố mẹ hay người giám hộ hợp pháp.</li>
                  <li className="list-item">Phụ huynh đăng ký khóa học cho học viên.</li>
                  <li className="list-item">Học viên tham gia các chương trình đào tạo.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                2. Dịch vụ cung cấp
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">
                  Chúng tôi cung cấp:
                </p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Các khóa học tiếng Anh trực tuyến cho trẻ em.</li>
                  <li className="list-item">Dịch vụ đánh giá năng lực và tư vấn lộ trình học.</li>
                  <li className="list-item">Hệ thống hỗ trợ học tập và theo dõi tiến độ.</li>
                  <li className="list-item italic">Nội dung và hình thức dịch vụ có thể được điều chỉnh để phù hợp với từng giai đoạn phát triển.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                3. Quyền và trách nhiệm của Vietsure English
              </h2>
              <div className="pl-6 space-y-4">
                <div>
                  <p className="text-[16px] leading-[1.6] font-bold mb-2">Quyền của Vietsure:</p>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                    <li className="list-item">Từ chối cung cấp dịch vụ nếu phát hiện thông tin không chính xác.</li>
                    <li className="list-item">Điều chỉnh nội dung, lịch học hoặc giáo viên khi cần thiết.</li>
                    <li className="list-item">Tạm ngừng dịch vụ để bảo trì hoặc nâng cấp hệ thống.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[16px] leading-[1.6] font-bold mb-2">Trách nhiệm:</p>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                    <li className="list-item">Cung cấp dịch vụ đúng nội dung đã cam kết.</li>
                    <li className="list-item">Bảo mật thông tin cá nhân của người dùng.</li>
                    <li className="list-item">Hỗ trợ phụ huynh và học viên trong suốt quá trình học.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                4. Quyền và trách nhiệm của phụ huynh/học viên
              </h2>
              <div className="pl-6 space-y-4">
                <div>
                  <p className="text-[16px] leading-[1.6] font-bold mb-2">Quyền của phụ huynh/học viên:</p>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                    <li className="list-item">Được cung cấp thông tin rõ ràng về khóa học.</li>
                    <li className="list-item">Được hỗ trợ và giải đáp thắc mắc.</li>
                    <li className="list-item">Được theo dõi tiến độ học tập của học viên.</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[16px] leading-[1.6] font-bold mb-2">Trách nhiệm:</p>
                  <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                    <li className="list-item">Cung cấp thông tin chính xác khi đăng ký.</li>
                    <li className="list-item">Thanh toán học phí đúng hạn.</li>
                    <li className="list-item">Đảm bảo học viên tham gia học đúng lịch và quy định.</li>
                    <li className="list-item">Không chia sẻ tài khoản hoặc nội dung học trái phép.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                5. Chính sách thanh toán
              </h2>
              <div className="pl-6">
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Học phí được thanh toán theo gói khóa học đã đăng ký.</li>
                  <li className="list-item">Hình thức thanh toán: chuyển khoản, online hoặc các phương thức được Vietsure English hỗ trợ.</li>
                  <li className="list-item">Mọi khoản phí phải được thanh toán đầy đủ trước khi học theo thỏa thuận.</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                6. Quy định về sử dụng dịch vụ
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-bold mb-2">Người dùng cam kết:</p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Không sử dụng dịch vụ cho mục đích vi phạm pháp luật.</li>
                  <li className="list-item">Không sao chép, phát tán nội dung học trái phép.</li>
                  <li className="list-item">Không gây ảnh hưởng đến hệ thống hoặc trải nghiệm của người khác.</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                7. Quyền sở hữu trí tuệ
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-normal mb-2">Tất cả nội dung trên website và trong khóa học thuộc quyền sở hữu của Vietsure English, bao gồm:</p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4 mb-4">
                  <li className="list-item">Giáo trình, video, tài liệu học tập.</li>
                  <li className="list-item">Hình ảnh, nội dung website.</li>
                </ul>
                <p className="text-[16px] leading-[1.6] font-bold">Nghiêm cấm sao chép, sử dụng lại khi chưa có sự cho phép.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                8. Giới hạn trách nhiệm
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-semibold mb-2">Vietsure English không chịu trách nhiệm trong các trường hợp:</p>
                <ul className="text-[16px] leading-[1.6] space-y-2 list-none pl-4">
                  <li className="list-item">Sự cố kỹ thuật ngoài tầm kiểm soát (internet, thiết bị cá nhân).</li>
                  <li className="list-item">Người dùng cung cấp thông tin sai lệch.</li>
                  <li className="list-item">Học viên không tuân thủ lộ trình hoặc hướng dẫn học tập.</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                9. Thay đổi điều khoản
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-normal">
                  Vietsure English có quyền điều chỉnh điều khoản dịch vụ khi cần thiết. Các thay đổi sẽ được cập nhật trên website và có hiệu lực kể từ thời điểm công bố.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-[24px] leading-[1.3] font-semibold text-[#24389c] mb-4">
                10. Điều khoản về dữ liệu cá nhân
              </h2>
              <div className="pl-6">
                <p className="text-[16px] leading-[1.6] font-normal">
                  Việc thu thập và xử lý dữ liệu cá nhân được thực hiện theo Chính sách bảo mật của chúng tôi. Người dùng được khuyến nghị đọc kỹ trước khi sử dụng dịch vụ.
                </p>
              </div>
            </section>
          </article>

        </main>
      </div>

      {/* Trial Section at the bottom */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>
    </>
  );
}