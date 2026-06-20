import TrialSection from '@/components/custom/common/traial-section';

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="bg-white">
      {children}

      {/* Full-width Trial Form at the bottom */}
      <div className="w-full bg-white border-t border-slate-100">
        <TrialSection />
      </div>
    </section>
  );
}