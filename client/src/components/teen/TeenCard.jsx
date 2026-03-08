export default function TeenCard({ title, icon, accent = '', children }) {
  return (
    <div className={'ts-card ' + accent}>
      {title && (
        <div className="ts-card-title">
          {icon && <span className="ts-card-title-icon">{icon}</span>}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
