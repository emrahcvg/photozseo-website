import { useEffect, useRef } from 'react';

const MARKETPLACES = [
  'Amazon','Shopify','Etsy','eBay','Walmart','Trendyol','AliExpress','Mercado Libre',
  'WooCommerce','WhatsApp Catalog','Temu','SHEIN','Tmall','1688','DHgate',
  'Instagram','TikTok Shop','Pinterest','Made-in-China','Global Sources',
  'Allegro','Cdiscount','Bol','Coupang','Otto','Zalando','Rakuten','Wayfair',
];

interface HeroContent {
  eyebrow: string;
  h1Line1Words: string[];
  h1Line2Words: string[];
  h1A11y: string;
  sub: string;
  btnAppSmall: string;
  btnAppBig: string;
  ctaTrial: string;
  ctaCard: string;
  bullets: [string, string, string] | string[];
}

interface HeroProps { content: HeroContent; }

export default function Hero({ content }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const ipadRef = useRef<HTMLDivElement>(null);
  const iphoneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const ipad = ipadRef.current;
    const iphone = iphoneRef.current;
    const glow = glowRef.current;
    if (!hero || !ipad || !iphone || !glow) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;

    let rafId = 0;
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      if (prefersReduced || isTouch) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x;
      targetY = y;
      glow.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      glow.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    };

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      ipad.style.transform = `translate3d(${curX * -28}px, ${curY * -18}px, 0) rotate(-3deg)`;
      iphone.style.transform = `translate3d(${curX * 42}px, ${curY * 28}px, 0) rotate(4deg)`;
      rafId = requestAnimationFrame(tick);
    };

    if (!prefersReduced && !isTouch) {
      hero.addEventListener('mousemove', onMove);
      rafId = requestAnimationFrame(tick);
    }

    // Word reveal animation
    const words = hero.querySelectorAll<HTMLElement>('.h1-word');
    if (prefersReduced) {
      words.forEach((w) => (w.style.opacity = '1'));
    } else {
      words.forEach((w, i) => {
        w.style.transition = 'transform .9s cubic-bezier(.16,1,.3,1), opacity .9s ease';
        w.style.transitionDelay = `${i * 90}ms`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          w.style.opacity = '1';
          w.style.transform = 'translateY(0)';
        }));
      });
    }

    // Parallax scroll: hero content fades, drifts up
    const onScroll = () => {
      if (prefersReduced) return;
      const rect = hero.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -rect.top / rect.height));
      const copy = hero.querySelector<HTMLElement>('.hero-copy');
      if (copy) {
        copy.style.transform = `translate3d(0, ${p * -40}px, 0)`;
        copy.style.opacity = `${1 - p * 0.6}`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      hero.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={heroRef} className="phero">
      <div ref={glowRef} className="phero-glow" aria-hidden="true"/>
      <div className="phero-mesh" aria-hidden="true"/>
      <div className="phero-noise" aria-hidden="true"/>

      <div className="phero-bg-words" aria-hidden="true">
        {MARKETPLACES.slice(0, 14).map((m, i) => (
          <span key={i} style={{ '--i': i } as React.CSSProperties}>{m}</span>
        ))}
      </div>

      <div className="container phero-grid">
        <div className="hero-copy">
          <div className="phero-brand">
            <img src="/icon-128.png" alt="" width="84" height="84" className="phero-brand-icon" aria-hidden="true"/>
            <div className="phero-eyebrow">
              <span className="dot"/>
              <span>{content.eyebrow}</span>
            </div>
          </div>
          <h1 className="phero-h1" aria-label={content.h1A11y}>
            <span className="h1-line">
              {content.h1Line1Words.map((w, i) => (
                <span key={i}>{i > 0 && ' '}<span className="h1-word">{w}</span></span>
              ))}
            </span>
            <span className="h1-line h1-grad">
              {content.h1Line2Words.map((w, i) => (
                <span key={i}>{i > 0 && ' '}<span className="h1-word">{w}</span></span>
              ))}
            </span>
          </h1>
          <p className="phero-sub">{content.sub}</p>
          <div className="phero-cta">
            <a href="#download" className="btn-app">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M16.498 12.43c.02-2.176 1.776-3.221 1.856-3.27-1.013-1.481-2.585-1.683-3.139-1.704-1.319-.134-2.594.78-3.265.78-.685 0-1.713-.766-2.823-.744-1.43.022-2.76.842-3.491 2.131-1.493 2.59-.38 6.415 1.07 8.519.71 1.029 1.541 2.18 2.633 2.14 1.073-.043 1.474-.681 2.766-.681s1.66.681 2.776.659c1.149-.022 1.873-1.034 2.566-2.072.812-1.179 1.143-2.339 1.157-2.398-.026-.011-2.214-.85-2.106-3.36zM14.396 5.879c.575-.722.967-1.713.86-2.722-.831.035-1.866.578-2.466 1.281-.532.612-1.005 1.622-.886 2.588.942.075 1.906-.473 2.492-1.147z"/>
              </svg>
              <span className="btn-app-text">
                <span className="btn-app-small">{content.btnAppSmall}</span>
                <span className="btn-app-big">{content.btnAppBig}</span>
              </span>
            </a>
            <div className="phero-cta-meta">
              <strong>{content.ctaTrial}</strong>
              <span>{content.ctaCard}</span>
            </div>
          </div>
          <ul className="phero-bullets">
            {content.bullets.map((b, i) => (
              <li key={i}><CheckIcon/> {b}</li>
            ))}
          </ul>
        </div>

        <div className="phero-stage" aria-hidden="true">
          <div ref={ipadRef} className="phero-ipad">
            <img src="/screenshots/ipad/slot-01.png" alt="" loading="eager" fetchPriority="high"/>
          </div>
          <div ref={iphoneRef} className="phero-iphone">
            <img src="/screenshots/iphone/slot-01.png" alt="" loading="eager" fetchPriority="high"/>
          </div>
          <div className="phero-orbit phero-orbit-1"/>
        </div>
      </div>

      <style>{`
        .phero {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          padding: 100px 0 80px;
          overflow: hidden;
          isolation: isolate;
        }
        .phero-mesh {
          position: absolute; inset: -200px;
          background:
            radial-gradient(ellipse 1000px 700px at 80% 10%, rgba(79,209,197,0.20), transparent 60%),
            radial-gradient(ellipse 800px 600px at 5% 90%, rgba(108,140,255,0.28), transparent 60%),
            radial-gradient(ellipse 600px 500px at 50% 50%, rgba(182,140,255,0.10), transparent 60%);
          z-index: -2;
        }
        .phero-glow {
          --gx: 50%; --gy: 50%;
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 600px 400px at var(--gx) var(--gy), rgba(79,209,197,0.18), transparent 60%);
          z-index: -1;
          pointer-events: none;
        }
        .phero-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>");
          opacity: 0.04; mix-blend-mode: overlay; pointer-events: none; z-index: -1;
        }
        .phero-bg-words {
          position: absolute; inset: 0; overflow: hidden; pointer-events: none;
          z-index: -1; opacity: 0.05;
          display: grid; align-content: space-between;
          padding: 80px 24px;
        }
        .phero-bg-words span {
          font-size: clamp(60px, 11vw, 160px);
          font-weight: 800; letter-spacing: -0.04em;
          color: #fff; line-height: 0.9;
          animation: scrollWord 60s linear infinite;
          animation-delay: calc(var(--i) * -4s);
          white-space: nowrap;
        }
        @keyframes scrollWord {
          0% { transform: translateX(-30%); }
          100% { transform: translateX(30%); }
        }

        .phero-grid {
          position: relative;
          display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px;
          align-items: center;
          min-height: calc(100vh - 180px);
          min-height: calc(100dvh - 180px);
        }
        .phero-brand { display: flex; align-items: center; gap: 16px; }
        .phero-brand-icon { width: 84px; height: 84px; }
        .phero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 999px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14);
          color: var(--text-muted); font-size: 13px; font-weight: 500;
          backdrop-filter: blur(20px);
        }
        .phero-eyebrow .dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 12px var(--accent);
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.45} }

        .phero-h1 {
          font-size: clamp(44px, 7vw, 96px);
          line-height: 0.98; letter-spacing: -0.04em;
          margin: 22px 0 22px; font-weight: 700;
          display: flex; flex-direction: column; gap: 0;
        }
        .h1-line { display: block; overflow: hidden; }
        .h1-word {
          display: inline-block;
          transform: translateY(110%); opacity: 0;
          will-change: transform, opacity;
        }
        .h1-grad {
          background: linear-gradient(90deg, #4FD1C5 0%, #6C8CFF 50%, #B68CFF 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .phero-sub {
          color: var(--text-muted); font-size: clamp(16px, 1.7vw, 20px);
          max-width: 560px; margin-bottom: 32px; line-height: 1.55;
        }
        .phero-cta { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; margin-bottom: 28px; }
        .phero-cta-meta { font-size: 13px; color: var(--text-muted); line-height: 1.5; display: flex; flex-direction: column; }
        .phero-cta-meta strong { color: var(--text); }
        .phero-bullets { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
        .phero-bullets li { display: inline-flex; align-items: center; gap: 10px; color: var(--text-muted); font-size: 14px; }
        .phero-bullets svg { color: var(--accent); }

        .phero-stage {
          position: relative;
          min-height: 620px;
          display: flex; align-items: center; justify-content: center;
        }
        .phero-stage img { display: block; width: 100%; height: auto; }
        .phero-ipad {
          position: absolute; left: 0; top: 15%;
          width: 520px; max-width: 100%;
          filter: drop-shadow(0 40px 60px rgba(0,0,0,0.55));
          z-index: 1; will-change: transform;
          transform: rotate(-3deg);
        }
        .phero-iphone {
          position: absolute; right: 4%; bottom: 5%;
          width: 270px;
          filter: drop-shadow(0 30px 50px rgba(0,0,0,0.65));
          z-index: 3; will-change: transform;
          transform: rotate(4deg);
        }
        .phero-orbit {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          pointer-events: none; z-index: 0;
        }
        .phero-orbit-1 { width: 620px; height: 620px; left: 50%; top: 50%; transform: translate(-50%, -50%); animation: float 22s ease-in-out infinite; }
        @keyframes float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }

        @media (max-width: 960px) {
          .phero { padding: 60px 0 40px; min-height: 0; }
          .phero-grid { grid-template-columns: 1fr; gap: 32px; min-height: 0; }
          .hero-copy {
            text-align: center;
            display: flex; flex-direction: column; align-items: center;
          }
          .phero-brand { justify-content: center; }
          .phero-h1 { align-items: center; }
          .phero-sub { margin-left: auto; margin-right: auto; }
          .phero-cta { justify-content: center; }
          .phero-cta-meta { align-items: center; text-align: center; }
          .phero-bullets { justify-items: center; }
          .phero-bullets li { justify-content: center; max-width: 460px; }
          .phero-stage { min-height: 460px; }
          .phero-ipad { width: 380px; left: 5%; top: 10%; }
          .phero-iphone { width: 200px; right: 8%; }
          .phero-bg-words { display: none; }
        }
        @media (max-width: 600px) {
          .phero-stage { min-height: 360px; }
          .phero-ipad { width: 280px; }
          .phero-iphone { width: 160px; }
          .phero-h1 { font-size: 44px; }
        }
      `}</style>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

