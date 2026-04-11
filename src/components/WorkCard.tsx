import { GithubIcon, ExternalLinkIcon } from "./Icons";
import type { Work } from "@/data/works";

interface WorkCardProps {
  work: Work;
}

export default function WorkCard({ work }: WorkCardProps) {
  return (
    <div className="group relative bg-card-bg border border-border rounded-lg p-6 transition-all duration-300 hover:border-gold hover:-translate-y-1">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-gold transition-colors duration-200">
            {work.title}
          </h3>
          <p className="text-text-muted mb-4 leading-relaxed">
            {work.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-border/50 text-foreground/70 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {work.githubUrl && (
            <a
              href={work.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-gold transition-colors duration-200"
              aria-label="View on GitHub"
            >
              <GithubIcon size={20} />
            </a>
          )}
          {work.externalUrl && (
            <a
              href={work.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-gold transition-colors duration-200"
              aria-label="View external link"
            >
              <ExternalLinkIcon size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Gold border glow effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10">
        <div className="absolute inset-0 rounded-lg bg-gold/5 blur-xl" />
      </div>
    </div>
  );
}
