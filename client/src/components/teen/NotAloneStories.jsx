import TeenCard from './TeenCard';

const stories = [
  { title: 'Bullying at School',  text: 'I finally spoke to one trusted teacher. It was not instant, but I felt less alone after that.' },
  { title: 'Exam Stress',         text: 'I split my study into small blocks and took short breathing breaks. It helped me calm down.' },
  { title: 'Friendship Issues',   text: 'I learned it is okay to step away from people who make me feel unsafe or small.' },
  { title: 'Social Pressure',     text: 'I stopped comparing myself online and focused on my own pace. My anxiety slowly got better.' },
];

export default function NotAloneStories() {
  return (
    <TeenCard title="You're Not Alone" icon="📖" accent="ts-card-stories">
      <div className="ts-stories-grid">
        {stories.map((story) => (
          <div key={story.title} className="ts-story">
            <h3>{story.title}</h3>
            <p>{story.text}</p>
          </div>
        ))}
      </div>
    </TeenCard>
  );
}
