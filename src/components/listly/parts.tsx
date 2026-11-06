import type { CSSProperties, ReactNode } from "react";
import { HIDDEN, REVEAL } from "./motion";

export function Mascot({
  size = 28,
  stroke = 2,
  look = false,
  happy = false,
  label,
}: {
  size?: number;
  stroke?: number;
  look?: boolean;
  happy?: boolean;
  label?: string;
}) {
  return (
    <svg
      className="ls-mascot"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
      <rect x="3" y="7" width="18" height="4" rx="1" />
      <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      {happy ? (
        <path d="M8.3 15.6q1.2-1.8 2.4 0M13.3 15.6q1.2-1.8 2.4 0" />
      ) : (
        <g style={{ animation: look ? "ls-look 2.4s ease-in-out infinite" : "none" }}>
          <g className="ls-blink">
            <path d="M9.5 14.5v2M14.5 14.5v2" />
          </g>
        </g>
      )}
    </svg>
  );
}

const ICONS = {
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  out: "M7 17L17 7M8 7h9v9",
  check: "M5 12l5 5L20 7",
  plus: "M12 5v14M5 12h14",
  lock: "M8 11V7a4 4 0 0 1 8 0v4",
  share: "M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5",
  sidebar: "M9 4v16",
};

export function Icon({ name, size = 20, stroke = 2 }: { name: keyof typeof ICONS; size?: number; stroke?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "lock" && <rect x="4" y="11" width="16" height="10" rx="2" />}
      {name === "sidebar" && <rect x="3" y="4" width="18" height="16" rx="3" />}
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Reveal({ on, children, pad = "0 4px" }: { on: boolean; children: ReactNode; pad?: string }) {
  return (
    <div className="ls-reveal" style={{ gridTemplateRows: on ? "1fr" : "0fr" }}>
      <div className="ls-reveal-inner" style={{ padding: pad }}>
        {children}
      </div>
    </div>
  );
}

export function Bubble({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ls-bubble" style={style}>
      {children}
    </div>
  );
}

export function Status({
  working,
  label,
  look,
  after,
  style,
}: {
  working: boolean;
  label: string;
  look: boolean;
  after?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="ls-status" style={style}>
      <Mascot look={look} />
      {working && <span className="ls-shimmer">{label}</span>}
      {after}
    </div>
  );
}

export type Step = { label: string; done: boolean; running: boolean; style?: CSSProperties };

export function Steps({ steps, style }: { steps: Step[]; style?: CSSProperties }) {
  return (
    <div className="ls-steps" style={style}>
      {steps.map((step) => (
        <div className="ls-step" key={step.label} style={step.style}>
          {step.done && <Icon name="check" size={16} stroke={2.4} />}
          {step.running && <span className="ls-spinner" aria-hidden="true" />}
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Words({ text, t, start, pace = 45, style }: { text: string; t: number; start: number; pace?: number; style?: CSSProperties }) {
  return (
    <p className="ls-answer" style={style}>
      {text.split(" ").map((word, i) => (
        <span className="ls-word" key={i} style={t >= start + i * pace ? REVEAL : HIDDEN}>
          {word}
        </span>
      ))}
    </p>
  );
}

export function ProductCard({
  name,
  meta,
  badge,
  primary = true,
  size = 56,
  action = "out",
  style,
  children,
}: {
  name: string;
  meta: string;
  badge?: string;
  primary?: boolean;
  size?: number;
  action?: "out" | "check" | "none";
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className="ls-card" style={style}>
      <div className="ls-photo" style={{ width: size, height: size, borderRadius: size / 4 }} />
      <div className="ls-card-text">
        {badge && <span className="ls-badge">{badge}</span>}
        <span className="ls-name">{name}</span>
        <span className="ls-meta">{meta}</span>
      </div>
      {action === "out" && (
        <span className={`ls-round ${primary ? "ls-round--ink" : "ls-round--fill"}`}>
          <Icon name="out" />
        </span>
      )}
      {action === "check" && <Icon name="check" size={22} stroke={2.4} />}
      {children}
    </div>
  );
}

export function ListHeader({ viewList = true }: { viewList?: boolean }) {
  return (
    <header className="ls-header">
      <div className="ls-avatar">N</div>
      <div className="ls-head-text">
        <span className="ls-head-title">Natalie's Birthday</span>
        <span className="ls-head-meta">[DATE] · 12 items</span>
      </div>
      {viewList && (
        <span className="ls-viewlist">
          <span className="ls-thumbs" aria-hidden="true">
            <span />
            <span />
            <span>+9</span>
          </span>
          View list
        </span>
      )}
    </header>
  );
}

export function Composer({ placeholder, working = false, blur = true }: { placeholder: string; working?: boolean; blur?: boolean }) {
  return (
    <div className={`ls-composer${blur ? " ls-composer--blur" : ""}`}>
      <span className="ls-placeholder">{placeholder}</span>
      <span className="ls-round ls-round--ink">
        {working ? <span className="ls-stop" aria-hidden="true" /> : <Icon name="arrowUp" stroke={2.2} />}
      </span>
    </div>
  );
}

export function Tap({ size, tone = "ink" }: { size: number; tone?: "ink" | "bg" | "gray" }) {
  return <span className={`ls-tap ls-tap--${tone}`} aria-hidden="true" style={{ width: size, height: size }} />;
}
