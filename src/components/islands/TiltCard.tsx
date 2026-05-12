import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  max?: number;
  className?: string;
}

export default function TiltCard({ children, max = 8, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouch) return;

    let rafId = 0;
    let targetX = 0, targetY = 0;
    let curX = 0, curY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = x * max;
      targetX = -y * max;
    };
    const onLeave = () => { targetX = 0; targetY = 0; };

    const tick = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.transform = `perspective(900px) rotateX(${curX}deg) rotateY(${curY}deg)`;
      rafId = requestAnimationFrame(tick);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [max]);

  return <div ref={ref} className={`tilt-card ${className}`} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>{children}</div>;
}
