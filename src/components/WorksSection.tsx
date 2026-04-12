import { works } from "@/data/works";
import WorkCard from "./WorkCard";

export default function WorksSection() {
  const featuredWorks = works.filter((work) => work.featured);
  const otherWorks = works.filter((work) => !work.featured);

  return (
    <section id="works" className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">
          Featured Works
        </h2>

        {/* Featured Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredWorks.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>

        {/* Other Works */}
        {otherWorks.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-6 text-foreground/80">
              Other Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
