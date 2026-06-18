import LearningPathSection from '@/components/custom/common/learning-path-section';
import ValuesSection from '@/components/custom/common/values-section';
import DifferencesSection from '@/components/custom/common/differences-section';
import PenguinAdventuresSection from '@/components/custom/common/penguin-adventures-section';
import CertificateSection from '@/components/custom/common/certificate-section';
import CommitmentsSection from '@/components/custom/common/commitments-section';
import JobSuccessSection from '@/components/custom/common/job-success-section';
import TeacherSection from '@/components/custom/common/teacher-section';

export default function Course() {
  return (
    <div className="bg-white text-gray-800 font-sans">
      <LearningPathSection />
      <ValuesSection />
      <DifferencesSection />
      <PenguinAdventuresSection />
      <CertificateSection />
      <CommitmentsSection />
      <JobSuccessSection />
      <TeacherSection />
    </div>
  );
}
