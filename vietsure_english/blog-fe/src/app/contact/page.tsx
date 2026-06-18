import TrialSection from "@/components/custom/common/traial-section";

export default function Contact() {
  return (
    <div className="bg-white text-gray-800 font-sans">

      {/* Main Content Info & Map */}
      <section className="py-20 px-6 bg-[#3F489A]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-between">
          
          {/* Left Column: Contact Info */}
          <div className="flex-1 text-white flex flex-col justify-center">
            <h1 className="text-2xl md:text-[32px] lg:text-[38px] font-black text-[#FF6B00] mb-6 uppercase tracking-wider leading-tight lg:whitespace-nowrap">
              LIÊN HỆ VỚI VIETSURE ENGLISH
            </h1>
            <div className="space-y-4 text-sm md:text-base leading-relaxed">
              <p className="font-extrabold text-[17px] tracking-wide">Thông tin liên hệ:</p>
              <p className="font-black text-xl text-white tracking-wide">Công ty TNHH Việt Sure Education</p>
              <ul className="space-y-3 font-semibold text-slate-100/95">
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0">-</span>
                  <span>Trụ sở: A12, Khu nhà ở Hoàng Hùng 5, đường Nguyễn Thị Khắp, khu phố Chiêu Liêu, Phường Tân Đông Hiệp, TP. HCM</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0">-</span>
                  <span>Số điện thoại: 0357 171 381</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="shrink-0">-</span>
                  <span>Email: vietsureenglish@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Google Map */}
          <div className="flex-1 w-full max-w-[520px] rounded-[32px] overflow-hidden border-8 border-white shadow-2xl min-h-[300px] aspect-[4/3] bg-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4815.301370682102!2d106.74995467588136!3d10.923027989234809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d9e55cbcbc7f%3A0x7af7d23e87811640!2sC%C3%B4ng%20ty%20TNHH%20Vi%E1%BB%87t%20Sure%20Education!5e1!3m2!1svi!2s!4v1778188105871!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>
      </section>

      {/* Trial Section at the bottom */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>
    </div>
  );
}