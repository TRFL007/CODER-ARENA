export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_24%)]" />
      <div className="absolute left-[-10%] top-28 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-float-slow" />
      <div className="absolute right-[-5%] top-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl animate-spin-slow" />
      <div className="absolute left-1/2 top-1/3 h-28 w-28 -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl animate-float-slow animation-delay-2000" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#121212] opacity-80" />
    </div>
  );
}
