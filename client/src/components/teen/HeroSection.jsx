export default function HeroSection() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-fuchsia-500/80 via-indigo-500/80 to-sky-500/80 p-8 text-white shadow-2xl shadow-indigo-900/40 ring-1 ring-white/30">
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-white/80">Teen Support Space</p>
      <h1 className="text-3xl font-extrabold md:text-5xl">Your Personal Space</h1>
      <p className="mt-4 max-w-3xl text-sm text-white/90 md:text-base">
        A place where you can share what is on your mind - your struggles, emotions, and pressures - safely and without
        judgment.
      </p>
    </section>
  );
}
