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
      <section className="py-16 bg-gradient-to-b from-[#1e3a8a] to-blue-900 text-white overflow-hidden" data-purpose="hero-intro">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 flex flex-col md:flex-row items-center gap-12">
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
            <h1 className="section-title !text-[#fbb03b] mb-6">GIỚI THIỆU</h1>
            <p className="section-desc !text-white mb-4">
              Vietsure English là nền tảng dạy tiếng Anh online hàng đầu Việt Nam được xây dựng từ nhiều năm kinh nghiệm giảng dạy tiếng Anh online cho trẻ em Việt Nam sinh ra ở nước ngoài học song ngữ Anh - Việt để duy trì tiếng mẹ đẻ. 
            </p>
            <p className="section-desc !text-white">
              Cam kết đem đến các khóa học chất lượng cao, cá nhân hóa, đồng hành sát sao cùng học viên và phụ huynh.
            </p>
          </div>
        </div>
      </section>
      {/* END: HeroIntroduction */}

      {/* BEGIN: BrandStats */}
      <section className="pt-24 pb-12 bg-white" data-purpose="stats-section">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <h2 className="section-title text-center mb-8">
            Phủ sóng thương hiệu trên toàn quốc
          </h2>
          <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-0">
            <BrandStats />
          </div>
          <p className="text-center section-desc mt-6">
            Vietsure đã phủ sóng thương hiệu hơn 5 quốc gia trên toàn thế giới.
          </p>
        </div>
      </section>
      {/* END: BrandStats */}

      {/* BEGIN: GlobalMap */}
      <section className="bg-white overflow-hidden" data-purpose="world-map">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <div className="relative flex justify-center">
            <Image 
              src="/images/MapChart_Map2.png" 
              alt="World Map" 
              width={1200} 
              height={1000} 
              className="w-[90%] md:w-[85%] lg:w-[80%] max-w-6xl object-contain mx-auto"
            />
          </div>
        </div>
      </section>
      {/* END: GlobalMap */}

      {/* BEGIN: VisionMission */}
      <section className="py-16 bg-white" data-purpose="vision-mission">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 text-center">
          <h2 className="section-title mb-8">Tầm nhìn & Sứ mệnh</h2>
          <p className="section-desc">
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
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <h2 className="section-title text-center mb-16">Ý nghĩa logo Vietsure English</h2>

          {/* ===== DESKTOP (lg+): layout absolute ===== */}
          <div className="relative w-full hidden lg:block" style={{ height: "620px" }}>

            {/* TOP LEFT TEXT */}
            <div
              className="absolute text-center left-[20px] xl:left-[80px]"
              style={{ top: 20, width: 280 }}
            >
              <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Ngôi sao tượng trưng cho:</span>
              <span className="section-desc block text-center">Mục tiêu và định hướng rõ ràng trong hành trình học tập. Sự tỏa sáng và thành công của học viên sau quá trình rèn luyện. Khát vọng vươn xa ra thế giới, đúng với tinh thần của một trung tâm đào tạo tiếng Anh chuẩn quốc tế.</span>
            </div>

            {/* TOP RIGHT TEXT */}
            <div
              className="absolute text-left right-[20px] xl:right-[80px]"
              style={{ top: 20, width: 280 }}
            >
              <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Phông chữ được xây dựng theo:</span>
              <span className="section-desc block text-left">Cấu trúc liền mạch, các ký tự bo tròn mềm mại nhưng vẫn vững chắc, tạo cảm giác kết nối - ổn định - bền vững. Sự liên kết giữa các chữ cái thể hiện quá trình học tập xuyên suốt, có hệ thống và được dẫn dắt rõ ràng.</span>
            </div>

            {/* BOTTOM LEFT TEXT */}
            <div
              className="absolute text-center left-[0px] xl:left-[40px]"
              style={{ bottom: 20, width: 280 }}
            >
              <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Hình tượng mascot chim cánh cụt:</span>
              <span className="section-desc block text-center">Thân thiện, thông minh và tràn đầy năng lượng, đại diện cho tinh thần học tập tích cực, tự tin và không ngừng tiến bộ của học viên.</span>
            </div>

            {/* BOTTOM RIGHT TEXT */}
            <div
              className="absolute text-left right-[20px] xl:right-[80px]"
              style={{ bottom: 20, width: 280 }}
            >
              <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Về màu sắc:</span>
              <span className="section-desc block text-left">
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
              <Image src="/images/arrow1.png" alt="" width={190} height={190} className="absolute pointer-events-none object-contain"
                style={{ top: -190, left: -0 }} />
              <Image src="/images/arrow2.png" alt="" width={190} height={190} className="absolute pointer-events-none object-contain"
                style={{ top: -170, right: -0 }} />
              <Image src="/images/arrow3.png" alt="" width={150} height={150} className="absolute pointer-events-none object-contain"
                style={{ bottom: -120, left: -60 }} />
              <Image src="/images/arrow4.png" alt="" width={190} height={190} className="absolute pointer-events-none object-contain"
                style={{ bottom: -170, right: -0 }} />

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
                <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Ngôi sao tượng trưng cho:</span>
                <span className="section-desc block">Mục tiêu và định hướng rõ ràng trong hành trình học tập. Sự tỏa sáng và thành công của học viên sau quá trình rèn luyện. Khát vọng vươn xa ra thế giới, đúng với tinh thần của một trung tâm đào tạo tiếng Anh chuẩn quốc tế.</span>
              </div>
              <div>
                <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Phông chữ được xây dựng theo:</span>
                <span className="section-desc block">Cấu trúc liền mạch, các ký tự bo tròn mềm mại nhưng vẫn vững chắc, tạo cảm giác kết nối - ổn định - bền vững. Sự liên kết giữa các chữ cái thể hiện quá trình học tập xuyên suốt, có hệ thống và được dẫn dắt rõ ràng.</span>
              </div>
              <div>
                <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Hình tượng mascot chim cánh cụt:</span>
                <span className="section-desc block">Thân thiện, thông minh và tràn đầy năng lượng, đại diện cho tinh thần học tập tích cực, tự tin và không ngừng tiến bộ của học viên.</span>
              </div>
              <div>
                <span className="text-[#3F489A] font-bold text-[15px] md:text-[17px] block mb-1">Về màu sắc:</span>
                <span className="section-desc block">
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
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Left Mascot */}
            <div className="flex justify-center">
              <Image 
                src="/images/kieu-hanh-man-nguyen.png" 
                alt="Mascot Left" 
                width={700} 
                height={700} 
                className="w-full max-w-[700px] h-auto object-contain select-none animate-float-up rounded-2xl"
              />
            </div>
            {/* Center Text */}
            <div className="text-center px-4">
              <h2 className="section-title mb-8">BIỂU TƯỢNG THƯƠNG HIỆU</h2>
              <p className="section-desc">
                Hình ảnh chú chim cánh cụt là biểu tượng đại diện cho tinh thần học tập bền bỉ, thích nghi và phát triển trong mọi môi trường. Chú chim cánh cụt còn đại diện cho hành trình học tập tại Vietsure English - Học đúng môi trường để sử dụng tiếng Anh một cách tự nhiên.
              </p>
            </div>
            {/* Right Mascot */}
            <div className="flex justify-center">
              <Image 
                src="/images/hao-hung-san-sang.png" 
                alt="Mascot Right" 
                width={700} 
                height={700} 
                className="w-full max-w-[700px] h-auto object-contain select-none animate-float-down"
              />
            </div>
          </div>
        </div>
      </section>
      {/* END: BrandMascot */}

      {/* BEGIN: CharacterProfiles */}
      <section className="py-16 bg-[#f0f9ff]" data-purpose="characters">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
          <h2 className="section-title text-center mb-16">
            NHÂN VẬT TRONG SERIES PHIM NGẮN & CHƯƠNG TRÌNH HỌC TIẾNG ANH
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Row 1: NAM */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-end relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 z-10 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-4">NAM</h3>
                <div className="text-[13px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 25-27 tuổi</p>
                  <p><span className="font-extrabold">Chiều cao:</span> 1m80</p>
                  <p><span className="font-extrabold">Cân nặng:</span> 80kg</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> CEO Công nghệ Startup</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Kiên cường, nhân ái, lãnh đạo tốt</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 pt-4 w-[60%] h-[155%] flex items-start justify-end select-none">
                <Image 
                  src="/images/character-nam.png" 
                  alt="NAM" 
                  width={180} 
                  height={240} 
                  className="h-full w-auto object-contain object-top"
                />
              </div>
            </div>

            {/* Row 1: KATE */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-end relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 z-10 text-left">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-4">KATE</h3>
                <div className="text-[13px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 25-27 tuổi</p>
                  <p><span className="font-extrabold">Chiều cao:</span> 1m70</p>
                  <p><span className="font-extrabold">Cân nặng:</span> 55kg</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Mỹ</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Nhà khoa học công nghệ</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thông minh, chân thành, lạc quan</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 pt-4 w-[60%] h-[155%] flex items-start justify-end select-none">
                <Image 
                  src="/images/character-kate.png" 
                  alt="KATE" 
                  width={180} 
                  height={240} 
                  className="h-full w-auto object-contain object-top"
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
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="w-1/2 pl-4 text-right">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">PENGUIN</h3>
                <p className="text-[13px] text-blue-900 leading-relaxed font-semibold">
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
                  className="w-[65%] lg:w-[60%] max-w-[140px] h-auto object-contain"
                />
              </div>
              <div className="w-1/2 pl-4 text-right">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">MARK</h3>
                <div className="text-[13px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 6 tuổi</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Học sinh</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thông minh, hòa đồng, lễ phép và ham học hỏi</p>
                </div>
              </div>
            </div>

            {/* Row 2: SUE */}
            <div className="bg-white rounded-[32px] p-8 border-2 border-sky-200 shadow-sm flex items-center relative overflow-hidden h-72 hover:shadow-md transition-shadow">
              <div className="w-1/2 h-full flex items-center justify-center select-none pt-4">
                <Image 
                  src="/images/character-sue.png" 
                  alt="SUE" 
                  width={160} 
                  height={160} 
                  className="w-[75%] lg:w-[70%] max-w-[160px] h-auto object-contain"
                />
              </div>
              <div className="w-1/2 pl-4 text-right">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">SUE</h3>
                <div className="text-[13px] text-blue-900 space-y-1">
                  <p><span className="font-extrabold">Tuổi:</span> 6 tuổi</p>
                  <p><span className="font-extrabold">Quốc tịch:</span> Việt Nam</p>
                  <p><span className="font-extrabold">Nghề nghiệp:</span> Học sinh</p>
                  <p className="leading-tight"><span className="font-extrabold">Tính cách:</span> Thân thiện, dịu dàng, ham học hỏi, tốt bụng</p>
                </div>
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
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="w-1/2 pl-4 text-right">
                <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">WINWIN</h3>
                <p className="text-[13px] text-blue-900 leading-relaxed font-semibold">
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
      <section 
        className="overflow-hidden w-full relative" 
        style={{ background: 'linear-gradient(to bottom, #b9ddff 0%, #cbe6ff 40%, #cce6ff 50%, #cce6ff 100%)' }}
        data-purpose="core-values"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 relative">
          <Image 
            src="/images/7.png" 
            alt="4 Giá trị cốt lõi" 
            width={1920} 
            height={1080} 
            className="w-full h-auto object-contain pointer-events-none select-none"
            priority
          />

          {/* Central Text: 4 GIÁ TRỊ CỐT LÕI */}
          <div className="absolute flex flex-col items-center justify-center text-white text-center"
               style={{ top: '52%', left: '17.8%', transform: 'translate(-50%, -50%)', width: '25%' }}>
            <span className="text-[2.9vw] md:text-[1.8rem] lg:text-[2.3rem] xl:text-[2.8rem] font-black leading-tight drop-shadow-md">4 GIÁ TRỊ</span>
            <span className="text-[2.2vw] md:text-[1.35rem] lg:text-[1.8rem] xl:text-[2.1rem] font-black leading-tight mt-0.5 md:mt-1 drop-shadow-md">CỐT LÕI</span>
          </div>

          {/* Value 1: CHUẨN QUỐC TẾ */}
          <div className="absolute"
               style={{ top: '8%', left: '39%', width: '22%' }}>
            <h4 className="font-black text-[#1e3a8a] uppercase text-[1.8vw] md:text-[13px] lg:text-base xl:text-xl mb-0.5 md:mb-1">Chuẩn quốc tế</h4>
            <p className="text-[#1e3a8a]/80 text-[1.3vw] md:text-[10px] lg:text-xs xl:text-base leading-snug md:leading-relaxed font-semibold">
              Xây dựng từ môi trường giáo dục trẻ em quốc tế, giúp trẻ em Việt sử dụng tiếng Anh như trẻ em thế giới.
            </p>
          </div>

          {/* Value 2: CÁ NHÂN HÓA */}
          <div className="absolute"
               style={{ top: '36%', left: '50%', width: '22%' }}>
            <h4 className="font-black text-[#1e3a8a] uppercase text-[1.8vw] md:text-[13px] lg:text-base xl:text-xl mb-0.5 md:mb-1">Cá nhân hóa</h4>
            <p className="text-[#1e3a8a]/80 text-[1.3vw] md:text-[10px] lg:text-xs xl:text-base leading-snug md:leading-relaxed font-semibold">
              Lộ trình phù hợp để trẻ tiến bộ bền vững và đúng khả năng.
            </p>
          </div>

          {/* Value 3: ĐỒNG HÀNH */}
          <div className="absolute"
               style={{ top: '60%', left: '50%', width: '22%' }}>
            <h4 className="font-black text-[#1e3a8a] uppercase text-[1.8vw] md:text-[13px] lg:text-base xl:text-xl mb-0.5 md:mb-1">Đồng hành</h4>
            <p className="text-[#1e3a8a]/80 text-[1.3vw] md:text-[10px] lg:text-xs xl:text-base leading-snug md:leading-relaxed font-semibold">
              Giúp phụ huynh hiểu và đồng hành cùng con.
            </p>
          </div>

          {/* Value 4: MINH BẠCH */}
          <div className="absolute"
               style={{ top: '82%', left: '39%', width: '22%' }}>
            <h4 className="font-black text-[#1e3a8a] uppercase text-[1.8vw] md:text-[13px] lg:text-base xl:text-xl mb-0.5 md:mb-1">Minh bạch</h4>
            <p className="text-[#1e3a8a]/80 text-[1.3vw] md:text-[10px] lg:text-xs xl:text-base leading-snug md:leading-relaxed font-semibold">
              Tiến bộ được theo dõi, đánh giá minh bạch và tạo ra giá trị thật.
            </p>
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
        <TrialSection />
      </section>

    </div>
  );
}