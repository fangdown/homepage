export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Hi, I&apos;m <span className="text-gold">Developer</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted mb-4">
            Full-Stack Developer & Designer
          </p>
          <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
            Building beautiful and functional web experiences. Passionate about
            clean code, elegant interfaces, and user-centered design.
          </p>
        </div>
      </div>
    </section>
  );
}
