import Link from 'next/link';
import Image from 'next/image';
import { postData } from '@/service/api';
import { ResponsePostDTO } from '@/dto/PostDTO';
import PostPaging from '@/components/custom/common/post-paging';
import MarketingPopup from '@/components/custom/homepage/maketing-popup';

export default async function Home() {
  const pageSize = 3;
  const page = 1;
  const responsePost = await postData(
    `api/posts/search?pagination[page]=${page}&&pagination[pageSize]=${pageSize}&&populate=thumbnail&&populate=categories`,
    {
      trending: true
    },
  );
  const posts: ResponsePostDTO[] = responsePost.data;


  return (
    <div className="md:col-span-3">
      {/* trending */}
      <PostPaging data={posts} pageCount={responsePost.meta.pagination.pageCount} page={page} pageSize={pageSize} isShowPaging = {false}/>
      {/* <MarketingPopup/> */}

      <section className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-lg px-6 py-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-extrabold drop-shadow-md mb-4">
            DỊCH VỤ TĂNG FLOW TƯƠNG TÁC FACEBOOK, ZALO,<br />
            INSTAGRAM, TIKTOK
          </h1>
          <p className="text-[15px] mb-6 text-white/90">
            Tham gia các khóa học chất lượng cao để trang bị kiến thức và kỹ năng cần thiết cho kỷ nguyên số.
          </p>
          <Link
            href="/service"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-full shadow transition-all"
          >
            Khám Phá Ngay 🚀
          </Link>
        </div>
      </section>

      <section className="bg-white mt-10 px-6 py-10 rounded-xl shadow-md text-center border-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tại Sao Chọn Khóa Học Online?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-blue-600">
            <div className="text-4xl text-blue-600 mb-3">🎓</div>
            <h3 className="font-bold mb-2 text-gray-800">Giáo Trình Chất Lượng</h3>
            <p className="text-sm text-gray-600">Nội dung biên soạn kỹ lưỡng bởi chuyên gia, cập nhật xu hướng mới nhất.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-blue-600">
            <div className="text-4xl text-blue-600 mb-3">💻</div>
            <h3 className="font-bold mb-2 text-gray-800">Học Mọi Lúc Mọi Nơi</h3>
            <p className="text-sm text-gray-600">Truy cập mọi lúc, linh hoạt với lịch học cá nhân.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center border-t-4 border-blue-600">
            <div className="text-4xl text-blue-600 mb-3">🎧</div>
            <h3 className="font-bold mb-2 text-gray-800">Hỗ Trợ Tận Tình</h3>
            <p className="text-sm text-gray-600">Đội ngũ hỗ trợ luôn sẵn sàng giải đáp, đồng hành cùng bạn.</p>
          </div>
        </div>
      </section>


      <section className="bg-[#fff8dc] px-4 py-10 rounded-xl shadow-md space-y-8 mt-10">
        {/* Giới thiệu */}
        <div>
          <h2 className="text-center text-xl md:text-2xl font-bold text-[#8B0000]">Giới Thiệu Phạm Tuấn và team hỗ trợ</h2>
          <div className="relative my-4">
            <Image
              src="/images/anh18.jpg"
              alt="Team Phạm Tuấn"
              width={800}
              height={500}
              className="rounded-lg shadow-md w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-[17px] text-[#222]">🎯 Sứ Mệnh Của Chúng Tôi</h3>
              <p className="text-[15px] text-gray-800 mt-1">
                Chúng tôi cam kết mang đến những kiến thức và công cụ thực tiễn nhất, giúp bạn không chỉ nâng cao kỹ năng mà còn tạo ra giá trị bền vững trong thế giới số. Sứ mệnh của chúng tôi là đồng hành cùng bạn trên con đường thành công, từ những bước đầu tiên đến khi đạt được mục tiêu lớn.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[17px] text-[#222]">📚 Các Khóa Học Nổi Bật</h3>
              <ul className="list-disc ml-5 mt-2 space-y-1 text-[15px] text-gray-800">
                <li><span className="text-red-600 font-bold">Khóa học Xây dựng Thương Hiệu Cá nhân:</span>Hướng dẫn chi tiết cách định vị, phát triển hình ảnh và xây dựng uy tín của bạn trên mạng xã hội.</li>
                <li><span className="text-green-600 font-bold">Khóa học Kinh doanh Online Hiệu Quả:</span>Cung cấp các chiến lược từ A-Z để khởi nghiệp và phát triển kinh doanh trực tuyến.</li>
                <li><span className="text-blue-600 font-bold">Khóa học Tối ưu hóa Mạng Xã Hội:</span>Bí quyết để tăng tương tác, tiếp cận khách hàng tiềm năng và chuyển đổi hiệu quả trên Facebook, Instagram, TikTok...</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[17px] text-[#222]">👨‍🏫 Đội Ngũ Chuyên Gia</h3>
              <p className="text-[15px] text-gray-800 mt-1">Phạm Tuấn cùng đội ngũ của mình là những chuyên gia có nhiều năm kinh nghiệm thực chiến trong lĩnh vực Digital Marketing và phát triển mạng xã hội. Chúng tôi luôn cập nhật những xu hướng và công nghệ mới nhất để đảm bảo bạn nhận được kiến thức tiên tiến và phù hợp nhất.</p>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 px-4 py-2 italic text-[15px] text-green-700 rounded-md shadow-sm">
              "Chúng tôi tin rằng với sự hướng dẫn tận tâm và các khóa học chất lượng, bạn hoàn toàn có thể bứt phá và đạt được thành công mong muốn!"
            </div>
          </div>
        </div>

        {/* Cảnh báo */}
        <div className="bg-red-100 border border-red-300 text-red-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-red-700 mb-2">⚠️ CẢNH BÁO LỪA ĐẢO</h3>
          <p>Hiện có đối tượng mạo danh. Xin lưu ý:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1 text-[15px]">
            <li><b>Chỉ giao dịch qua các kênh chính thức.</b></li>
            <li><b>Kiểm tra kỹ thông tin trước khi giao dịch.</b></li>
          </ul>
          <p className="mt-3 text-sm">📞 0926522222 – 0911222229<br />📧 support@phamtuandichvu.com</p>
          <p className="mt-2 text-xs italic">Chúng tôi không chịu trách nhiệm nếu bạn giao dịch ngoài kênh chính thức.</p>
        </div>
      </section>


      <section className="mt-10 mb-10 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg shadow-lg px-6 py-10 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold drop-shadow-md mb-4">
          Bắt Đầu Hành Trình Học Tập Của Bạn Ngay Hôm Nay!
        </h2>
        <p className="text-[15px] mb-6">Đừng bỏ lỡ cơ hội nâng cao kiến thức và kỹ năng. Tham gia cùng hàng ngàn học viên khác và tiến lên tương lai của bạn.</p>
        <Link href="/search-post" className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-yellow-300 transition-all">
          Đăng Ký Khóa Học 📣
        </Link>
      </section>


    </div>
  );
}
