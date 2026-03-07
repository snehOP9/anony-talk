export default function MoodCalendar({ moodLogs = [] }) {
  const days = [];
  const today = new Date();

  for (let i = -6; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const log = moodLogs.find(l => l.date === dateStr);

    days.push(
      <div className="mood-day" key={dateStr}>
        <span className="emoji">{log ? log.mood : '—'}</span>
        <span>{dayName}</span>
      </div>
    );
  }

  return <div className="mood-calendar">{days}</div>;
}
