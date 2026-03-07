export default function TeenCard({ title, children, className = "" }) {
  return (
    <section
      className={`rounded-3xl bg-white/10 p-5 shadow-xl shadow-black/20 ring-1 ring-white/20 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${className}`}
    >
      {title ? <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2> : null}
      {children}
    </section>
  );
}
