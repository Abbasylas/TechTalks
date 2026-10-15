import Image from "next/image";
import TrainingPlan from "@/components/training-plan";
import { trainingTasks } from "@/lib/training-tasks";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-background" aria-hidden="true">
        <Image src="/images/black-bulls-background.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background/70" />
      </div>
      <a href="#training-plan" className="skip-link">Skip to training plan</a>
      <main className="mx-auto w-full max-w-[1104px] px-4 py-6 sm:px-8 sm:py-12">
        <header className="dashboard-panel mb-7 p-5 sm:mb-8 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-gold sm:size-20">
                <Image src="/images/asta.jpg" alt="Asta" fill sizes="80px" priority className="object-cover object-[42%_25%]" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow mb-2 text-gold">Black Bulls · Training plan</p>
                <h1 className="font-display text-[30px] font-bold leading-[1.12] tracking-tight sm:text-[40px]">Asta’s Preparation Dashboard</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 border-t border-panel-border pt-4 lg:max-w-[180px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5">
              <Image src="/images/lucifero.jpg" alt="Lucifero" width={44} height={52} className="h-[52px] w-11 rounded-md border border-panel-border object-cover object-[50%_28%]" />
              <p className="text-sm leading-relaxed text-muted">Preparing for<br /><span className="font-display text-base font-semibold text-crimson">Lucifero</span></p>
            </div>
          </div>
          <p className="mt-5 max-w-[65ch] border-t border-panel-border pt-5 text-base leading-relaxed text-muted">
            Lucifero is the threat ahead. Keep your training focused and your team ready for the confrontation.
          </p>
        </header>
        <div id="training-plan" className="scroll-mt-6">
          <TrainingPlan tasks={trainingTasks} />
        </div>
      </main>
    </>
  );
}
