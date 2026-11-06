import { memo, useLayoutEffect, useRef, useState } from "react";
import { useClock } from "./hooks";
import { SCREENS, type ScreenId, type Theme } from "./screens";

type PhoneProps = {
  screen: ScreenId;
  theme: Theme;
  live: boolean;
  phase?: number;
  restart?: boolean;
  lite?: boolean;
  label?: string;
};

const SCREEN_W = 390;

export const Phone = memo(function Phone({ screen, theme, live, phase = 0, restart = false, lite = false, label }: PhoneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const now = useClock(live, restart);
  const { Component, period, still } = SCREENS[screen];

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--ls-scale", String(el.clientWidth / SCREEN_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [warm, setWarm] = useState(false);
  if (live && !warm) setWarm(true);

  const hold = warm && !restart;
  const t = live || hold ? (((now + phase) % period) + period) % period : still;

  return (
    <div
      ref={ref}
      className={`ls-phone${lite ? " ls-phone--lite" : ""}`}
      data-theme={theme}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <div className={`ls-screen${live || warm ? "" : " ls-static"}`} inert>
        <Component t={t} />
      </div>
    </div>
  );
});
