import TeenCard from './TeenCard';

const messages = [
  'You made it through today, and that matters.',
  'You are enough, even on hard days.',
  'Asking for help is brave, not weak.',
  'You are not behind. You are healing.',
  'Small progress is still progress.',
  'You are never alone in this space.',
];

export default function KindMessagesWall() {
  return (
    <TeenCard title="Kind Messages Wall" icon="💛" accent="ts-card-kind">
      <div className="ts-kind-grid">
        {messages.map((msg) => (
          <div key={msg} className="ts-kind-msg">{msg}</div>
        ))}
      </div>
    </TeenCard>
  );
}
