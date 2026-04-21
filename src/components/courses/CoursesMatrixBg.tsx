export default function CoursesMatrixBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-[0.12]"
      aria-hidden
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div className="absolute inset-0 font-mono text-[10px] leading-tight text-gold/40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="whitespace-pre opacity-60" style={{ marginLeft: `${(i % 8) * 12}%` }}>
            {"010アイウエオカキクケコ｜AI＋Code—".repeat(3)}
          </div>
        ))}
      </div>
    </div>
  );
}
