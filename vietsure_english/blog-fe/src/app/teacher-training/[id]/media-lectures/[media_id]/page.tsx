import { LearningBreadcrumb } from '@/components/custom/elearning/learning-breadcrumb';
import StudyTimer from '@/components/custom/elearning/StudyTimer';
import { getData } from '@/service/api';
import PPTViewer from '@/components/custom/elearning/ppt-viewer';

export default async function LearningPage(props: {
  params: Promise<{ id: string; media_id: string }>;
  searchParams: Promise<{
    courseName?: string;
    isStudentLecture?: string;
  }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const isStudentLecture = searchParams?.isStudentLecture === 'true';

  const res = await getData(
    `api/media-lectures/${params.media_id}?populate=content`
  );

  const media = res.data;

  if (!media) {
    return <div className="p-10">Không có nội dung</div>;
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BE_HOST;

  const fileUrl =
    media?.content?.[0]?.url
      ? `${BASE_URL}${media.content[0].url}`
      : null;

  return (
    <section className="flex justify-center px-4 py-10 relative">

      <LearningBreadcrumb
        items={[
          {
            title: searchParams.courseName ?? params.id,
            href: `/teacher-training/${params.id}`,
          },
          { title: media.name },
        ]}
      />

      {/* TIMER */}
      {!isStudentLecture && (
        <StudyTimer
          mediaId={params.media_id}
          requiredMinutes={media.requiredMinutes || 0}
          initialMinutes={media.currentMinutes || 0}
        />
      )}

      <div className="max-w-5xl w-full">

        {media.type === 'video' && fileUrl && (
          <div className="w-full h-[500px] bg-black rounded-lg overflow-hidden">
            <video src={fileUrl} controls controlsList="nodownload" className="w-full h-full" />
          </div>
        )}

        {media.type === 'canva' && media.url && (
          <div className="w-full h-[500px] rounded-lg overflow-hidden shadow">
            <iframe
              src={`${media.url}?embed`}
              className="w-full h-full border-0"
              allowFullScreen
            />
          </div>
        )}

        {media.type === 'pdf' && fileUrl && (
          <div className="w-full h-[600px]">
            <iframe
              src={fileUrl}
              className="w-full h-full border rounded"
            />
          </div>
        )}

        {media.type === 'ppt' && fileUrl && (
          <PPTViewer fileUrl={fileUrl} />
        )}

      </div>
    </section>
  );
}
