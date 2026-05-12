import { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouch) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    const handleLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const animate = () => {
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <style>{`
        .cursor-ring, .cursor-dot {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 9999;
          opacity: 0; transition: opacity .25s ease;
          mix-blend-mode: screen;
        }
        .cursor-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4FD1C5;
          box-shadow: 0 0 16px #4FD1C5, 0 0 32px rgba(79,209,197,0.5);
        }
        .cursor-ring {
          width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(79,209,197,0.18) 0%, rgba(108,140,255,0.08) 30%, transparent 60%);
          filter: blur(8px);
        }
        @media (hover: none), (prefers-reduced-motion: reduce) {
          .cursor-ring, .cursor-dot { display: none; }
        }
      `}</style>
    </>
  );
}
