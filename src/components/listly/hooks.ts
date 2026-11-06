import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const TICK_MS = 50;
const listeners = new Set<() => void>();
let now = 0;
let frame = 0;
let last = 0;

function tick(ts: number) {
  if (ts - last >= TICK_MS) {
    last = ts;
    now = ts;
    listeners.forEach((listener) => listener());
  }
  frame = requestAnimationFrame(tick);
}

function subscribeClock(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    now = performance.now();
    frame = requestAnimationFrame(tick);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) cancelAnimationFrame(frame);
  };
}

const subscribeNever = () => () => {};

export function useClock(live: boolean, fromStart = false) {
  const start = useRef(Infinity);
  const subscribe = useCallback((onTick: () => void) => {
    start.current = performance.now();
    const unsubscribe = subscribeClock(onTick);
    return () => {
      start.current = Infinity;
      unsubscribe();
    };
  }, []);
  const getSnapshot = useCallback(() => (fromStart ? Math.max(0, now - start.current) : now), [fromStart]);
  return useSyncExternalStore(live ? subscribe : subscribeNever, getSnapshot, getSnapshot);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useInView(
  ref: RefObject<Element | null>,
  options: { root?: RefObject<Element | null>; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  const { root, rootMargin } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      root: root?.current ?? null,
      rootMargin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, root, rootMargin]);

  return inView;
}
