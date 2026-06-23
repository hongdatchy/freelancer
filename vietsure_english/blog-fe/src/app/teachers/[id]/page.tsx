import TrialSection from '@/components/custom/common/traial-section';
import { TeacherDetailClient } from '@/components/custom/teacher/teacher-detail';
import { TeacherScheduleView } from '@/components/custom/teacher/teacher-schedule';
import { TeacherDTO } from '@/dto/TeacherDTO';
import { getData } from '@/service/api';

export default async function TeacherDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const responseUser = await getData(
    `api/users/${params.id}?populate[0]=avatar&populate[1]=educations&populate[2]=score&populate[3]=region&populate[4]=achievements`,
  );

  const teacher: TeacherDTO = responseUser;

  const avatar =
    teacher?.avatar?.formats?.medium?.url ||
    teacher?.avatar?.url;

  return (
    <div className="md:col-span-3 w-full">
      {/* Teacher info */}
      <TeacherDetailClient teacher={teacher} avatar={avatar} />

      {/* Schedule RIGHT BELOW */}
      <TeacherScheduleView teacherId={Number(teacher.id)} />

      <div>
        <TrialSection />
      </div>
    </div>
  );
}