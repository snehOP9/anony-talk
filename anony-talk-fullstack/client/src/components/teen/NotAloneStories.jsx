import TeenCard from "./TeenCard";

const stories = [
  {
    title: "Bullying at School",
    text: "I finally spoke to one trusted teacher. It was not instant, but I felt less alone after that.",
  },
  {
    title: "Exam Stress",
    text: "I split my study into small blocks and took short breathing breaks. It helped me calm down.",
  },
  {
    title: "Friendship Issues",
    text: "I learned it is okay to step away from people who make me feel unsafe or small.",
  },
  {
    title: "Social Pressure",
    text: "I stopped comparing myself online and focused on my own pace. My anxiety slowly got better.",
  },
];

export default function NotAloneStories() {
  return (
    <TeenCard title="You’re Not Alone Stories">
      <div className="grid gap-3 sm:grid-cols-2">
        {stories.map((story) => (
          <article
            key={story.title}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 transition hover:border-cyan-200/70 hover:bg-white/15"
          >
            <h3 className="text-sm font-semibold text-white">{story.title}</h3>
            <p className="mt-2 text-xs leading-5 text-white/85">{story.text}</p>
          </article>
        ))}
      </div>
    </TeenCard>
  );
}
