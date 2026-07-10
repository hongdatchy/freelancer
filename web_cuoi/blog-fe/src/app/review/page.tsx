import LearnFromStart from "@/components/custom/common/learn-from-start";
import TrialSection from "@/components/custom/common/traial-section";
import GgMapRatingSection from "@/components/custom/review/gg-map-rating-section";
import HallOfFameSection from "@/components/custom/review/hall-of-fame-section";
import JobSuccessSection from "@/components/custom/common/job-success-section";
import ResultSection from "@/components/custom/review/result-section";

export default function Contact() {
  return (
    <div>

      <ResultSection />

      <JobSuccessSection />

      <GgMapRatingSection />

      <HallOfFameSection />

      <LearnFromStart />

      <section className="bg-white mt-16">
        <TrialSection />
      </section>
    </div>
  );
}