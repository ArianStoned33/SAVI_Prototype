import { useEffect, useRef, useState } from "react";

export type HideOnScrollOptions = { threshold?: number };

export default function useHideOnScroll(options: HideOnScrollOptions = {}) {
  const { threshold = 100 } = options;
  const [hidden, setHidden] = useState(false);
  const lastY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const acc = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setHidden(false); return; }

    const onScroll = () => {
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        // accumulate only while scrolling down
        if (delta > 0) {
          acc.current += delta;
          if (acc.current > threshold) setHidden(true);
        } else if (delta < 0) {
          setHidden(false);
          acc.current = 0;
        }
        if (y <= 0) { setHidden(false); acc.current = 0; }
        lastY.current = y;
        raf.current && window.cancelAnimationFrame(raf.current);
        raf.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return hidden;
}
