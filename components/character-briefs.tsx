import Image from "next/image";

export default function CharacterBriefs() {
  return (
    <aside aria-labelledby="characters-heading" className="space-y-5 lg:col-start-1 lg:row-start-1">
      <h2 id="characters-heading" className="sr-only">The characters</h2>
      <article className="dashboard-panel overflow-hidden">
        <div className="border-b border-panel-border p-5">
          <p className="eyebrow mb-2 text-crimson">The opponent</p>
          <h3 className="font-display text-2xl font-semibold">Lucifero</h3>
        </div>
        <Image
          src="/images/lucifero.jpg"
          alt="Lucifero, a horned figure surrounded by flowing white forms"
          width={487}
          height={629}
          sizes="(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/5] w-full object-cover object-top"
        />
        <div className="p-5">
          <p className="text-sm leading-relaxed text-muted">The formidable opponent at the centre of Asta’s preparation. This plan keeps the challenge ahead in view.</p>
          <details className="character-notes mt-4 border-t border-panel-border pt-2">
            <summary className="text-crimson">Why prepare?</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">Sword control, endurance and teamwork give Asta a focused routine before facing Lucifero. Completing the plan tracks training, not the outcome of the fight.</p>
          </details>
        </div>
      </article>

      <article className="dashboard-panel overflow-hidden">
        <div className="border-b border-panel-border p-5">
          <p className="eyebrow mb-2 text-gold">The fighter</p>
          <h3 className="font-display text-2xl font-semibold">Asta</h3>
        </div>
        <Image
          src="/images/asta.jpg"
          alt="Asta smiling with his sword resting on his shoulder"
          width={597}
          height={335}
          sizes="(min-width: 1024px) 288px, (min-width: 640px) 50vw, 100vw"
          className="aspect-video w-full object-cover"
        />
        <div className="p-5">
          <p className="text-sm leading-relaxed text-muted">A determined Black Bulls fighter preparing for Lucifero, one training task at a time.</p>
          <details className="character-notes mt-4 border-t border-panel-border pt-2">
            <summary className="text-gold">Asta’s training focus</summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">Practise precise anti-magic sword movements, build strength and stamina, and prepare alongside the Black Bulls.</p>
          </details>
        </div>
      </article>
    </aside>
  );
}
