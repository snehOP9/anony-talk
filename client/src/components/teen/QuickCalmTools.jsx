import TeenCard from './TeenCard';

const tools = [
  { icon: '🫁', title: 'Box Breathing',       desc: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Repeat for 1 minute.' },
  { icon: '🌿', title: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.' },
  { icon: '✨', title: 'Positive Affirmation', desc: '"I am trying, I am growing, and I deserve kindness today."' },
];

export default function QuickCalmTools() {
  return (
    <TeenCard title="Quick Calm Tools" icon="🧘" accent="ts-card-calm">
      <div className="ts-calm-grid">
        {tools.map((tool) => (
          <div key={tool.title} className="ts-calm-tool">
            <div className="ts-calm-icon">{tool.icon}</div>
            <div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </TeenCard>
  );
}
