interface Feature {
  n: string;
  eyebrow: string;
  h: string;
  sub: string;
  bullets: string[];
  iphone: string;
  ipad: string;
}

interface Props {
  features: Feature[];
  head?: { kicker: string; title: string; sub: string };
  seeInAction?: string;
}

export default function HorizontalFeatures({ features, head, seeInAction }: Props) {
  return (
    <section className="hfeatures">
      <div className="hfeatures-head container">
        <span className="kicker">{head?.kicker ?? 'Every feature, in one place'}</span>
        <h2>{head?.title ?? 'Ten reasons to switch.'}</h2>
        <p>{head?.sub ?? 'Marketplaces, AI camera, SEO auto-fill, B2B quotes and more.'}</p>
      </div>
      <div className="hfeatures-track">
        {features.map((f, i) => (
          <article key={f.n} className="hpanel" data-reveal style={{ transitionDelay: `${(i % 2) * 60}ms` }}>
            <div className="hpanel-copy">
              <span className="kicker">{f.eyebrow}</span>
              <div className="hpanel-num">{f.n} / {features.length.toString().padStart(2, '0')}</div>
              <h3>{f.h}</h3>
              <p>{f.sub}</p>
              <ul className="hpanel-bullets">
                {f.bullets.map((b, i) => <li key={i}><span className="bullet-dot"/>{b}</li>)}
              </ul>
            </div>
            <div className="hpanel-art">
              <div className="hpanel-ipad"><img src={f.ipad} alt="" loading="lazy"/></div>
              <div className="hpanel-iphone"><img src={f.iphone} alt="" loading="lazy"/></div>
              <div className="hpanel-glow"/>
            </div>
          </article>
        ))}
      </div>
      <style>{`
        .hfeatures { position: relative; padding: 80px 0; overflow: hidden; }
        .hfeatures-head { text-align: center; max-width: 720px; margin: 0 auto 48px; padding: 0 24px; }
        .hfeatures-head h2 { font-size: clamp(32px, 5vw, 52px); letter-spacing: -0.025em; line-height: 1.05; margin: 14px 0 10px; }
        .hfeatures-head p { color: var(--text-muted); font-size: 17px; }
        .hfeatures-track {
          display: flex; flex-direction: column; gap: 24px;
          max-width: 1100px; margin: 0 auto; padding: 0 24px;
        }
        .hpanel {
          width: 100%;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 48px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          align-items: center;
          position: relative; overflow: hidden;
          backdrop-filter: blur(20px);
        }
        .hpanel:nth-child(even) { grid-template-columns: 1fr 1fr; }
        .hpanel:nth-child(even) .hpanel-copy { order: 2; }
        .hpanel:nth-child(even) .hpanel-art { order: 1; }
        .hpanel-copy { z-index: 2; }
        .hpanel-num { font-family: var(--font-mono); font-size: 13px; color: var(--text-dim); margin: 10px 0 14px; letter-spacing: 0.08em; }
        .hpanel-copy h3 { font-size: clamp(24px, 3vw, 36px); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 14px; font-weight: 600; }
        .hpanel-copy > p { color: var(--text-muted); font-size: 16px; margin-bottom: 20px; line-height: 1.55; }
        .hpanel-bullets { list-style: none; display: grid; gap: 10px; padding: 0; }
        .hpanel-bullets li { display: flex; gap: 12px; color: var(--text-muted); font-size: 14.5px; line-height: 1.5; }
        .bullet-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-top: 8px; flex-shrink: 0; box-shadow: 0 0 12px var(--accent); }
        .hpanel-art {
          position: relative; height: 360px;
          display: flex; align-items: center; justify-content: center;
        }
        .hpanel-art img { display: block; width: 100%; height: auto; }
        .hpanel-ipad { position: absolute; width: 100%; max-width: 360px; transform: rotate(-2deg); filter: drop-shadow(0 30px 50px rgba(0,0,0,0.5)); z-index: 1; }
        .hpanel-iphone { position: absolute; width: 170px; bottom: 0; right: 4%; transform: rotate(5deg); filter: drop-shadow(0 24px 36px rgba(0,0,0,0.6)); z-index: 2; }
        .hpanel-glow {
          position: absolute; width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(79,209,197,0.22), transparent 60%);
          filter: blur(60px); z-index: 0;
          pointer-events: none;
        }

        @media (max-width: 800px) {
          .hpanel,
          .hpanel:nth-child(even) {
            grid-template-columns: 1fr; padding: 28px; gap: 24px;
          }
          .hpanel:nth-child(even) .hpanel-copy { order: 0; }
          .hpanel:nth-child(even) .hpanel-art { order: 0; }
          .hpanel-art { height: 300px; }
          .hpanel-ipad { max-width: 300px; }
          .hpanel-iphone { width: 140px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hpanel { opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}
