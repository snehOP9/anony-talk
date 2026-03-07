import TeenCard from "./TeenCard";

const kindMessages = [
  "You made it through today, and that matters.",
  "You are enough, even on hard days.",
  "Asking for help is brave, not weak.",
  "You are not behind. You are healing.",
  "Small progress is still progress.",
  "You are never alone in this space.",
];

export default function KindMessagesWall() {
  return (
    <TeenCard title="Kind Messages Wall">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kindMessages.map((message) => (
          <div
            key={message}
            className="rounded-2xl border border-white/20 bg-sky-100/90 p-4 text-sm text-slate-800 shadow-md transition hover:shadow-lg"
          >
            {message}
          </div>
        ))}
      </div>
    </TeenCard>
  );
}
