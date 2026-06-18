import Image from "next/image";
import TrialSection from '@/components/custom/common/traial-section';
import LearnFromStart from '@/components/custom/common/learn-from-start';
import BrandStats from '@/components/custom/common/brand-stats';
import ParentFeedbackSection from '@/components/custom/common/parent-feedback-section';
import MediaSection from '@/components/custom/common/media-section';
import CommitmentsSection from '@/components/custom/common/commitments-section';

export default function About() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      
      {/* BEGIN: HeroIntroduction */}
      <section className="py-16 px-4 md:px-20 bg-gradient-to-b from-[#1e3a8a] to-blue-900 text-white overflow-hidden" data-purpose="hero-intro">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Video Placeholder Side */}
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative w-full">
              <iframe
                src="https://www.youtube.com/embed/tosYNLutaLw?list=PLnwkiTgOYjUwMBX8qrJpstCCfUb6t89PJ"
                title="Vietsure English"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
          {/* Text Side */}
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-black text-[#fbb03b] mb-6 tracking-wide">GIỚI THIỆU</h1>
            <p className="text-lg leading-relaxed mb-4">
              Vietsure English là nền tảng dạy tiếng Anh online hàng đầu Việt Nam được xây dựng từ nhiều năm kinh nghiệm giảng dạy tiếng Anh online cho trẻ em Việt Nam sinh ra ở nước ngoài học song ngữ Anh - Việt để duy trì tiếng mẹ đẻ. 
            </p>
            <p className="text-lg leading-relaxed">
              Cam kết đem đến các khóa học chất lượng cao, cá nhân hóa, đồng hành sát sao cùng học viên và phụ huynh.
            </p>
          </div>
        </div>
      </section>
      {/* END: HeroIntroduction */}

      {/* BEGIN: BrandStats */}
      <section className="py-12 bg-white" data-purpose="stats-section">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] text-center mb-8 uppercase tracking-wide">
            Phủ sóng thương hiệu trên toàn quốc
          </h2>
          <BrandStats />
          <p className="text-center text-[#1e3a8a] text-lg font-semibold mt-4">
            Vietsure đã phủ sóng thương hiệu hơn 5 quốc gia trên toàn thế giới.
          </p>
        </div>
      </section>
      {/* END: BrandStats */}

      {/* BEGIN: GlobalMap */}
      <section className="py-10 bg-[#f0f9ff] overflow-hidden" data-purpose="world-map">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative flex justify-center">
            <Image 
              src="/images/MapChart_Map.png" 
              alt="World Map" 
              width={1200} 
              height={1000} 
              className="w-full rounded-3xl object-contain shadow-md"
            />
          </div>
        </div>
      </section>
      {/* END: GlobalMap */}

      {/* BEGIN: VisionMission */}
      <section className="py-16 bg-white" data-purpose="vision-mission">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1e3a8a] mb-8 uppercase">Tầm nhìn & Sứ mệnh</h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            Từ kinh nghiệm giảng dạy trong môi trường Quốc tế, chúng tôi không dạy trẻ học tiếng Anh mà còn giúp trẻ sử dụng tiếng Anh như một ngôn ngữ thứ hai. Đồng thời, Vietsure English chú trọng rèn luyện tính cách và giá trị sống, giúp học viên hình thành nhân cách tích cực, biết tôn trọng, sẻ chia và trở thành những công dân tốt trong tương lai.
          </p>
        </div>
      </section>
      {/* END: VisionMission */}

      {/* BEGIN: LogoMeaning (GIỮ NGUYÊN NHƯ CODE CŨ) */}
      <section
        className="px-6 py-14 relative overflow-hidden bg-[#f0f9ff]"
        data-purpose="logo-meaning"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-[#1e3a8a] text-center mb-16 uppercase">Ý nghĩa logo Vietsure English</h2>

          {/* ===== DESKTOP (lg+): layout absolute ===== */}
          <div className="relative w-full hidden lg:block" style={{ height: "620px" }}>

            {/* TOP LEFT TEXT */}
            <div
              className="absolute text-center left-[50px] xl:left-[100px]"
              style={{ top: 20, width: 220 }}
            >
              <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Ngôi sao tượng trưng cho:</span>
              <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Mục tiêu và định hướng rõ ràng trong hành trình học tập. Sự tỏa sáng và thành công của học viên sau quá trình rèn luyện. Khát vọng vươn xa ra thế giới, đúng với tinh thần của một trung tâm đào tạo tiếng Anh chuẩn quốc tế.</span>
            </div>

            {/* TOP RIGHT TEXT */}
            <div
              className="absolute text-left right-[50px] xl:right-[100px]"
              style={{ top: 20, width: 230 }}
            >
              <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Phông chữ được xây dựng theo:</span>
              <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Cấu trúc liền mạch, các ký tự bo tròn mềm mại nhưng vẫn vững chắc, tạo cảm giác kết nối - ổn định - bền vững. Sự liên kết giữa các chữ cái thể hiện quá trình học tập xuyên suốt, có hệ thống và được dẫn dắt rõ ràng.</span>
            </div>

            {/* BOTTOM LEFT TEXT */}
            <div
              className="absolute text-center left-[0px] xl:left-[50px]"
              style={{ bottom: 20, width: 220 }}
            >
              <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Hình tượng mascot chim cánh cụt:</span>
              <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Thân thiện, thông minh và tràn đầy năng lượng, đại diện cho tinh thần học tập tích cực, tự tin và không ngừng tiến bộ của học viên.</span>
            </div>

            {/* BOTTOM RIGHT TEXT */}
            <div
              className="absolute text-left right-[50px] xl:right-[100px]"
              style={{ bottom: 20, width: 230 }}
            >
              <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Về màu sắc:</span>
              <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">
                - Xanh tím đậm tượng trưng cho uy tín, chiều sâu học thuật và sự cam kết chất lượng.<br />
                - Xanh dương sáng đại diện cho tinh thần trẻ trung, năng động và khả năng hội nhập quốc tế.
              </span>
            </div>

            {/* KHỐI GIỮA + ARROWS */}
            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 460,
                height: 220,
              }}
            >
              <img src="/images/arrow1.png" alt="" className="absolute pointer-events-none animate-float-up"
                style={{ width: 190, height: 190, top: -190, left: -0, objectFit: "contain" }} />
              <img src="/images/arrow2.png" alt="" className="absolute pointer-events-none animate-float-down"
                style={{ width: 190, height: 190, top: -170, right: -0, objectFit: "contain" }} />
              <img src="/images/arrow3.png" alt="" className="absolute pointer-events-none animate-float-up"
                style={{ width: 150, height: 150, bottom: -120, left: -60, objectFit: "contain" }} />
              <img src="/images/arrow4.png" alt="" className="absolute pointer-events-none animate-float-down"
                style={{ width: 190, height: 190, bottom: -170, right: -0, objectFit: "contain" }} />

              <div className="flex items-center justify-center h-full">
                <Image src="/images/Vietsure English_Logo-15.png" alt="logo" width={290} height={290} className="select-none pointer-events-none object-contain" />
              </div>
            </div>
          </div>

          {/* ===== MOBILE/TABLET (dưới lg): layout flex column ===== */}
          <div className="flex flex-col items-center gap-8 lg:hidden">

            {/* Logo giữa */}
            <div className="flex items-center justify-center">
              <Image src="/images/Vietsure English_Logo-15.png" alt="logo" width={160} height={160} className="object-contain" />
            </div>

            {/* 4 text xếp dạng grid 2 cột trên tablet, 1 cột trên mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-center md:text-left">
              <div>
                <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Ngôi sao tượng trưng cho:</span>
                <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Mục tiêu và định hướng rõ ràng trong hành trình học tập. Sự tỏa sáng và thành công của học viên sau quá trình rèn luyện. Khát vọng vươn xa ra thế giới, đúng với tinh thần của một trung tâm đào tạo tiếng Anh chuẩn quốc tế.</span>
              </div>
              <div>
                <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Phông chữ được xây dựng theo:</span>
                <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Cấu trúc liền mạch, các ký tự bo tròn mềm mại nhưng vẫn vững chắc, tạo cảm giác kết nối - ổn định - bền vững. Sự liên kết giữa các chữ cái thể hiện quá trình học tập xuyên suốt, có hệ thống và được dẫn dắt rõ ràng.</span>
              </div>
              <div>
                <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Hình tượng mascot chim cánh cụt:</span>
                <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">Thân thiện, thông minh và tràn đầy năng lượng, đại diện cho tinh thần học tập tích cực, tự tin và không ngừng tiến bộ của học viên.</span>
              </div>
              <div>
                <span className="text-[#0ea5e9] font-extrabold text-sm block mb-1">Về màu sắc:</span>
                <span className="text-[#1e3a8a] font-semibold text-xs leading-relaxed block">
                  - Xanh tím đậm tượng trưng cho uy tín, chiều sâu học thuật và sự cam kết chất lượng.<br />
                  - Xanh dương sáng đại diện cho tinh thần trẻ trung, năng động và khả năng hội nhập quốc tế.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* END: LogoMeaning */}

      {/* BEGIN: BrandMascot */}
      <section className="py-20 bg-gradient-to-b from-[#f0f9ff] to-white" data-purpose="brand-mascot">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left Mascot */}
            <div className="flex justify-center">
              <Image 
                src="/images/Kieu hanh, man nguyen.png" 
                alt="Mascot Left" 
                width={250} 
                height={250} 
                className="w-64 h-auto object-contain select-none animate-float-up rounded-2xl"
              />
            </div>
            {/* Center Text */}
            <div className="text-center">
              <h2 className="text-3xl font-black text-[#1e3a8a] mb-8 uppercase">BIỂU TƯỢNG THƯƠNG HIỆU</h2>
              <p className="text-blue-900 font-medium leading-relaxed">
                Hình ảnh chú chim cánh cụt là biểu tượng đại diện cho tinh thần học tập bền bỉ, thích nghi và phát triển trong mọi môi trường. Chú chim cánh cụt còn đại diện cho hành trình học tập tại Vietsure English - Học đúng môi trường để sử dụng tiếng Anh một cách tự nhiên.
              </p>
            </div>
            {/* Right Mascot */}
            <div className="flex justify-center">
              <Image 
                src="/images/Hao hung, san sang.png" 
                alt="Mascot Right" 
                width={250} 
                height={250} 
                className="w-64 h-auto object-contain select-none animate-float-down"
              />
            </div>
          </div>
        </div>
      </section>
      {/* END: BrandMascot */}

      {/* BEGIN: CharacterProfiles */}
      <section className="py-16 bg-[#f0f9ff]" data-purpose="characters">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-[#1e3a8a] text-center mb-16 uppercase tracking-wide whitespace-nowrap">
            NHÂN VẬT TRONG SERIES PHIM NGẮN & CHƯƠNG TRÌNH HỌC TIẾNG ANH
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Row 1: NAM */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-end relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 z-10 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-4">NAM</h3>
                <div className="text-[11px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 25-27 tuổi</p>
                  <p><span className="font-extrabold">Chiều cao:</span> 1m80</p>
                  <p><span className="font-extrabold">Cân nặng:</span> 80kg</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> CEO Công nghệ Startup</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Kiên cường, nhân ái, lãnh đạo tốt</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-center justify-end select-none">
                <Image 
                  src="/images/character-nam.png" 
                  alt="NAM" 
                  width={180} 
                  height={240} 
                  className="h-[90%] w-auto object-contain animate-float-up"
                />
              </div>
            </div>

            {/* Row 1: KATE */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-end relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 z-10 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-4">KATE</h3>
                <div className="text-[11px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 25-27 tuổi</p>
                  <p><span className="font-extrabold">Chiều cao:</span> 1m70</p>
                  <p><span className="font-extrabold">Cân nặng:</span> 55kg</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Mỹ</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Nhà khoa học công nghệ</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thông minh, chân thành, lạc quan</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full flex items-center justify-end select-none">
                <Image 
                  src="/images/character-kate.png" 
                  alt="KATE" 
                  width={180} 
                  height={240} 
                  className="h-[90%] w-auto object-contain animate-float-up"
                />
              </div>
            </div>

            {/* Row 1: PENGUIN */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-center relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 h-full flex items-center justify-center select-none pt-4">
                <Image 
                  src="/images/character-penguin.png" 
                  alt="PENGUIN" 
                  width={160} 
                  height={160} 
                  className="w-full h-auto object-contain animate-float-up"
                />
              </div>
              <div className="w-1/2 pl-4 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">PENGUIN</h3>
                <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">
                  Mascot chim cánh cụt thân thiện, thông minh và tràn đầy năng lượng, đại diện cho tinh thần học tập tích cực, tự tin và không ngừng tiến bộ của học viên.
                </p>
              </div>
            </div>

            {/* Row 2: MARK */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-center relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 h-full flex items-center justify-center select-none pt-4">
                <Image 
                  src="/images/character-mark.png" 
                  alt="MARK" 
                  width={160} 
                  height={160} 
                  className="w-full h-auto object-contain animate-float-up"
                />
              </div>
              <div className="w-1/2 pl-4 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">MARK</h3>
                <div className="text-[11px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 6 tuổi</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Học sinh</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thông minh, hòa đồng, lễ phép và ham học hỏi</p>
                </div>
              </div>
            </div>

            {/* Row 2: SUE */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-center relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 pr-4 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">SUE</h3>
                <div className="text-[11px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 6 tuổi</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Học sinh</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thân thiện, dịu dàng, ham học hỏi, tốt bụng</p>
                </div>
              </div>
              <div className="w-1/2 h-full flex items-center justify-center select-none pt-4">
                <Image 
                  src="/images/character-sue.png" 
                  alt="SUE" 
                  width={160} 
                  height={160} 
                  className="w-full h-auto object-contain animate-float-up"
                />
              </div>
            </div>

            {/* Row 2: WINWIN */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-center relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 h-full flex items-center justify-center select-none pt-4">
                <Image 
                  src="/images/character-winwin.png" 
                  alt="WINWIN" 
                  width={160} 
                  height={160} 
                  className="w-full h-auto object-contain animate-float-up"
                />
              </div>
              <div className="w-1/2 pl-4 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">WINWIN</h3>
                <p className="text-[11px] text-blue-900 leading-relaxed font-semibold">
                  Phương tiện đi lại và là trợ lý cá nhân. Tính cách vui nhộn, đáng yêu và trung thành. Ngoài ra còn có rất nhiều chức năng giúp ích cho mọi người.
                </p>
              </div>
            </div>

          </div>

          <div className="text-center">
            <a 
              href="#trial-section" 
              className="inline-block bg-[#1e3a8a] text-white font-bold py-3.5 px-12 rounded-full shadow-lg hover:bg-blue-700 transition-colors uppercase text-sm tracking-wider"
            >
              Học Thử Miễn Phí
            </a>
          </div>
        </div>
      </section>
      {/* END: CharacterProfiles */}

      {/* BEGIN: CoreValues */}
      <section className="py-20 bg-white overflow-hidden" data-purpose="core-values">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            {/* Left: Central Circle with Connection Lines */}
            <div className="relative flex-shrink-0">
              {/* SVG for Curved Lines (Desktop only) */}
              <svg className="hidden md:block absolute top-1/2 left-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none" fill="none" style={{ transform: "translate(-20%, -50%)" }} viewBox="0 0 400 500">
                <path d="M100 250 C 150 250, 250 100, 350 80" stroke="#e0f2fe" strokeWidth="2"></path>
                <path d="M100 250 C 150 250, 250 200, 350 190" stroke="#e0f2fe" strokeWidth="2"></path>
                <path d="M100 250 C 150 250, 250 300, 350 310" stroke="#e0f2fe" strokeWidth="2"></path>
                <path d="M100 250 C 150 250, 250 400, 350 420" stroke="#e0f2fe" strokeWidth="2"></path>
                {/* Connection Nodes */}
                <circle cx="350" cy="80" fill="#e0f2fe" r="6"></circle>
                <circle cx="350" cy="190" fill="#e0f2fe" r="6"></circle>
                <circle cx="350" cy="310" fill="#e0f2fe" r="6"></circle>
                <circle cx="350" cy="420" fill="#e0f2fe" r="6"></circle>
              </svg>
              {/* Central Circle */}
              <div className="w-64 h-64 md:w-80 md:h-80 bg-[#1e3a8a] rounded-full flex flex-col items-center justify-center text-center text-white p-8 relative z-20 shadow-2xl border-[10px] border-white">
                <span className="text-4xl md:text-[42px] font-black leading-tight">4 GIÁ TRỊ</span>
                <span className="text-2xl md:text-3xl font-bold mt-1">CỐT LÕI</span>
              </div>
            </div>
            {/* Right: Values List */}
            <div className="flex flex-col gap-10 md:gap-12 z-10">
              {/* Value 1 */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
                </div>
                <div className="max-w-sm">
                  <h4 className="font-black text-[#1e3a8a] uppercase text-lg">Chuẩn quốc tế</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Xây dựng từ môi trường giáo dục trẻ em quốc tế, giúp trẻ em Việt sử dụng tiếng Anh như trẻ em thế giới.</p>
                </div>
              </div>
              {/* Value 2 */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                </div>
                <div className="max-w-sm">
                  <h4 className="font-black text-[#1e3a8a] uppercase text-lg">Cá nhân hóa</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Lộ trình phù hợp để trẻ tiến bộ bền vững và đúng khả năng.</p>
                </div>
              </div>
              {/* Value 3 */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                </div>
                <div className="max-w-sm">
                  <h4 className="font-black text-[#1e3a8a] uppercase text-lg">Đồng hành</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Giúp phụ huynh hiểu và đồng hành cùng con.</p>
                </div>
              </div>
              {/* Value 4 */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></svg>
                </div>
                <div className="max-w-sm">
                  <h4 className="font-black text-[#1e3a8a] uppercase text-lg">Minh bạch</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">Tiến bộ được theo dõi, đánh giá minh bạch và tạo ra giá trị thật.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: CoreValues */}

      <CommitmentsSection />

      <MediaSection />

      <ParentFeedbackSection />
      {/* END: Testimonials */}

      {/* Trial Section at the bottom */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <TrialSection />
        </div>
      </section>

    </div>
  );
}