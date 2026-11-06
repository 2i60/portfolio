import { RISE } from "./motion";
import { Bubble, Composer, ListHeader, ProductCard, Status, Steps, Words } from "./parts";

const LABELS = ["Reading Natalie's list", "Checking what she already owns", "Comparing prices under $42"];
const ANSWER =
  "Found a close match she'd like: a stainless pour-over cone with a reusable filter. It brews the same way as the set she saved, fits the mugs she already has, and costs about half as much.";
const STEP_START = 1800;
const STEP_MS = 1000;
const PACE = 45;

export function Research({ t }: { t: number }) {
  const researchEnd = STEP_START + LABELS.length * STEP_MS;
  const answerStart = researchEnd + 300;
  const answerEnd = answerStart + ANSWER.split(" ").length * PACE + 500;
  const working = t < answerEnd;
  const steps = LABELS.map((label, i) => {
    const s = STEP_START + i * STEP_MS;
    return { label, visible: t >= s, done: t >= s + STEP_MS, running: t < s + STEP_MS, style: RISE };
  }).filter((s) => s.visible);

  return (
    <>
      <main className="ls-chat" style={{ padding: "120px 16px 110px", gap: 16 }}>
        <Bubble>Can you find something like the pour-over set, but cheaper?</Bubble>
        <div className="ls-thread">
          <Status
            working={working}
            label={t < STEP_START ? "Thinking" : t < researchEnd ? "Researching" : "Writing"}
            look={t < researchEnd}
            after={t >= researchEnd && <span className="ls-done">· Researched for 3s</span>}
          />
          {t >= STEP_START && <Steps steps={steps} style={{ padding: "2px 0 4px 12px", marginLeft: 12 }} />}
          {t >= answerStart && <Words text={ANSWER} t={t} start={answerStart} pace={PACE} />}
          {t >= answerEnd + 250 && (
            <ProductCard
              badge="Similar to her pick"
              name="Stainless pour-over cone"
              meta="$22 · [RETAILER]"
              style={{ animation: "ls-rise 0.45s ease-out both" }}
            />
          )}
        </div>
      </main>

      <ListHeader />

      <div className="ls-bottom ls-bottom--inset">
        <Composer placeholder="Ask about Natalie's gifts" working={working} />
      </div>
    </>
  );
}
