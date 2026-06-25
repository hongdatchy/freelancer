import Image from "next/image";

export default function CommitmentsSection() {
  const commitments = [
    {
      title: "Chất lượng",
      desc: "Phát triển nghe - hiểu - phản xạ - giao tiếp một cách liền mạch"
    },
    {
      title: "Giáo viên",
      desc: "Được đào tạo bài bản, giảng dạy nhất quán và theo sát từng học viên"
    },
    {
      title: "Dịch vụ",
      desc: "Lớp học linh hoạt phù hợp với lịch trình của bé"
    },
    {
      title: "Hỗ trợ",
      desc: "Đội ngũ hỗ trợ 24/7 đồng hành cùng phụ huynh",
      hasStamp: true
    }
  ];

  return (
    <section className="py-20 bg-sky-50 relative overflow-hidden" data-purpose="commitments">
      <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12">
        <h2 className="section-title text-[#ff791a] text-center mb-16">
          Cam Kết
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {commitments.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 md:p-10 rounded-[32px] brand-light-border shadow-sm flex flex-col items-center justify-start text-center min-h-[220px] relative"
            >
              {item.hasStamp && (
                <div className="absolute top-[-40px] right-[-20px] md:right-[-50px] z-20 w-[110px] md:w-[130px] rotate-[15deg]">
                  <Image
                    src="/images/cambridge-commitment.png"
                    alt="Cambridge Commitment Stamp"
                    width={130}
                    height={130}
                    className="w-full h-auto filter saturate-[8.0] contrast-[1.8] brightness-[0.9] mix-blend-multiply"
                  />
                </div>
              )}
              <h4 className="text-2xl md:text-3xl font-black text-[#1e3a8a] uppercase mb-4">{item.title}</h4>
              <p className="text-[#1e3a8a] font-semibold text-base md:text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
