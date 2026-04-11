import { GithubIcon, TwitterIcon, MailIcon } from "./Icons";

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: GithubIcon },
  { name: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
  { name: "Email", href: "mailto:hello@example.com", icon: MailIcon },
];

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Hi, I&apos;m{" "}
            <span className="text-gold">Developer</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted mb-4">
            Full-Stack Developer & Designer
          </p>
          <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
            Building beautiful and functional web experiences. Passionate about clean code,
            elegant interfaces, and user-centered design.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link.name === "Email" ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-gold transition-colors duration-200"
                aria-label={link.name}
              >
                <link.icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
