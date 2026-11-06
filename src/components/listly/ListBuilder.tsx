import type { CSSProperties } from "react";
import { HIDDEN, RISE } from "./motion";
import { Bubble, Composer, Icon, Reveal, Status, Steps, Tap, Words } from "./parts";

const AT = { msg1: 300, head1: 1000, q1: 1700, chips1: 2600, echo1: 5400, head2: 6000, q2: 6600, chips2: 7300, echo2: 8800, head3: 9400, steps3: 10000, a3: 11600, recos: 12400 };
const Q1 = "Love it. A few quick questions first — what are you into lately?";
const Q2 = "Nice combo. What price range should I aim for?";
const A3 = "Here are a few picks that fit. Tap + to add any to your list.";
const INTERESTS: [string, number][] = [["Coffee", 3500], ["Running", 0], ["Film photography", 4100], ["Reading", 0], ["Cooking", 0], ["Music", 0]];
const BUDGETS: [string, number][] = [["Under $25", 0], ["$25–50", 8300], ["$50–100", 0], ["Go big", 0]];
const STEP_LABELS = ["Matching coffee and film picks", "Keeping it between $25 and $50"];
const PICKS: [string, string, number][] = [
  ["Burr coffee grinder", "$38 · Coffee", 14200],
  ["Album for 35mm prints", "$26 · Film photography", 14900],
  ["Single-origin coffee sampler", "$29 · Coffee", 0],
];
const PACE = 45;

export function ListBuilder({ t }: { t: number }) {
  const on = (k: keyof typeof AT) => t >= AT[k];
  const fade = (k: keyof typeof AT): CSSProperties => ({ opacity: on(k) ? 1 : 0, transition: "opacity 0.4s ease 0.1s" });
  const between = (a: number, b: number) => t >= a && t < b;

  const chip = (label: string, tapAt: number, dimAfter: number) => {
    const selected = tapAt > 0 && t >= tapAt;
    const style: CSSProperties = selected
      ? { background: "var(--ls-ink)", color: "var(--ls-bg)", borderColor: "var(--ls-ink)" }
      : { background: "var(--ls-bg)", color: "var(--ls-ink)", borderColor: "var(--ls-line)" };
    if (t >= dimAfter && !selected) style.opacity = 0.4;
    if (tapAt > 0 && between(tapAt, tapAt + 180)) style.transform = "scale(0.95)";
    return (
      <span className="ls-chip" key={label} style={style}>
        {label}
        {tapAt > 0 && between(tapAt, tapAt + 550) && <Tap size={90} tone="gray" />}
      </span>
    );
  };
  const doneAt = 4800;
  const doneChip: CSSProperties = { background: "transparent", borderColor: "transparent", color: "var(--ls-ink)", fontWeight: 600 };
  if (t >= doneAt + 400) doneChip.opacity = 0.4;
  if (between(doneAt, doneAt + 180)) doneChip.transform = "scale(0.95)";

  const steps = STEP_LABELS.map((label, i) => {
    const s = AT.steps3 + i * 700;
    return { label, done: t >= s + 700, running: between(s, s + 700), style: t >= s ? RISE : HIDDEN };
  });
  const researchEnd = AT.steps3 + STEP_LABELS.length * 700;
  const added = PICKS.filter(([, , addAt]) => addAt > 0 && t >= addAt).length;
  const q1End = AT.q1 + 12 * PACE + 300;
  const q2End = AT.q2 + 9 * PACE + 300;
  const a3End = AT.a3 + 15 * PACE + 300;

  return (
    <>
      <main className="ls-chat" style={{ padding: "112px 12px 102px", opacity: t > 17900 ? 0 : 1 }}>
        <Reveal on={on("msg1")}>
          <Bubble style={{ marginTop: 16, ...fade("msg1") }}>Can you help me fill out my birthday list?</Bubble>
        </Reveal>
        <Reveal on={on("head1")}>
          <Status style={{ marginTop: 16, ...fade("head1") }} working={between(AT.head1, q1End)} label={t < AT.q1 ? "Thinking" : "Writing"} look={between(AT.head1, AT.q1)} />
        </Reveal>
        <Reveal on={on("q1")}>
          <Words text={Q1} t={t} start={AT.q1} style={{ marginTop: 10 }} />
        </Reveal>
        <Reveal on={on("chips1")} pad="0 4px 2px">
          <div className="ls-chips" style={{ marginTop: 12, ...fade("chips1") }}>
            {INTERESTS.map(([label, tapAt]) => chip(label, tapAt, doneAt))}
            <span className="ls-chip" style={doneChip}>
              Done →{between(doneAt, doneAt + 550) && <Tap size={90} tone="gray" />}
            </span>
          </div>
        </Reveal>
        <Reveal on={on("echo1")}>
          <Bubble style={{ marginTop: 16, ...fade("echo1") }}>Coffee and film photography</Bubble>
        </Reveal>
        <Reveal on={on("head2")}>
          <Status style={{ marginTop: 16, ...fade("head2") }} working={between(AT.head2, q2End)} label={t < AT.q2 ? "Thinking" : "Writing"} look={between(AT.head2, AT.q2)} />
        </Reveal>
        <Reveal on={on("q2")}>
          <Words text={Q2} t={t} start={AT.q2} style={{ marginTop: 10 }} />
        </Reveal>
        <Reveal on={on("chips2")} pad="0 4px 2px">
          <div className="ls-chips" style={{ marginTop: 12, ...fade("chips2") }}>
            {BUDGETS.map(([label, tapAt]) => chip(label, tapAt, 8500))}
          </div>
        </Reveal>
        <Reveal on={on("echo2")}>
          <Bubble style={{ marginTop: 16, ...fade("echo2") }}>$25–50</Bubble>
        </Reveal>
        <Reveal on={on("head3")}>
          <Status
            style={{ marginTop: 16, ...fade("head3") }}
            working={between(AT.head3, a3End)}
            label={t < AT.steps3 ? "Thinking" : t < researchEnd ? "Researching" : "Writing"}
            look={between(AT.head3, researchEnd)}
          />
        </Reveal>
        <Reveal on={on("steps3")}>
          <Steps steps={steps} style={{ margin: "10px 0 0 13px", padding: "2px 0 2px 12px" }} />
        </Reveal>
        <Reveal on={on("a3")}>
          <Words text={A3} t={t} start={AT.a3} style={{ marginTop: 10 }} />
        </Reveal>
        <Reveal on={on("recos")} pad="0 4px 6px">
          <div className="ls-picks">
            {PICKS.map(([name, meta, addAt], i) => {
              const isAdded = addAt > 0 && t >= addAt;
              const tapping = addAt > 0 && between(addAt, addAt + 550);
              return (
                <div className="ls-pick" key={name} style={t >= AT.recos + i * 300 ? { animation: "ls-rise 0.4s ease-out both" } : HIDDEN}>
                  <div className="ls-photo" style={{ width: 48, height: 48, borderRadius: 12 }} />
                  <div className="ls-card-text">
                    <span className="ls-name">{name}</span>
                    <span className="ls-meta">{meta}</span>
                  </div>
                  <span
                    className={`ls-round ${isAdded ? "ls-round--ink" : "ls-round--fill"}`}
                    style={{ position: "relative", overflow: "hidden", transition: "background 0.25s ease, color 0.25s ease, transform 0.15s ease", transform: addAt > 0 && between(addAt, addAt + 180) ? "scale(0.92)" : "none" }}
                  >
                    {isAdded ? (
                      <span style={{ display: "grid", animation: "ls-rise 0.3s ease-out both" }}>
                        <Icon name="check" stroke={2.2} />
                      </span>
                    ) : (
                      <Icon name="plus" stroke={2.2} />
                    )}
                    {tapping && <Tap size={80} tone="gray" />}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </main>

      <header className="ls-header ls-header--owner">
        <span className="ls-round ls-round--fill ls-menu">
          <Icon name="sidebar" size={22} />
        </span>
        <div className="ls-head-text">
          <span className="ls-head-title ls-head-title--lg">Natalie's Birthday</span>
          <span className="ls-head-meta ls-head-meta--lg">[DATE] · {8 + added} items</span>
        </div>
        <span className="ls-share">
          <Icon name="share" size={18} />
          Share
        </span>
      </header>

      <div className="ls-bottom ls-bottom--inset">
        <Composer placeholder="What's on your wishlist lately?" />
      </div>
    </>
  );
}
