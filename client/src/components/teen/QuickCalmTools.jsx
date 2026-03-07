import TeenCard from "./TeenCard";

const tools = [
  {
    title: "Box Breathing",
    description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat for 1 minute.",
    icon: "🫁",
  },
  {
    title: "5-4-3-2-1 Grounding",
    description: "Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.",
    icon: "🌿",
  },
  {
    title: "Positive Affirmation",
    description: "Say: I am trying, I am growing, and I deserve kindness today.",
    icon: "✨",
  },
];

export default function QuickCalmTools() {
  return (
    <TeenCard title="Quick Calm Tools">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {tools.map((tool) => (
          <article
            key={tool.title}
            className="rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/80"
          >
            <div className="text-2xl">{tool.icon}</div>
            <h3 className="mt-2 text-sm font-semibold text-white">{tool.title}</h3>
            <p className="mt-1 text-xs leading-5 text-white/85">{tool.description}</p>
          </article>
        ))}
      </div>
    </TeenCard>
  );
}
