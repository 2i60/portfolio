import type { CSSProperties } from "react";
import { HIDDEN, RISE } from "./motion";
import { Bubble, Composer, Icon, ListHeader, ProductCard, Reveal, Status, Steps, Words } from "./parts";

const AT = { msg1: 300, head1: 1000, steps1: 2000, ans1: 4300, card1: 5100, card2: 5500, msg2: 7000, head2: 7700, ans2: 9000, btns: 10300 };
const LABELS = ["Reading Natalie's list", "Checking prices under $50", "Ranking by what she wants most"];
const ANSWER_1 = "Two items on her list fit — she marked the first as most wanted.";
const ANSWER_2 = "She hasn't mentioned it. Want me to ask her anonymously? She won't know who's asking or what you're planning to get.";
const PACE = 45;
const STEP_MS = 700;

export function Concierge({ t }: { t: number }) {
  const on = (k: keyof typeof AT) => t >= AT[k];
  const fade = (k: keyof typeof AT): CSSProperties => ({ opacity: on(k) ? 1 : 0, transition: "opacity 0.4s ease 0.1s" });
  const lift = (k: keyof typeof AT): CSSProperties => ({
    opacity: on(k) ? 1 : 0,
    transform: on(k) ? "none" : "translateY(8px)",
    transition: "opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s",
  });

  const steps = LABELS.map((label, i) => {
    const s = AT.steps1 + i * STEP_MS;
    return { label, done: t >= s + STEP_MS, running: t >= s && t < s + STEP_MS, style: t >= s ? RISE : HIDDEN };
  });
  const researchEnd = AT.steps1 + LABELS.length * STEP_MS;
  const ans1End = AT.ans1 + ANSWER_1.split(" ").length * PACE + 300;
  const ans2End = AT.ans2 + ANSWER_2.split(" ").length * PACE + 300;
  const working1 = t >= AT.head1 && t < ans1End;
  const working2 = t >= AT.head2 && t < ans2End;

  return (
    <>
      <main className="ls-chat" style={{ padding: "112px 12px 162px", opacity: t > 14900 ? 0 : 1 }}>
        <Reveal on={on("msg1")}>
          <Bubble style={{ marginTop: 16, ...fade("msg1") }}>What's the best gift I can get her for under $50?</Bubble>
        </Reveal>
        <Reveal on={on("head1")}>
          <Status
            style={{ marginTop: 16, ...fade("head1") }}
            working={working1}
            label={t < AT.steps1 ? "Thinking" : t < researchEnd ? "Researching" : "Writing"}
            look={t >= AT.head1 && t < researchEnd}
            after={t >= ans1End && <span className="ls-done">Researched for 2s</span>}
          />
        </Reveal>
        <Reveal on={on("steps1")}>
          <Steps steps={steps} style={{ margin: "10px 0 0 13px", padding: "2px 0 2px 12px" }} />
        </Reveal>
        <Reveal on={on("ans1")}>
          <Words text={ANSWER_1} t={t} start={AT.ans1} style={{ marginTop: 10 }} />
        </Reveal>
        <Reveal on={on("card1")} pad="0 4px 6px">
          <ProductCard badge="Most wanted" name="Ceramic pour-over set" meta="$42 · [RETAILER]" style={{ marginTop: 10, ...lift("card1") }} />
        </Reveal>
        <Reveal on={on("card2")} pad="0 4px 6px">
          <ProductCard name="Film camera strap" meta="$28 · [RETAILER]" primary={false} style={{ marginTop: 4, ...lift("card2") }} />
        </Reveal>
        <Reveal on={on("msg2")}>
          <Bubble style={{ marginTop: 16, ...fade("msg2") }}>Does she already own a pour-over?</Bubble>
        </Reveal>
        <Reveal on={on("head2")}>
          <Status
            style={{ marginTop: 16, ...fade("head2") }}
            working={working2}
            label={t < AT.ans2 ? "Thinking" : "Writing"}
            look={t >= AT.head2 && t < AT.ans2}
          />
        </Reveal>
        <Reveal on={on("ans2")}>
          <Words text={ANSWER_2} t={t} start={AT.ans2} style={{ marginTop: 10 }} />
        </Reveal>
        <Reveal on={on("btns")} pad="0 4px 2px">
          <div className="ls-actions" style={{ marginTop: 10, ...lift("btns") }}>
            <span className="ls-pill ls-pill--ink">
              <Icon name="lock" size={16} />
              Ask anonymously
            </span>
            <span className="ls-pill ls-pill--line">Not now</span>
          </div>
        </Reveal>
      </main>

      <ListHeader />

      <div className="ls-bottom">
        <div className="ls-suggest">
          <span>What would she love most?</span>
          <span>Similar but cheaper</span>
        </div>
        <div style={{ marginRight: 12 }}>
          <Composer placeholder="Ask about Natalie's gifts" working={working1 || working2} />
        </div>
      </div>
    </>
  );
}
