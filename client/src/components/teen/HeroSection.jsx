export default function HeroSection() {
  return (
    <div className="ts-hero">
      <div className="ts-hero-inner">
        <div className="ts-hero-badge">Teen Support Space</div>
        <h1>We Support You</h1>
        <p>
          A place where you can share what is on your mind — your struggles, emotions,
          and pressures — safely and without judgment.
        </p>
        <div className="ts-hero-stats">
          <div className="ts-hero-stat">
            <span className="ts-hero-stat-val">100%</span>
            <span className="ts-hero-stat-label">Anonymous</span>
          </div>
          <div className="ts-hero-stat">
            <span className="ts-hero-stat-val">24/7</span>
            <span className="ts-hero-stat-label">Available</span>
          </div>
          <div className="ts-hero-stat">
            <span className="ts-hero-stat-val">Safe</span>
            <span className="ts-hero-stat-label">& Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
