import type { CSSProperties } from "react";
import { HIDDEN, REVEAL } from "./motion";
import { Bubble, Composer, Icon, ListHeader, Mascot, ProductCard, Tap } from "./parts";

const T = { tapCard: 900, sheet: 1250, text: 2700, tapBuy: 5600, redirect: 6000, store: 7300, tapStore: 8800, ordered: 9100, back: 10200, done: 11000, fade: 15400 };
const POINTS = [
  { title: "Why she'll love it", body: "It's her top pick — she marked it most wanted, and it suits the slow-morning coffee she mentions on her list." },
  { title: "What people say", body: "Reviewers like the even pour and sturdy ceramic. A few say it runs on the heavier side." },
  { title: "Good to know", body: "Uses standard #2 paper filters, so she won't need anything special to start brewing." },
];

const CONFETTI: CSSProperties[] = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const colors = ["#ff5a5f", "#ffb400", "#34c759", "#2f80ed", "#a259ff", "#ff7ac6", "#00c2d1", "var(--ls-ink)"];
  return Array.from({ length: 48 }, () => {
    const w = 5 + Math.round(rnd() * 6);
    const h = rnd() < 0.3 ? w : 9 + Math.round(rnd() * 8);
    const left = Math.round(rnd() * 380);
    const delay = (rnd() * 1.4).toFixed(2);
    const dur = (2.4 + rnd() * 1.6).toFixed(2);
    const color = colors[Math.floor(rnd() * colors.length)];
    return {
      left,
      width: w,
      height: h,
      borderRadius: h === w ? "50%" : 2,
      background: color,
      animation: `ls-fall ${dur}s cubic-bezier(0.3, 0.1, 0.6, 1) ${delay}s both`,
    };
  });
})();

export function Purchase({ t }: { t: number }) {
  const between = (a: number, b: number) => t >= a && t < b;
  const press = (at: number) => (between(at, at + 200) ? "scale(0.97)" : "none");
  const sheetOn = between(T.sheet, T.redirect + 400);
  const celebrate = t >= T.done;

  return (
    <div className="ls-fill" style={{ opacity: t >= T.fade ? 0 : 1, transition: "opacity 0.5s ease" }}>
      <div className="ls-fill">
        <ListHeader viewList={false} />
        <main className="ls-chat" style={{ padding: "120px 16px 130px", gap: 10 }}>
          <Bubble style={{ marginBottom: 6 }}>What's the best gift I can get her for under $50?</Bubble>
          <Mascot />
          <p className="ls-answer">Two items on her list fit — she marked the first as most wanted.</p>
          <ProductCard
            badge="Most wanted"
            name="Ceramic pour-over set"
            meta="$42 · [RETAILER]"
            style={{ position: "relative", transform: press(T.tapCard), transition: "transform 0.15s ease" }}
          >
            {between(T.tapCard, T.tapCard + 600) && <Tap size={120} />}
          </ProductCard>
          <ProductCard name="Film camera strap" meta="$28 · [RETAILER]" primary={false} />
        </main>
        <div className="ls-bottom ls-bottom--inset">
          <Composer placeholder="Ask about Natalie's gifts" blur={false} />
        </div>
      </div>

      <div className="ls-scrim" style={{ opacity: sheetOn ? 1 : 0 }} />
      <section className="ls-sheet" style={{ transform: sheetOn ? "translateY(0)" : "translateY(105%)" }}>
        <span className="ls-grabber" />
        <div className="ls-sheet-head">
          <div className="ls-photo" style={{ width: 84, height: 84, borderRadius: 20 }} />
          <div className="ls-sheet-title">
            <span className="ls-badge">Most wanted</span>
            <span className="ls-sheet-name">Ceramic pour-over set</span>
            <span className="ls-meta">$42 · [RETAILER]</span>
          </div>
        </div>
        <div className="ls-tabs">
          <span className="is-on">Overview</span>
          <span>Reviews</span>
          <span>Details</span>
        </div>
        <div className="ls-overview">
          <div className="ls-status" style={{ height: 26 }}>
            <Mascot size={26} look={between(T.sheet, T.text)} />
            {between(T.sheet, T.text) && <span className="ls-shimmer">Reading reviews and details</span>}
            {t >= T.text && <span className="ls-overview-title">Listly's overview</span>}
          </div>
          {POINTS.map((p, i) => (
            <div className="ls-point" key={p.title} style={t >= T.text + i * 550 ? REVEAL : HIDDEN}>
              <span className="ls-point-title">{p.title}</span>
              <span className="ls-point-body">{p.body}</span>
            </div>
          ))}
        </div>
        <div className="ls-buy" style={{ transform: press(T.tapBuy) }}>
          Buy on [RETAILER] · $42
          <Icon name="out" size={18} />
          {between(T.tapBuy, T.tapBuy + 600) && <Tap size={140} tone="bg" />}
        </div>
        <span className="ls-checkout-note">You'll check out on [RETAILER]'s site</span>
      </section>

      <div className="ls-overlay ls-redirect" style={{ opacity: between(T.redirect, T.store) || between(T.back, T.done) ? 1 : 0 }}>
        <Mascot size={56} stroke={1.8} />
        <span className="ls-redirect-text">{t < T.store ? "Taking you to [RETAILER]" : "Back to Listly"}</span>
        <span className="ls-spinner ls-spinner--lg" aria-hidden="true" />
      </div>

      <div className="ls-overlay ls-store" style={{ opacity: between(T.store, T.back) ? 1 : 0 }}>
        <div className="ls-store-bar">
          <div className="ls-store-nav">
            <span className="ls-store-back">‹ Listly</span>
            <span className="ls-store-url">[RETAILER].com</span>
          </div>
          <span className="ls-store-brand">[RETAILER]</span>
        </div>
        <div className="ls-store-body">
          <div className="ls-photo" style={{ height: 300, borderRadius: 8 }} />
          <span className="ls-store-name">Ceramic Pour-Over Coffee Set with Dripper and Carafe</span>
          <span className="ls-store-price">$42.00</span>
          <span className="ls-store-ship">Delivery to [ADDRESS] by [DATE]</span>
          <div className="ls-store-buy" style={{ transform: press(T.tapStore) }}>
            Buy now
            {between(T.tapStore, T.tapStore + 600) && <Tap size={140} tone="bg" />}
          </div>
        </div>
        {between(T.ordered, T.back) && (
          <div className="ls-toast">
            <Icon name="check" stroke={2.4} />
            Order placed — returning to Listly
          </div>
        )}
      </div>

      <div className="ls-overlay" style={{ opacity: celebrate ? 1 : 0, transition: "opacity 0.4s ease" }}>
        {celebrate && (
          <>
            <div className="ls-confetti" aria-hidden="true">
              {CONFETTI.map((style, i) => (
                <span key={i} style={style} />
              ))}
            </div>
            <div className="ls-success">
              <div className="ls-success-mascot">
                <span className="ls-success-check">
                  <Icon name="check" size={22} stroke={3} />
                </span>
                <span className="ls-sway">
                  <Mascot size={104} stroke={1.7} happy label="Happy Listly" />
                </span>
              </div>
              <span className="ls-success-title">Gift purchased!</span>
              <p className="ls-success-body">
                I've marked the pour-over set as taken on Natalie's list, so no one doubles up. She won't see who got it.
              </p>
              <ProductCard
                name="Ceramic pour-over set"
                meta="$42 · Arriving [DATE]"
                size={48}
                action="check"
                style={{ width: "100%", marginTop: 10, animation: "ls-rise 0.5s ease-out 0.7s both" }}
              />
            </div>
            <span className="ls-back-chat">Back to chat</span>
          </>
        )}
      </div>
    </div>
  );
}
